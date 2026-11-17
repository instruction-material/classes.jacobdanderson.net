import { spawnSync } from "node:child_process";
import { Buffer } from "node:buffer";
import {
	mkdtempSync,
	mkdirSync,
	readFileSync,
	rmSync,
	writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { expect, it } from "vitest";
import {
	createInputBootstrap,
	createTrustedPythonImportPrelude
} from "@/modules/pythonIdeRuntime";

function runGuarded(root: string, mode: "python" | "data", program: string) {
	return spawnSync(
		"python3",
		[
			"-I",
			"-B",
			"-c",
			[
				createTrustedPythonImportPrelude(root),
				createInputBootstrap("", mode, root),
				program
			].join("\n")
		],
		{ cwd: root, encoding: "utf8", timeout: 20000 }
	);
}

it.each(["python", "data"] as const)(
	"retains for/while stops and a bounded data deadline in %s mode",
	mode => {
		const root = mkdtempSync(join(tmpdir(), "classes-data-guard-"));
		try {
			const result = runGuarded(
				root,
				mode,
				[
					"expected = 5000000 if __classes_python_ide_mode == 'data' else 500000",
					"assert __classes_loop_iteration_limits['for'] == expected",
					"assert __classes_loop_iteration_limits['while'] == 25000",
					"try:",
					"    exec(__classes_compile_student_source('for i in range(expected + 1):\\n    pass\\n', 'main.py'), globals())",
					"except RuntimeError as error:",
					"    assert 'Stopped a long-running for loop' in str(error), str(error)",
					"else:",
					"    raise AssertionError('The for-loop budget was not enforced')",
					"try:",
					"    exec(__classes_compile_student_source('while True:\\n    pass\\n', 'main.py'), globals())",
					"except RuntimeError as error:",
					"    assert 'Stopped a long-running while loop' in str(error), str(error)",
					"else:",
					"    raise AssertionError('The while-loop budget was not enforced')",
					"if __classes_python_ide_mode == 'data':",
					"    __classes_data_deadline = 0",
					"    try:",
					"        __classes_loop_guard__('for')",
					"    except RuntimeError as error:",
					"        assert '30-second runtime budget' in str(error), str(error)",
					"    else:",
					"        raise AssertionError('The data deadline was not enforced')",
					"print('guarded')"
				].join("\n")
			);
			expect(result.status, result.stderr).toBe(0);
			expect(result.stdout.trim()).toBe("guarded");
		} finally {
			rmSync(root, { recursive: true, force: true });
		}
	}
);

it("executes the actual complete image model under data guards without changing its source", () => {
	const fixture = JSON.parse(
		readFileSync(
			resolve(
				process.cwd(),
				"../test/fixtures/machine-learning-offline-sources.json"
			),
			"utf8"
		)
	);
	const root = mkdtempSync(join(tmpdir(), "classes-image-guard-"));
	try {
		const prefix = "ML7-Offline-Weather-Classifier/solution/";
		for (const [path, file] of Object.entries(fixture.files) as Array<
			[string, { content: string; encoding: string }]
		>) {
			if (!path.startsWith(prefix)) continue;
			const destination = join(root, path.slice(prefix.length));
			mkdirSync(dirname(destination), { recursive: true });
			writeFileSync(
				destination,
				Buffer.from(
					file.content,
					file.encoding === "base64" ? "base64" : "utf8"
				)
			);
		}
		const result = runGuarded(
			root,
			"data",
			[
				"globals()['__file__'] = " +
					JSON.stringify(join(root, "main.py")),
				"exec(__classes_compile_student_source(open(__file__).read(), __file__), globals())",
				"print('guarded model complete', __classes_loop_iterations['for'])"
			].join("\n")
		);
		expect(result.status, result.stderr).toBe(0);
		const lines = result.stdout.trim().split("\n");
		const output = JSON.parse(lines[0]!);
		expect(output.limits.originals).toBe(32);
		expect(output.architecture).toContain("260 parameters");
		expect(output.chosen).toBe("color_histogram");
		const count = Number(lines.at(-1)!.split(" ").at(-1));
		expect(count).toBeGreaterThan(500000);
		expect(count).toBeLessThanOrEqual(5000000);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
