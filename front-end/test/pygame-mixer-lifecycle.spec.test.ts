import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import { expect, it } from "vitest";
import { pygameShim } from "@/modules/pythonIdePygame";

function gameShim() {
	const path = resolve(process.cwd(), "src/modules/pythonIdeRuntime.ts");
	const source = ts.createSourceFile(
		path,
		readFileSync(path, "utf8"),
		ts.ScriptTarget.Latest,
		true
	);
	for (const statement of source.statements) {
		if (!ts.isVariableStatement(statement)) continue;
		for (const declaration of statement.declarationList.declarations)
			if (
				declaration.name.getText(source) === "pgzeroShim" &&
				declaration.initializer &&
				ts.isNoSubstitutionTemplateLiteral(declaration.initializer)
			)
				return declaration.initializer.text;
	}
	throw new Error("The actual Pygame Zero runtime source was not found");
}

it("preserves mixer initialization, restart and actual playback/stop bridge calls", () => {
	const code = `
import json, sys, types
sources = json.load(sys.stdin)
calls = []
class Bridge:
    def __getattr__(self, name):
        def call(*args):
            calls.append((name, args))
            return 1 if name == "playTone" else None
        return call
bridge = Bridge()
js = types.ModuleType("js")
js.window = types.SimpleNamespace(**{"__classesPythonIdeGame": bridge})
js.document = types.SimpleNamespace()
js.CSS = types.SimpleNamespace()
sys.modules["js"] = js
pgzero = types.ModuleType("_classes_pgzero")
sys.modules["_classes_pgzero"] = pgzero
exec(sources["pgzero"], pgzero.__dict__)
pygame = types.ModuleType("pygame")
sys.modules["pygame"] = pygame
exec(sources["pygame"], pygame.__dict__)
assert pygame.get_init() is False
assert pygame.mixer.get_init() is None
pygame.mixer.pre_init(22050, -16, 2, 1024)
assert pygame.init() == (1, 0)
assert pygame.get_init() is True
assert pygame.mixer.get_init() == (22050, -16, 2)
pygame.mixer.init(48000, -16, 1)
assert pygame.mixer.get_init() == (22050, -16, 2)
pgzero.sounds.fixture.play(loops=2)
pgzero.music.play("theme")
assert ("playSound", ("fixture", 2)) in calls
assert ("playMusic", ("theme", True)) in calls
pygame.mixer.quit()
assert pygame.get_init() is True
assert pygame.mixer.get_init() is None
assert ("stopSound", ("",)) in calls
assert ("stopMusic", ()) in calls
assert not pgzero.music.is_playing()
for play in (lambda: pgzero.sounds.fixture.play(), lambda: pgzero.music.play("theme"), lambda: pgzero.tone.play("A4", 0.1)):
    before = len([c for c in calls if c[0].startswith("play")])
    try:
        play()
        raise AssertionError("Playback after mixer.quit was accepted")
    except RuntimeError:
        pass
    assert before == len([c for c in calls if c[0].startswith("play")])
pygame.mixer.init(48000, -16, 1, 1000)
assert pygame.mixer.get_init() == (48000, -16, 1)
pgzero.sounds.fixture.play()
assert calls[-1] == ("playSound", ("fixture", 0))
pygame.quit()
assert pygame.get_init() is False and pygame.mixer.get_init() is None
assert calls[-1] == ("stopLoop", ())
for kwargs, error in [({"size": 7}, ValueError), ({"frequency": -1}, ValueError), ({"channels": 3}, ValueError), ({"devicename": "SDL device"}, NotImplementedError)]:
    try:
        pygame.mixer.init(**kwargs)
        raise AssertionError("Invalid or unsupported configuration accepted")
    except error:
        pass
assert pygame.mixer.get_init() is None
print("MIXER_LIFECYCLE_PASS")
`;
	const startedAt = new Date().toISOString();
	const command = ["python3", "-c", code];
	const result = spawnSync(command[0], command.slice(1), {
		input: JSON.stringify({ pgzero: gameShim(), pygame: pygameShim }),
		encoding: "utf8",
		timeout: 10000,
		killSignal: "SIGKILL"
	});
	console.log(
		JSON.stringify({
			task: "pygames-mixer-lifecycle",
			parentPid: process.pid,
			pid: result.pid,
			cwd: process.cwd(),
			command: [
				"python3",
				"-c",
				"actual runtime shims and lifecycle assertions"
			],
			startedAt,
			endedAt: new Date().toISOString(),
			exitCode: result.status,
			timeoutMs: 10000,
			childProcessGroupCleanup:
				"No child processes are created by this bounded Python test"
		})
	);
	expect(result.error).toBeUndefined();
	expect(result.status, result.stderr).toBe(0);
	expect(result.stdout).toContain("MIXER_LIFECYCLE_PASS");
});
