import { sourceGameRuntime } from "./scratch-game-source-runtime.mjs";
import { applyOriginalProgramCorrection } from "../front-end/scripts/scratch/program-corrections.mjs";
import gameCorrections from "../front-end/scripts/scratch/originals/program-corrections.json" with { type: "json" };
import {
	verifyAndRestoreWheel,
	runWheelSource
} from "./scratch-wheel-source-checks.mjs";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Native source/archive verification.
import { test } from "node:test";
import { strFromU8, unzipSync } from "fflate";
import {
	createOriginalProject,
	originalAttributionId,
	originalScratchProjects
} from "../front-end/scripts/scratch/generate-original-projects.mjs";

const compatibility = JSON.parse(
	await readFile(
		new URL(
			"../front-end/scripts/scratch/originals/compatibility.json",
			import.meta.url
		),
		"utf8"
	)
).changes;

function verifyAndRestoreAdvancedGame(loaded, source, id) {
	const correction = gameCorrections.find(r => r.id === id);
	assert.ok(correction);
	for (const patch of [correction, ...(correction.additionalTargets || [])]) {
		const target = loaded.targets.find(t => t.name === patch.target);
		for (const change of patch.changes) {
			assert.deepEqual(
				target.blocks[change.blockId] ?? null,
				change.after
			);
			if (change.before === null) delete target.blocks[change.blockId];
			else target.blocks[change.blockId] = structuredClone(change.before);
		}
		for (const change of patch.variables || []) {
			assert.deepEqual(
				target.variables[change.variableId] ?? null,
				change.after
			);
			if (change.before === null)
				delete target.variables[change.variableId];
			else
				target.variables[change.variableId] = structuredClone(
					change.before
				);
		}
	}
	for (const target of source.targets) {
		const restored = loaded.targets.find(t => t.name === target.name);
		assert.deepEqual(restored.blocks, target.blocks);
		assert.deepEqual(restored.variables, target.variables);
	}
}

async function reviewedGame(id) {
	const { archive } = await createOriginalProject(id);
	const files = unzipSync(archive);
	const corrected = JSON.parse(strFromU8(files["project.json"]));
	const source = JSON.parse(strFromU8(files["SOURCE/original.json"]));
	verifyAndRestoreAdvancedGame(structuredClone(corrected), source, id);
	return { corrected, source };
}

function verifyAndRestoreRocketship(loaded, source) {
	const target = loaded.targets.find(t => t.name === "Rocketship");
	const original = source.targets.find(t => t.name === "Rocketship");
	const blocks = target.blocks;
	const flag = Object.keys(original.blocks).find(
		id => original.blocks[id].opcode === "event_whenflagclicked"
	);
	const show = original.blocks[flag].next;
	const reset = "classes-rocketship-reset-position";
	assert.deepEqual(
		Object.keys(blocks).filter(id => !original.blocks[id]),
		[reset]
	);
	assert.equal(blocks[flag].next, reset);
	assert.deepEqual(blocks[reset], {
		opcode: "motion_gotoxy",
		next: show,
		parent: flag,
		inputs: { X: [1, [4, "0"]], Y: [1, [4, "-204"]] },
		fields: {},
		shadow: false,
		topLevel: false
	});
	assert.equal(blocks[show].opcode, "looks_show");
	assert.equal(blocks[show].parent, reset);
	for (const [id, block] of Object.entries(original.blocks)) {
		const restored = structuredClone(blocks[id]);
		if (id === flag) restored.next = block.next;
		if (id === show) restored.parent = block.parent;
		assert.deepEqual(
			restored,
			block,
			`Only rocket reset links change: ${id}`
		);
	}
	blocks[flag].next = original.blocks[flag].next;
	blocks[show].parent = original.blocks[show].parent;
	delete blocks[reset];
}

function verifyAndRestoreSpeedClick(loaded, source) {
	const target = loaded.targets.find(t => t.name === "Button");
	const original = source.targets.find(t => t.name === "Button");
	const b = target.blocks;
	const additions = ["reset", "start", "finish", "and", "positive"].map(
		key => `classes-speed-click-round-${key}`
	);
	assert.equal(
		Object.keys(b).length,
		Object.keys(original.blocks).length + 5
	);
	assert.deepEqual(
		Object.keys(b)
			.filter(id => !original.blocks[id])
			.sort(),
		additions.sort()
	);
	const changed = new Map([
		["+xgmdXI1G@(/B{9]h/Uh", ["next"]],
		["oPn/}#K24oTQ0){*pAAJ", ["next"]],
		["W.0C4`2f(t`52N(*qpd+", ["topLevel", "parent", "x", "y", "inputs"]],
		["%C$yb|/7!FMQ;-eP_=^1", ["parent"]],
		["~2u};p0pUpjtkC1R{[^V", ["parent"]],
		["hG^=4;_pJAIaPU+~^:=e", ["next"]],
		["quv2uz-8|kxf~l,1HXOo", ["next", "parent"]],
		["?kLAjyC)`,,aPo1.)vyr", ["parent"]],
		["){[Zk3SJuUrAP0SZNz;A", ["topLevel", "parent", "x", "y"]]
	]);
	for (const [id, block] of Object.entries(original.blocks)) {
		const actual = structuredClone(b[id]);
		for (const key of changed.get(id) ?? []) {
			if (Object.hasOwn(block, key)) actual[key] = block[key];
			else delete actual[key];
		}
		assert.deepEqual(
			actual,
			block,
			`Only reviewed Speed Click fields change: ${id}`
		);
	}
	const prefix = "classes-speed-click-round-";
	const flag = Object.entries(b).find(
		([, block]) => block.opcode === "event_whenflagclicked"
	)[0];
	const click = Object.entries(b).find(
		([, block]) => block.opcode === "event_whenthisspriteclicked"
	)[0];
	const chain = [];
	for (let id = b[flag].next; id; id = b[id].next) {
		assert.ok(!chain.includes(id));
		chain.push(id);
	}
	assert.equal(chain[0], `${prefix}reset`);
	for (const key of ["reset", "start", "finish"])
		assert.equal(b[prefix + key].opcode, "data_setvariableto");
	assert.equal(b[`${prefix}reset`].inputs.VALUE[1][1], "False");
	assert.equal(b[`${prefix}start`].inputs.VALUE[1][1], "True");
	assert.equal(b[`${prefix}finish`].inputs.VALUE[1][1], "False");
	const start = chain.indexOf(`${prefix}start`);
	const finish = chain.indexOf(`${prefix}finish`);
	assert.equal(b[chain[start - 1]].inputs.MESSAGE[1][1], "Go!");
	assert.equal(b[chain[start + 1]].opcode, "control_repeat");
	assert.equal(finish, start + 2);
	const guard = b[b[click].next];
	assert.equal(guard.opcode, "control_if");
	assert.deepEqual(guard.inputs.CONDITION, [2, `${prefix}and`]);
	assert.deepEqual(
		guard.inputs.SUBSTACK,
		original.blocks[b[click].next].inputs.SUBSTACK
	);
	const and = b[`${prefix}and`];
	assert.equal(and.opcode, "operator_and");
	assert.deepEqual(and.inputs.OPERAND2, [2, `${prefix}positive`]);
	const running = b[and.inputs.OPERAND1[1]];
	assert.equal(running.opcode, "operator_equals");
	assert.equal(b[`${prefix}positive`].opcode, "operator_gt");
	assert.equal(b[`${prefix}positive`].inputs.OPERAND1[1][1], "Timer");
	assert.equal(b[`${prefix}positive`].inputs.OPERAND2[1][1], "0");
	for (const [id, block] of Object.entries(original.blocks))
		b[id] = structuredClone(block);
	for (const id of additions) delete b[id];
}

function verifyAndRestoreSpellingBee(loaded, source) {
	const blocks = loaded.targets.find(
		target => target.name === "Sprite1"
	).blocks;
	const original = source.targets.find(
		target => target.name === "Sprite1"
	).blocks;
	const changes = new Map([
		["C9V.33_V_Q!H5w!8v)7O", "inputs"],
		["HLDy8|Y8t9dqT4dW{|Ej", "parent"],
		[":BH@23MI?jB?:NVu@;`e", "inputs"],
		["QBiOC]Cs4e]__flUyHP{", "parent"]
	]);
	const added = [
		"classes-spelling-bee-skip-first-count",
		"classes-spelling-bee-half-length",
		"classes-spelling-bee-alternate-count"
	];
	assert.deepEqual(
		Object.keys(blocks)
			.filter(id => !original[id])
			.sort(),
		[...added].sort()
	);
	assert.equal(blocks[added[0]].opcode, "operator_subtract");
	assert.equal(blocks[added[0]].inputs.NUM2[1][1], "1");
	assert.equal(blocks[added[1]].opcode, "operator_divide");
	assert.equal(blocks[added[1]].inputs.NUM2[1][1], "2");
	assert.equal(blocks[added[2]].opcode, "operator_mathop");
	assert.equal(blocks[added[2]].fields.OPERATOR[0], "ceiling");
	for (const [id, before] of Object.entries(original)) {
		const current = structuredClone(blocks[id]);
		const key = changes.get(id);
		if (key) current[key] = before[key];
		assert.deepEqual(
			current,
			before,
			"Only reviewed spelling bounds change: " + id
		);
		blocks[id] = structuredClone(before);
	}
	for (const id of added) delete blocks[id];
}

function verifyAndRestoreDotty(loaded, source) {
	const blocks = loaded.targets.find(
		target => target.name === "Dotty"
	).blocks;
	const original = source.targets.find(
		target => target.name === "Dotty"
	).blocks;
	const clear = Object.keys(original).find(
		id => original[id].opcode === "pen_clear"
	);
	const questions = original[clear].next;
	const trace = Object.keys(original).find(
		id =>
			original[id].opcode === "control_repeat" &&
			Number(original[id].inputs.TIMES[1][1]) === 360
	);
	const go = original[trace].inputs.SUBSTACK[1];
	const advance = original[go].next;
	const reset = "classes-dotty-reset-pen";
	assert.deepEqual(
		Object.keys(blocks).filter(id => !original[id]),
		[reset]
	);
	assert.equal(blocks[clear].next, reset);
	assert.equal(blocks[reset].opcode, "pen_penUp");
	assert.equal(blocks[reset].parent, clear);
	assert.equal(blocks[reset].next, questions);
	assert.equal(blocks[questions].parent, reset);
	assert.deepEqual(blocks[trace].inputs.SUBSTACK, [2, advance]);
	assert.equal(blocks[advance].parent, trace);
	assert.equal(blocks[advance].next, go);
	assert.equal(blocks[go].parent, advance);
	assert.equal(blocks[go].next, null);
	const changed = new Map([
		[clear, ["next"]],
		[questions, ["parent"]],
		[trace, []],
		[advance, ["parent", "next"]],
		[go, ["parent", "next"]]
	]);
	for (const [id, before] of Object.entries(original)) {
		const actual = structuredClone(blocks[id]);
		for (const key of changed.get(id) ?? []) actual[key] = before[key];
		if (id === trace) actual.inputs.SUBSTACK = before.inputs.SUBSTACK;
		assert.deepEqual(
			actual,
			before,
			"Only reviewed Dotty reset/trace links change: " + id
		);
		blocks[id] = structuredClone(before);
	}
	delete blocks[reset];
}

test("all original Scratch archives retain upstream bytes and only declared corrections", async () => {
	assert.equal(originalScratchProjects.length, 168);
	const assets = new Set();
	const records = [];
	const correctedProjects = new Set();
	const correctedAssets = new Set();
	const programCorrections = [];
	for (const original of originalScratchProjects) {
		const source = JSON.parse(
			await readFile(
				new URL(
					`../front-end/scripts/scratch/originals/projects/${original.id}.json`,
					import.meta.url
				),
				"utf8"
			)
		);
		const { archive } = await createOriginalProject(original.id);
		const files = unzipSync(archive);
		assert.equal(
			Object.keys(files)[0],
			"project.json",
			"Scratch's runnable definition is first in the archive"
		);
		assert.deepEqual(
			Object.keys(files).filter(name =>
				/(?:^|\/)project\.json$/.test(name)
			),
			["project.json"],
			"The archived source cannot shadow the runnable project"
		);
		assert.equal(
			createHash("sha256")
				.update(files["SOURCE/original.json"])
				.digest("hex"),
			original.sourceSHA256
		);
		const loaded = JSON.parse(strFromU8(files["project.json"]));
		const stage = loaded.targets.find(target => target.isStage);
		const attribution =
			stage.comments[originalAttributionId(original.id)].text;
		assert.ok(
			attribution.includes(original.author) &&
				attribution.includes(original.url)
		);
		assert.ok(
			attribution.includes(
				"https://creativecommons.org/licenses/by-sa/2.0/"
			)
		);
		assert.ok(strFromU8(files["SOURCE.txt"]).includes(attribution));
		delete stage.comments[originalAttributionId(original.id)];
		if (!source.targets.find(target => target.isStage).comments)
			delete stage.comments;
		const expected = new Set([
			"project.json",
			"SOURCE.txt",
			"SOURCE/original.json"
		]);
		const corrections = new Map();
		if (original.id === "299311602") {
			verifyAndRestoreSpeedClick(loaded, source);
			const correction = JSON.parse(
				strFromU8(files["SOURCE/program-correction.json"])
			);
			assert.equal(correction.id, original.id);
			assert.equal(correction.sourceSHA256, original.sourceSHA256);
			assert.equal(correction.addedBlocks, 5);
			assert.ok(attribution.includes("Active-round score guard"));
			expected.add("SOURCE/program-correction.json");
			programCorrections.push(original.id);
		}
		if (original.id === "332459692") {
			verifyAndRestoreRocketship(loaded, source);
			const correction = JSON.parse(
				strFromU8(files["SOURCE/program-correction.json"])
			);
			assert.equal(correction.id, original.id);
			assert.equal(correction.sourceSHA256, original.sourceSHA256);
			assert.equal(correction.addedBlocks, 1);
			assert.ok(attribution.includes("Restart position reset"));
			expected.add("SOURCE/program-correction.json");
			programCorrections.push(original.id);
		}
		if (original.id === "357452924") {
			verifyAndRestoreSpellingBee(loaded, source);
			const correction = JSON.parse(
				strFromU8(files["SOURCE/program-correction.json"])
			);
			assert.equal(correction.id, original.id);
			assert.equal(correction.sourceSHA256, original.sourceSHA256);
			assert.equal(correction.addedBlocks, 3);
			assert.ok(attribution.includes("String traversal bounds"));
			expected.add("SOURCE/program-correction.json");
			programCorrections.push(original.id);
		}
		if (original.id === "338501835") {
			verifyAndRestoreDotty(loaded, source);
			const correction = JSON.parse(
				strFromU8(files["SOURCE/program-correction.json"])
			);
			assert.equal(correction.id, original.id);
			assert.equal(correction.sourceSHA256, original.sourceSHA256);
			assert.equal(correction.addedBlocks, 1);
			assert.ok(attribution.includes("Absolute-value trace"));
			expected.add("SOURCE/program-correction.json");
			programCorrections.push(original.id);
		}
		if (original.id === "342643080") {
			verifyAndRestoreWheel(loaded, source);
			const correction = JSON.parse(
				strFromU8(files["SOURCE/program-correction.json"])
			);
			assert.equal(correction.id, original.id);
			assert.equal(correction.sourceSHA256, original.sourceSHA256);
			assert.equal(correction.addedBlocks, 0);
			assert.ok(attribution.includes("Final-guess victory"));
			expected.add("SOURCE/program-correction.json");
			programCorrections.push(original.id);
		}

		if (
			[
				"300644693",
				"302811491",
				"302948550",
				"304003593",
				"305082197",
				"328312475",
				"330724703",
				"341945558",
				"342645999",
				"343348430",
				"348994271",
				"357453262"
			].includes(original.id)
		) {
			verifyAndRestoreAdvancedGame(loaded, source, original.id);
			const correction = JSON.parse(
				strFromU8(files["SOURCE/program-correction.json"])
			);
			assert.deepEqual(
				correction,
				gameCorrections.find(r => r.id === original.id)
			);
			assert.ok(attribution.includes(correction.summary));
			expected.add("SOURCE/program-correction.json");
			programCorrections.push(original.id);
		}
		for (const [targetIndex, target] of source.targets.entries()) {
			assert.deepEqual(
				loaded.targets[targetIndex].blocks,
				target.blocks,
				`${original.id}: original program`
			);
			for (const [index, costume] of target.costumes.entries()) {
				const name =
					costume.md5ext ||
					`${costume.assetId}.${costume.dataFormat}`;
				const correction = compatibility[name];
				if (!correction) continue;
				const current = loaded.targets[targetIndex].costumes[index];
				assert.equal(current.md5ext, correction.file);
				assert.equal(current.assetId, correction.file.split(".")[0]);
				assert.equal(
					createHash("md5")
						.update(files[correction.file])
						.digest("hex"),
					current.assetId
				);
				assert.equal(
					createHash("sha256")
						.update(files[correction.file])
						.digest("hex"),
					correction.sha256
				);
				assert.equal(
					createHash("sha256").update(files[name]).digest("hex"),
					correction.sourceSHA256
				);
				current.assetId = costume.assetId;
				if (costume.md5ext) current.md5ext = costume.md5ext;
				else delete current.md5ext;
				expected.add(correction.file);
				correctedAssets.add(correction.file);
				corrections.set(name, { original: name, ...correction });
			}
		}
		assert.deepEqual(
			loaded,
			source,
			`Only attribution and declared SVG/program corrections may change in ${original.id}`
		);
		if (corrections.size) {
			correctedProjects.add(original.id);
			expected.add("SOURCE/compatibility.json");
			assert.deepEqual(
				JSON.parse(strFromU8(files["SOURCE/compatibility.json"])),
				[...corrections.values()]
			);
			assert.ok(attribution.includes("SVG compatibility corrections"));
		}
		for (const target of source.targets) {
			for (const asset of [...target.costumes, ...target.sounds]) {
				const name =
					asset.md5ext || `${asset.assetId}.${asset.dataFormat}`;
				expected.add(name);
				assets.add(name);
				assert.ok(files[name], `${original.id}: ${name}`);
				assert.equal(
					createHash("md5").update(files[name]).digest("hex"),
					name.split(".")[0]
				);
			}
		}
		assert.deepEqual(new Set(Object.keys(files)), expected);
		records.push({
			id: original.id,
			sourceSHA256: original.sourceSHA256,
			sha256: createHash("sha256").update(archive).digest("hex"),
			bytes: archive.length
		});
	}
	assert.equal(assets.size, 505);
	assert.equal(correctedAssets.size, 2);
	assert.equal(correctedProjects.size, 5);
	assert.deepEqual(programCorrections, [
		"299311602",
		"300644693",
		"302811491",
		"302948550",
		"304003593",
		"305082197",
		"328312475",
		"330724703",
		"332459692",
		"338501835",
		"341945558",
		"342643080",
		"342645999",
		"343348430",
		"348994271",
		"357452924",
		"357453262"
	]);
	if (process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR) {
		await mkdir(process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR, {
			recursive: true
		});
		await writeFile(
			path.join(
				process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR,
				"archive-identity.json"
			),
			`${JSON.stringify({ projects: 168, assets: 505, originalSourceBytesRetained: true, unchangedPrograms: records.length - programCorrections.length, declaredProgramCorrections: programCorrections, onlyDeclaredAttributionSvgAndProgramChanges: true, compatibilityAssets: correctedAssets.size, compatibilityProjects: correctedProjects.size, records }, null, 2)}\n`
		);
	}
});

test("original Scratch source identifiers cannot select arbitrary files", async () => {
	for (const value of [
		"../../package",
		"214828609",
		"999999999999",
		"https://scratch.mit.edu/projects/287707460/"
	]) {
		await assert.rejects(
			createOriginalProject(value),
			/Unknown original Scratch project/
		);
	}
});

test("Spelling Bee generated reference bounds produce only the selected letters", async () => {
	const { archive } = await createOriginalProject("357452924");
	const files = unzipSync(archive);
	const project = JSON.parse(strFromU8(files["project.json"]));
	const blocks = project.targets.find(
		target => target.name === "Sprite1"
	).blocks;
	function run(mode, answer, program = blocks) {
		const state = new Map();
		const said = [];
		function value(input) {
			const node = input[1];
			if (typeof node === "string") {
				const b = program[node];
				const arg = key => value(b.inputs[key]);
				switch (b.opcode) {
					case "sensing_answer":
						return answer;
					case "operator_length":
						return String(arg("STRING")).length;
					case "operator_subtract":
						return Number(arg("NUM1")) - Number(arg("NUM2"));
					case "operator_divide":
						return Number(arg("NUM1")) / Number(arg("NUM2"));
					case "operator_mathop":
						assert.equal(b.fields.OPERATOR[0], "ceiling");
						return Math.ceil(Number(arg("NUM")));
					case "operator_letter_of":
						return String(arg("STRING")).charAt(
							Number(arg("LETTER")) - 1
						);
					default:
						throw Error("Unexpected spelling reporter " + b.opcode);
				}
			}
			return node[0] === 12 ? state.get(node[1]) : node[1];
		}
		function stack(id) {
			while (id) {
				const b = program[id];
				switch (b.opcode) {
					case "sensing_askandwait":
						break;
					case "data_setvariableto":
						state.set(b.fields.VARIABLE[0], value(b.inputs.VALUE));
						break;
					case "data_changevariableby":
						state.set(
							b.fields.VARIABLE[0],
							Number(state.get(b.fields.VARIABLE[0])) +
								Number(value(b.inputs.VALUE))
						);
						break;
					case "looks_sayforsecs":
						said.push(value(b.inputs.MESSAGE));
						break;
					case "control_repeat": {
						const count = Math.max(
							0,
							Math.round(Number(value(b.inputs.TIMES)))
						);
						for (let index = 0; index < count; index++)
							stack(b.inputs.SUBSTACK[1]);
						break;
					}
					default:
						throw Error("Unexpected spelling command " + b.opcode);
				}
				id = b.next;
			}
		}
		const hat = Object.values(program).find(
			b =>
				b.opcode === "event_whenkeypressed" &&
				b.fields.KEY_OPTION[0] === mode
		);
		stack(hat.next);
		return said;
	}
	const source = JSON.parse(strFromU8(files["SOURCE/original.json"]));
	verifyAndRestoreSpellingBee(structuredClone(project), source);
	const originalBlocks = source.targets.find(
		target => target.name === "Sprite1"
	).blocks;
	assert.deepEqual(run("2", "CODING", originalBlocks), [
		"O",
		"D",
		"I",
		"N",
		"G",
		""
	]);
	assert.deepEqual(run("5", "CODING", originalBlocks), [
		"C",
		"D",
		"N",
		"",
		"",
		""
	]);
	const words = [
		"",
		"a",
		"ab",
		"abc",
		"CODING",
		"seventh",
		"a b",
		" ",
		"  ab  "
	];
	for (const word of words) {
		const letters = word.split("");
		const expected = [
			letters,
			letters.slice(1),
			letters.slice(0, -1),
			letters.slice(1, -1),
			letters.filter((_, index) => index % 2 === 0),
			[...letters].reverse()
		];
		for (let index = 0; index < 6; index++)
			assert.deepEqual(
				run(String(index + 1), word),
				expected[index],
				JSON.stringify({ mode: index + 1, word })
			);
	}
});

test("Dotty generated reference stamps ten points and completes the absolute-value trace", async () => {
	const { archive } = await createOriginalProject("338501835");
	const files = unzipSync(archive);
	const corrected = JSON.parse(strFromU8(files["project.json"]));
	const source = JSON.parse(strFromU8(files["SOURCE/original.json"]));
	verifyAndRestoreDotty(structuredClone(corrected), source);
	const answers = [-120, -90, -30, -1, 0, 1, 30, 90, 120, 180];
	function run(project, initialPenDown) {
		const blocks = project.targets.find(
			target => target.name === "Dotty"
		).blocks;
		const state = {
			x: 0,
			y: 0,
			penDown: initialPenDown,
			answer: 0,
			questions: 0,
			stamps: [],
			trace: [],
			inputLines: 0
		};
		function value(input) {
			const key = input[1];
			if (typeof key !== "string") return key[1];
			const b = blocks[key];
			const arg = name => value(b.inputs[name]);
			switch (b.opcode) {
				case "sensing_answer":
					return state.answer;
				case "motion_xposition":
					return state.x;
				case "motion_yposition":
					return state.y;
				case "operator_mathop":
					assert.equal(b.fields.OPERATOR[0], "abs");
					return Math.abs(Number(arg("NUM")));
				case "operator_join":
					return String(arg("STRING1")) + String(arg("STRING2"));
				default:
					throw Error("Unexpected Dotty reporter " + b.opcode);
			}
		}
		function stack(id) {
			while (id) {
				const b = blocks[id];
				switch (b.opcode) {
					case "event_whenflagclicked":
						break;
					case "pen_clear":
						state.trace = [];
						break;
					case "pen_penUp":
						state.penDown = false;
						break;
					case "pen_penDown":
						state.penDown = true;
						state.trace.push([state.x, state.y]);
						break;
					case "sensing_askandwait":
						assert.ok(state.questions < answers.length);
						state.answer = answers[state.questions++];
						break;
					case "looks_say":
					case "looks_sayforsecs":
						break;
					case "motion_gotoxy":
					case "motion_glidesecstoxy": {
						const x = Number(value(b.inputs.X)),
							y = Number(value(b.inputs.Y));
						state.x = x;
						state.y = y;
						if (state.penDown) {
							if (state.questions < 10) state.inputLines++;
							else state.trace.push([x, y]);
						}
						break;
					}
					case "motion_changexby":
						state.x += Number(value(b.inputs.DX));
						break;
					case "pen_stamp":
						state.stamps.push([state.x, state.y]);
						break;
					case "control_repeat":
						for (
							let index = 0,
								count = Number(value(b.inputs.TIMES));
							index < count;
							index++
						)
							stack(b.inputs.SUBSTACK[1]);
						break;
					default:
						throw Error("Unexpected Dotty command " + b.opcode);
				}
				id = b.next;
			}
		}
		stack(
			Object.keys(blocks).find(
				id => blocks[id].opcode === "event_whenflagclicked"
			)
		);
		return state;
	}
	const old = run(source, false);
	assert.deepEqual([old.x, old.y], [180, 179]);
	const expected = Array.from({ length: 361 }, (_, index) => [
		index - 180,
		Math.abs(index - 180)
	]);
	for (const previousPenDown of [false, true]) {
		const actual = run(corrected, previousPenDown);
		assert.equal(actual.questions, 10);
		assert.equal(actual.inputLines, 0);
		assert.deepEqual(
			actual.stamps,
			answers.map(x => [x, Math.abs(x)])
		);
		assert.deepEqual(actual.trace, expected);
		assert.deepEqual([actual.x, actual.y], [180, 180]);
		assert.equal(actual.penDown, false);
	}
});

test("Wheel of Fortune recognizes every winning position including the last allowed guess", async () => {
	const source = JSON.parse(
		await readFile(
			new URL(
				"../front-end/scripts/scratch/originals/projects/342643080.json",
				import.meta.url
			),
			"utf8"
		)
	);
	const { archive } = await createOriginalProject("342643080");
	const corrected = JSON.parse(strFromU8(unzipSync(archive)["project.json"]));
	verifyAndRestoreWheel(structuredClone(corrected), source);
	const permutations = items =>
		items.length
			? items.flatMap((item, i) =>
					permutations(items.filter((_, j) => i !== j)).map(rest => [
						item,
						...rest
					])
				)
			: [[]];
	let wins = 0,
		losses = 0,
		upstreamLastGuessFailures = 0;
	for (const [index, word] of ["fun", "new", "happy"].entries()) {
		const letters = [...new Set(word)];
		const budget = letters.length + 5;
		for (const order of permutations(letters)) {
			for (let wrong = 0; wrong <= 5; wrong++) {
				const answers = [...Array(wrong).fill("z"), ...order];
				const actual = runWheelSource(corrected, index + 1, answers);
				assert.equal(actual.questions, answers.length);
				assert.equal(
					actual.said.at(-1),
					"Congratulations, you've guessed it! the word was: " + word
				);
				assert.deepEqual(actual.guessedLetters, order);
				assert.deepEqual(actual.correctLetters, letters);
				if (wrong === 5) {
					const upstream = runWheelSource(source, index + 1, answers);
					assert.match(upstream.said.at(-1), /all out of guesses/);
					upstreamLastGuessFailures++;
				}
				wins++;
			}
		}
		for (const answers of [
			Array(budget).fill("z"),
			Array(budget).fill(""),
			[letters[0], ...Array(budget - 1).fill(letters[0])]
		]) {
			const actual = runWheelSource(corrected, index + 1, answers);
			assert.equal(actual.questions, budget);
			assert.match(actual.said.at(-1), /all out of guesses/);
			assert.ok(actual.guessedLetters.length <= 1);
			losses++;
		}
	}
	assert.equal(wins, 216);
	assert.equal(losses, 9);
	assert.equal(upstreamLastGuessFailures, 36);
});

test("Advanced game patches reject a later target mismatch without partial mutation", async () => {
	const { source } = await reviewedGame("357453262");
	const original = originalScratchProjects.find(p => p.id === "357453262");
	const changed = structuredClone(source);
	changed.targets.find(t => t.name === "Food").blocks[
		"(]8UeofuD+~vG/tQFcq="
	].opcode = "control_wait";
	const before = structuredClone(changed);
	assert.throws(
		() => applyOriginalProgramCorrection(changed, original),
		/input mismatch/
	);
	assert.deepEqual(changed, before);
});

test("Fish Food ends both outcomes, ignores ended collisions and resets position", async () => {
	const { corrected, source } = await reviewedGame("357453262");
	const size = "Ku;G(*g2d(Nh|wi(:5oZ-Player Size-";
	for (const project of [source, corrected]) {
		const rt = sourceGameRuntime(project);
		rt.variable(rt.target("Player"), size, 200);
		rt.run(rt.target("Player"), "7xJ4i3^F@8)#wcfnVSw4");
		assert.equal(rt.state.stopped, project === corrected);
		assert.equal(rt.target("Sprite2").visible, true);
		assert.equal(rt.target("Sprite3").visible, true);
	}
	for (const project of [source, corrected]) {
		const rt = sourceGameRuntime(project, { touch: () => true });
		rt.target("Sprite1").visible = false;
		rt.target("Food").size = 100;
		rt.variable(rt.target("Player"), size, 20);
		rt.run(rt.target("Food"), "dG*oBH9x_pRSPO;ZTv)\u0060");
		assert.equal(rt.state.stopped, true);
		assert.equal(rt.target("Sprite1").visible, project === corrected);
	}
	for (const phase of ["won", "lost"]) {
		const rt = sourceGameRuntime(corrected, { touch: () => true });
		rt.variable(rt.target("Player"), "classes-fish-round-state", phase);
		const before = rt.variable(rt.target("Player"), size);
		rt.run(rt.target("Player"), "7xJ4i3^F@8)#wcfnVSw4");
		rt.run(rt.target("Food"), "dG*oBH9x_pRSPO;ZTv)\u0060");
		assert.equal(rt.variable(rt.target("Player"), size), before);
		assert.deepEqual(rt.state.events, []);
	}
	const rt = sourceGameRuntime(corrected);
	const player = rt.target("Player");
	player.x = 120;
	player.y = -40;
	player.visible = false;
	rt.variable(player, "classes-fish-round-state", "won");
	for (const [id, b] of Object.entries(player.blocks))
		if (b.opcode === "event_whenflagclicked") rt.run(player, id);
	assert.deepEqual(
		[player.x, player.y, player.visible, player.size],
		[0, 0, true, 20]
	);
	assert.equal(Number(rt.variable(player, size)), 20);
	assert.equal(rt.variable(player, "classes-fish-round-state"), "playing");
});

test("Platformer gravity and ceiling handling return to the level controller", async () => {
	const { corrected, source } = await reviewedGame("343348430");
	for (const project of [source, corrected]) {
		const rt = sourceGameRuntime(project, {
			color: (_t, color) => color === "#79654a"
		});
		const pal = rt.target("Pal");
		const result = rt.procedure(pal, "stay on ground");
		assert.equal(!!result.scriptStopped, project === source);
	}
	for (const project of [source, corrected]) {
		const rt = sourceGameRuntime(project, {
			color: (t, color) => color === "#00cc44" && (t.y >= 30 || t.y <= 0)
		});
		const pal = rt.target("Pal");
		pal.x = 0;
		pal.y = 20;
		const result = rt.procedure(pal, "jump");
		assert.equal(!!result.scriptStopped, project === source);
		if (project === corrected) {
			assert.equal(pal.y, 25);
			assert.equal(rt.procedure(pal, "stay on ground").returned, true);
			assert.equal(pal.y, 0);
		}
	}
	const rt = sourceGameRuntime(corrected, {
		color: (_t, color) => color === "#79654a"
	});
	const result = rt.run(rt.target("Pal"), "9Ty](*JvMo#%?ti_1_1;");
	assert.equal(result.returned, true);
	assert.deepEqual([rt.target("Pal").x, rt.target("Pal").y], [-204, 37]);
	assert.ok(rt.state.events.includes("sound:Slide Whistle"));
});

test("Fruit Ninja clones keep independent kinds and countdown/misses terminate", async () => {
	const { corrected, source } = await reviewedGame("348994271");
	for (const project of [source, corrected]) {
		let selected = 1;
		const rt = sourceGameRuntime(project, { random: () => selected });
		const first = rt.clone("Fruit", " A"),
			second = rt.clone("Fruit", " B");
		const switchId = Object.keys(first.blocks).find(
			id => first.blocks[id].opcode === "looks_switchcostumeto"
		);
		const stopBefore = first.blocks[switchId].next;
		rt.run(first, "neF=:wPJCAM$4Owr+C+o", stopBefore);
		selected = 4;
		rt.run(second, "neF=:wPJCAM$4Owr+C+o", stopBefore);
		assert.deepEqual([first.costume, second.costume], [1, 2]);
		assert.equal(rt.expression(second, ".vB7u?XW~EK4@H{Z]G|G"), true);
		assert.equal(
			rt.expression(first, ".vB7u?XW~EK4@H{Z]G|G"),
			project === source
		);
	}
	for (const project of [source, corrected]) {
		const rt = sourceGameRuntime(project);
		rt.run(rt.target("Blade"), "{BA^/qV:/.2[~SdfPs(?");
		assert.equal(rt.state.stopped, project === corrected);
		if (project === corrected) {
			assert.equal(rt.state.waits, 60);
			assert.equal(
				rt.variable(rt.target("Blade"), "0X*V_C]Q6ePKZ[W%dxkr"),
				0
			);
			assert.equal(
				rt.state.targets.find(t => t.isStage).backdrop,
				"Rays"
			);
		}
	}
	for (const misses of [0, 2, 3, 4, 8]) {
		const rt = sourceGameRuntime(corrected);
		rt.variable(rt.target("Blade"), "CJg!#vP~DGeJ,CsQpWi2", misses);
		rt.run(rt.target("Blade"), "S+GPTixnVAyz3W9WRl[y");
		assert.equal(rt.state.stopped, misses >= 3);
	}
});

test("Check-In drawing clones own their side lengths and reset pen entry", async () => {
	const { corrected, source } = await reviewedGame("341945558");
	for (const project of [source, corrected]) {
		const rt = sourceGameRuntime(project);
		const first = rt.clone("Spider", " A"),
			second = rt.clone("Spider", " B");
		const hat = "375/[h\u0060%7uf)3zxm0tFy";
		const stopBefore = Object.keys(first.blocks).find(id => {
			const b = first.blocks[id];
			return (
				b.opcode === "control_repeat" &&
				b.inputs.TIMES[1][1] === "2" &&
				b.parent &&
				first.blocks[b.parent].opcode === "control_if_else"
			);
		});
		assert.ok(stopBefore);
		first.penDown = true;
		first.direction = 30;
		second.penDown = true;
		second.direction = -30;
		rt.run(first, hat, stopBefore);
		rt.run(second, hat, stopBefore);
		const lengthId =
			project === corrected
				? "classes-checkin-clone-side"
				: "wH/Q,H7ypw\u0060vP~C}4s-]";
		rt.variable(first, lengthId, 80);
		assert.equal(
			Number(rt.variable(second, lengthId)),
			project === corrected ? 20 : 80
		);
		assert.equal(first.penAtRandomPlacement, project === source);
		assert.equal(first.direction, project === corrected ? 90 : 30);
	}
});

test("Check-In random classification stores one draw at all branch boundaries", async () => {
	const { corrected, source } = await reviewedGame("342645999");
	assert.equal(
		source.targets.find(t => t.isStage).variables[
			"classes-checkin-random-number"
		],
		undefined
	);
	for (const value of [1, 9, 10, 20]) {
		let calls = 0;
		const rt = sourceGameRuntime(corrected, {
			random: (from, to) => {
				assert.deepEqual([from, to], [1, 20]);
				calls++;
				return value;
			}
		});
		rt.run(rt.target("Andie"), "sZ2f~Rlu-n@$CjWw\u0060(C8");
		assert.equal(calls, 1);
		assert.equal(
			Number(
				rt.variable(rt.target("Andie"), "classes-checkin-random-number")
			),
			value
		);
		assert.deepEqual(rt.state.said, [
			"11",
			value < 10
				? "Wow, that's a small number!"
				: "Whoa, that's a big number!",
			"The remainder of dividing 11 by 2 is: 1"
		]);
	}
});

test("Bootcamp remixes keep upstream source, credits and media with the editable answer", async () => {
	const references = JSON.parse(await readFile(new URL(
		"../front-end/scripts/scratch/bootcamp-references.json", import.meta.url
	)));
	for (const ref of Object.values(references).filter(id => id.endsWith("-reference"))) {
		const id = ref.split("-")[0];
		const base = await createOriginalProject(id);
		const remix = await createOriginalProject(id, true);
		const sourceFiles = unzipSync(base.archive);
		const remixFiles = unzipSync(remix.archive);
		for (const [name, bytes] of Object.entries(sourceFiles)) {
			if (name !== "project.json" && name !== "SOURCE.txt") assert.deepEqual(remixFiles[name], bytes, ref + "/" + name);
		}
		assert.notDeepEqual(remix.project.targets.map(t => t.blocks), base.project.targets.map(t => t.blocks));
		const credit = remix.project.targets[0].comments[originalAttributionId(id)].text;
		assert.ok(credit.includes(base.original.url) && credit.includes(base.original.author));
		assert.match(credit, /Bootcamp instructor remix/);
		for (const target of remix.project.targets) {
			for (const [blockId, block] of Object.entries(target.blocks)) {
				if (Array.isArray(block)) continue;
				if (block.topLevel) assert.equal(block.parent, null, blockId);
				if (block.next) assert.equal(target.blocks[block.next].parent, blockId);
				for (const input of Object.values(block.inputs)) {
					assert.ok(Array.isArray(input), "SB3 input on " + blockId);
					if (typeof input[1] === "string") assert.equal(target.blocks[input[1]].parent, blockId);
				}
			}
		}
	}
});
