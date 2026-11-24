import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
// eslint-disable-next-line test/no-import-node-test -- Native archive tests.
import { test as nodeTest } from "node:test";
import { strFromU8, unzipSync } from "fflate";
import {
	createProject,
	generateProjects,
	lessons
} from "../front-end/scripts/scratch/generate-projects.mjs";

for (const lesson of lessons) {
	for (const solution of [false, true]) {
		nodeTest(`${lesson.name}: ${solution ? "reference" : "starter"} is a portable Scratch 3 archive`, () => {
			const { archive, project } = createProject(lesson.id, solution);
			const files = unzipSync(archive);
			assert.deepEqual(
				JSON.parse(strFromU8(files["project.json"])),
				project
			);
			assert.equal(project.targets.filter(t => t.isStage).length, 1);
			assert.ok(project.targets.length >= 2);
			for (const target of project.targets) {
				for (const costume of target.costumes) {
					assert.ok(files[costume.md5ext]);
					assert.equal(
						createHash("md5")
							.update(files[costume.md5ext])
							.digest("hex"),
						costume.assetId
					);
				}
				for (const [id, block] of Object.entries(target.blocks)) {
					if (block.next)
						assert.equal(target.blocks[block.next].parent, id);
					if (block.parent) assert.ok(target.blocks[block.parent]);
					if (block.topLevel) assert.equal(block.parent, null);
					for (const input of Object.values(block.inputs)) {
						if (typeof input[1] === "string")
							assert.equal(target.blocks[input[1]].parent, id);
					}
				}
			}
		});
	}
}
nodeTest("keyboard warmup is four blocks; dress-up retains an example and two student areas", () => {
	assert.equal(
		Object.keys(createProject("two-arrows").project.targets[1].blocks)
			.length,
		4
	);
	const targets = createProject("dress-up").project.targets;
	assert.ok(
		Object.keys(targets.find(t => t.name === "Hat").blocks).length > 0
	);
	for (const name of ["Badge", "Boots"]) {
		assert.equal(
			Object.keys(targets.find(t => t.name === name).blocks).length,
			0
		);
	}
});
nodeTest("published starters match the reproducible generator and do not include solutions", async () => {
	for (const lesson of lessons) {
		assert.deepEqual(
			new Uint8Array(
				await readFile(
					new URL(
						`../front-end/public/scratch-projects/${lesson.id}.sb3`,
						import.meta.url
					)
				)
			),
			createProject(lesson.id).archive
		);
	}
});

nodeTest("archives are reproducible across local time zones", () => {
	const script = `import { createProject } from './front-end/scripts/scratch/generate-projects.mjs'; import { createHash } from 'node:crypto'; console.log(createHash('sha256').update(createProject('two-arrows').archive).digest('hex'));`;
	const hashes = ["UTC", "America/Los_Angeles", "Asia/Tokyo"].map(TZ =>
		execFileSync(process.execPath, ["--input-type=module", "-e", script], {
			cwd: new URL("../", import.meta.url),
			env: { ...process.env, TZ },
			encoding: "utf8",
			timeout: 10000
		}).trim()
	);
	assert.equal(new Set(hashes).size, 1);
});

nodeTest("blank independent project has portable artwork but no scripts or solutions", async () => {
	const { project, archive } = createProject("blank");
	assert.equal(project.targets.length, 2);
	for (const target of project.targets) {
		assert.deepEqual(target.blocks, {});
		assert.deepEqual(target.variables, {});
	}
	assert.deepEqual(project.monitors, []);
	assert.deepEqual(new Uint8Array(await readFile(new URL("../front-end/public/scratch-projects/blank.sb3", import.meta.url))), archive);
});

nodeTest("published quiz reference is the completed portable archive", async () => {
	assert.deepEqual(
		new Uint8Array(await readFile(new URL("../front-end/public/scratch-projects/educational-quiz-solution.sb3", import.meta.url))),
		createProject("educational-quiz", true).archive
	);
	assert.notDeepEqual(createProject("educational-quiz").archive, createProject("educational-quiz", true).archive);
});

nodeTest("six reproducible optional remixes belong exclusively to the private teacher output", async (t) => {
	const temp = await mkdtemp(join(tmpdir(), "classroom-remix-pack-"));
	t.after(() => rm(temp, { recursive: true, force: true }));
	const ids = ["click-reactions", "dress-up", "conversation", "dance-loop", "maze-reset", "click-score"];
	const publicNames = ["blank.sb3", "catalog.json", ...lessons.map(l => `${l.id}.sb3`), ...lessons.filter(l => l.publishReference).map(l => `${l.id}-solution.sb3`)].sort();
	const teacherNames = [...lessons.map(l => `${l.id}-solution.sb3`), ...ids.map(id => `${id}-remix-solution.sb3`)].sort();

	await generateProjects(join(temp, "public-only"));
	assert.deepEqual((await readdir(join(temp, "public-only"))).sort(), publicNames);
	for (const run of ["first", "second"]) {
		const output = join(temp, run, "public");
		const teachers = join(temp, run, "teachers");
		await generateProjects(output, teachers);
		assert.deepEqual((await readdir(output)).sort(), publicNames);
		assert.deepEqual((await readdir(teachers)).sort(), teacherNames);
		for (const name of publicNames) {
			assert.deepEqual(await readFile(join(output, name)), await readFile(join(temp, "public-only", name)));
		}
	}
	const privateProject = async (id) => {
		const bytes = await readFile(join(temp, "first", "teachers", `${id}-remix-solution.sb3`));
		return JSON.parse(strFromU8(unzipSync(bytes)["project.json"]));
	};
	const score = await privateProject("click-score");
	const resets = score.targets.flatMap(t => Object.values(t.blocks)
		.filter(b => b.opcode === "data_setvariableto")
		.map(b => [t.name, t.blocks[b.parent]?.opcode, b.fields.VARIABLE[0]]));
	assert.deepEqual(resets, [["Stage", "event_whenflagclicked", "Score"]]);
	const dance = await privateProject("dance-loop");
	const orange = dance.targets.find(t => t.name === "Orange");
	const square = Object.values(orange.blocks).find(b => b.opcode === "control_repeat" && b.inputs.TIMES[1][1] === "4");
	const move = orange.blocks[square.inputs.SUBSTACK[1]];
	const pause = orange.blocks[move.next];
	assert.equal(pause.opcode, "control_wait");
	assert.deepEqual(pause.inputs.DURATION, [1, [4, "0.2"]]);
	for (const name of teacherNames) {
		assert.deepEqual(await readFile(join(temp, "second", "teachers", name)), await readFile(join(temp, "first", "teachers", name)));
	}
});
