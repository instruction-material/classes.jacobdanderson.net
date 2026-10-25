import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import { expect, it } from "vitest";

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
		for (const declaration of statement.declarationList.declarations) {
			if (
				declaration.name.getText(source) === "pgzeroShim" &&
				declaration.initializer &&
				ts.isNoSubstitutionTemplateLiteral(declaration.initializer)
			) {
				return declaration.initializer.text;
			}
		}
	}
	throw new Error("The actual Pygame Zero runtime source was not found");
}

it("preserves Pygame Zero text positions and formatting across the actual Python bridge", () => {
	const code = `import json, sys, types
calls = []
bridge = types.SimpleNamespace(drawText=lambda *args: calls.append(args))
js = types.ModuleType("js")
js.window = types.SimpleNamespace(**{"__classesPythonIdeGame": bridge})
sys.modules["js"] = js
namespace = {}
exec(json.load(sys.stdin), namespace)
draw = namespace["_ScreenDraw"]()
positions = {"topleft": (0,0), "midtop": (.5,0), "topright": (1,0), "midleft": (0,.5), "center": (.5,.5), "midright": (1,.5), "bottomleft": (0,1), "midbottom": (.5,1), "bottomright": (1,1)}
for name, anchor in positions.items():
    draw.text("two\\nlines", **{name: (80,60)})
    args = calls[-1]
    assert args[:5] == ("two\\nlines",80,60,"white",24), (name,args)
    assert args[5:9] == (*anchor,anchor[0],1), (name,args)
draw.text("right", right=160, top=4, fontsize=30, shadow=(2,-1), scolor="orange")
assert calls[-1][1:] == (160,4,"white",30,1,0,1,1,2,-1,"orange"), calls[-1]
draw.text("custom", (12,34), anchor=(.2,.7), align="right", lineheight=1.5)
assert calls[-1][1:9] == (12,34,"white",24,.2,.7,1,1.5), calls[-1]
draw.text("default", (3,5))
assert calls[-1][1:] == (3,5,"white",24,0,0,0,1,0,0,"black"), calls[-1]
print("PGZERO_TEXT_ANCHORS_PASS")
`;
	const startedAt = new Date().toISOString();
	const result = spawnSync("python3", ["-c", code], {
		input: JSON.stringify(gameShim()),
		encoding: "utf8",
		timeout: 10000,
		killSignal: "SIGKILL"
	});
	console.log(
		JSON.stringify({
			task: "pygames-text-anchors",
			parentPid: process.pid,
			pid: result.pid,
			cwd: process.cwd(),
			command: [
				"python3",
				"-c",
				"actual pgzero shim and positioning assertions"
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
	expect(result.stdout).toContain("PGZERO_TEXT_ANCHORS_PASS");
});
