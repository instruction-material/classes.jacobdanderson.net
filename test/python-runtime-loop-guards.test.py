"""Execute the real runtime compiler's loop guards, including imported classes."""
import argparse
import ast
import base64
import builtins
import json
from pathlib import Path
import re
import signal
import textwrap
import unittest

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("--runtime", type=Path,
                    default=ROOT / "front-end/src/modules/pythonIdeRuntime.ts")
args, remaining = parser.parse_known_args()
source = args.runtime.read_text()
guard_name = re.search(r"def (__classes_loop_guard(?:__)?)\(kind\):", source)[1]
start = source.index("def " + guard_name + "(kind):")
end = source.index("_classes_compile_student_source =", start)
fragment = source[start:end].replace(r"\\", "\\")
fallback = re.search(r"const WHILE_LOOP_ITERATION_LIMIT = (\d+);", source)[1]
fragment = fragment.replace("${WHILE_LOOP_ITERATION_LIMIT}", fallback)
compiled_runtime = compile(fragment, "runtime-loop-guard.py", "exec")
missing = object()


class RuntimeLoopGuards(unittest.TestCase):
    def setUp(self):
        self.runtime = {
            "ast": ast,
            "textwrap": textwrap,
            "__classes_python_ide_mode": "pgzero",
            "_classes_turtle_animation_call_names": set(),
            "__classes_loop_iterations": {"for": 0, "while": 0},
            "__classes_loop_iteration_limits": {"for": 4, "while": 4},
        }
        exec(compiled_runtime, self.runtime)
        self.prior_guard = getattr(builtins, guard_name, missing)
        setattr(builtins, guard_name, self.runtime[guard_name])

    def tearDown(self):
        if self.prior_guard is missing:
            delattr(builtins, guard_name)
        else:
            setattr(builtins, guard_name, self.prior_guard)

    def program(self, text, filename="student.py"):
        namespace = {"__name__": "imported_student_project"}
        code = self.runtime["__classes_compile_student_source"](
            textwrap.dedent(text), filename)
        exec(code, namespace)
        return namespace

    def test_for_loop_in_class_method(self):
        namespace = self.program("""
            class Game:
                def total(self):
                    total = 0
                    for value in [1, 2, 3]:
                        total += value
                    return total
        """)
        self.assertEqual(namespace["Game"]().total(), 6)
        self.assertEqual(self.runtime["__classes_loop_iterations"]["for"], 3)

    def test_while_loop_in_nested_class_method(self):
        namespace = self.program("""
            class World:
                class _Actor:
                    @classmethod
                    def countdown(cls):
                        remaining = 3
                        while remaining:
                            remaining -= 1
                        return remaining
        """)
        self.assertEqual(namespace["World"]._Actor.countdown(), 0)
        self.assertEqual(self.runtime["__classes_loop_iterations"]["while"], 3)

    def test_for_loop_limit_in_class_method(self):
        namespace = self.program("""
            class Game:
                def spin(self):
                    for value in range(100):
                        pass
        """)
        with self.assertRaisesRegex(RuntimeError, "Stopped a long-running for loop"):
            namespace["Game"]().spin()
        self.assertEqual(self.runtime["__classes_loop_iterations"]["for"], 5)

    def test_infinite_while_still_stops(self):
        namespace = self.program("""
            class Game:
                def spin(self):
                    while True:
                        pass
        """)
        with self.assertRaisesRegex(RuntimeError, "Stopped a long-running while loop"):
            namespace["Game"]().spin()
        self.assertEqual(self.runtime["__classes_loop_iterations"]["while"], 5)

    def test_top_level_for_loop_unchanged(self):
        self.assertEqual(self.program("total = 0\nfor value in [1, 2, 3]:\n    total += value\n")["total"], 6)

    def test_imported_capstone_class_ticks(self):
        fixture = json.loads((ROOT / "test/fixtures/pygames-core-verified-source.json").read_text())
        entry = fixture["files"]["PG-CORE-Arena-Capstone/solution/game_logic.py"]
        text = base64.b64decode(entry["contentBase64"], validate=True).decode()
        game = self.program(text, "game_logic.py")["Game"]()
        game.start()
        game.tick(0.02, {"right"})
        self.assertGreater(game.x, 96)
        self.assertGreater(self.runtime["__classes_loop_iterations"]["for"], 0)


if __name__ == "__main__":
    def deadline(_signum, _frame):
        raise TimeoutError("Runtime loop guard regression test exceeded 10 seconds.")

    previous = signal.signal(signal.SIGALRM, deadline)
    signal.alarm(10)
    try:
        unittest.main(argv=[__file__, *remaining])
    finally:
        signal.alarm(0)
        signal.signal(signal.SIGALRM, previous)
