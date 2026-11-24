import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";

// Exercise the files written by the private-pack generator in the editor's real VM.
export async function checkClassroomRemixes(frame, teachers) {
	const observations = {};
	async function load(id, { normal = false, sides } = {}) {
		let bytes = await readFile(join(teachers, `${id}${normal ? "" : "-remix"}-solution.sb3`));
		if (sides === 3) {
			// Model the partner's single repeat-count edit on a disposable copy.
			const files = unzipSync(bytes);
			const project = JSON.parse(strFromU8(files["project.json"]));
			const blocks = project.targets.find(t => t.name === "Orange").blocks;
			let b = Object.values(blocks).find(b => b.fields.KEY_OPTION?.[0] === "s");
			while (b && b.opcode !== "control_repeat") b = blocks[b.next];
			assert.deepEqual(b?.inputs.TIMES, [1, [4, "4"]]);
			b.inputs.TIMES[1][1] = "3";
			files["project.json"] = strToU8(JSON.stringify(project));
			bytes = zipSync(files);
		}
		await frame.evaluate(async (bytes) => {
			const vm = window.__courseTestVm;
			vm.stopAll();
			await vm.loadProject(Uint8Array.from(bytes).buffer);
			vm.renderer.draw();
		}, Array.from(bytes));
	}
	const state = () => frame.evaluate(() => {
		const { runtime } = window.__courseTestVm;
		const monitor = runtime.getMonitorState().get("score");
		return {
			sprites: Object.fromEntries(runtime.targets.filter(t => !t.isStage).map(t => [
				t.getName(),
				{ x: t.x, y: t.y, direction: t.direction, color: t.effects.color, layer: t.getLayerOrder() }
			])),
			score: Number(runtime.getTargetForStage().variables.score?.value),
			display: monitor?.get("visible") ? Number(monitor.get("value")) : null
		};
	});
	async function until(label, matches, timeout = 5000) {
		const end = Date.now() + timeout;
		let sample;
		do {
			sample = await state();
			if (matches(sample)) return sample;
			await delay(25);
		} while (Date.now() < end);
		assert.fail(`${label}: ${JSON.stringify(sample)}`);
	}
	const flag = () => frame.evaluate(() => window.__courseTestVm.greenFlag());
	const key = key => frame.evaluate((key) => {
		const vm = window.__courseTestVm;
		vm.postIOData("keyboard", { key, isDown: true });
		vm.postIOData("keyboard", { key, isDown: false });
	}, key);
	const click = name => frame.evaluate((name) => {
		const vm = window.__courseTestVm;
		const t = vm.runtime.targets.find(t => t.getName() === name);
		const { clientWidth: canvasWidth, clientHeight: canvasHeight } = vm.renderer.canvas;
		const point = { x: (0.5 + t.x / 480) * canvasWidth, y: (0.5 - t.y / 360) * canvasHeight, canvasWidth, canvasHeight };
		vm.renderer.draw();
		if (vm.renderer.pick(point.x, point.y) !== t.drawableID) throw new Error(`Cannot click ${name} at its stage position`);
		for (const isDown of [true, false]) vm.postIOData("mouse", { ...point, isDown });
	}, name);
	const xy = (s, name) => [s.sprites[name].x, s.sprites[name].y];
	const at = (s, name, x, y) => xy(s, name).every((v, i) => Math.abs(v - [x, y][i]) < 0.001);

	await load("click-reactions");
	const colors = [];
	for (const [name, blue, orange] of [["Player", 25, 0], ["Orange", 25, 25], ["Orange", 25, 50], ["Space", 25, 0]]) {
		if (name === "Space") await key(" ");
		else await click(name);
		const { sprites } = await until(name, s => s.sprites.Player.color === blue && s.sprites.Orange.color === orange);
		colors.push([sprites.Player.color, sprites.Orange.color]);
	}
	observations["click-reactions"] = colors;

	await load("dress-up");
	await flag();
	await click("Hat");
	await until("Hat worn", s => at(s, "Hat", 0, 70));
	await click("Badge");
	const worn = await until("Badge worn in front", s => at(s, "Badge", 0, 0)
		&& Object.entries(s.sprites).every(([name, t]) => name === "Badge" || t.layer < s.sprites.Badge.layer));
	const start = Date.now();
	await key("r");
	const mid = await until("Badge returning", s => s.sprites.Badge.x > 0 && s.sprites.Badge.x < 170);
	const rack = await until("Badge returned", s => at(s, "Badge", 170, 50));
	const elapsed = Date.now() - start;
	assert.ok(elapsed >= 950, `Badge returned in ${elapsed} ms`);
	assert.deepEqual(xy(rack, "Hat"), [0, 70]);
	await click("Badge");
	const again = await until("Badge worn again", s => at(s, "Badge", 0, 0));
	await flag();
	const firstMove = await until("Hat flag reset", s => !at(s, "Hat", 0, 70));
	const hatAfterFlag = xy(firstMove, "Hat");
	assert.deepEqual(hatAfterFlag, [-175, 100]);
	observations["dress-up"] = { worn: xy(worn, "Badge"), intermediate: xy(mid, "Badge"), returned: xy(rack, "Badge"), returnMs: elapsed, hatDuringReturn: xy(rack, "Hat"), wornAgain: xy(again, "Badge"), hatAfterFlag };

	await load("conversation");
	const scenes = [];
	for (const rehearsal of [false, true, false]) {
		const scene = await frame.evaluate(async (rehearsal) => {
			const vm = window.__courseTestVm;
			const events = [];
			const start = performance.now();
			const text = t => t.getCustomState("Scratch.looks")?.text || "";
			const listen = (target, type, message) => {
				if (message) {
					events.push({ name: target.getName(), message, ms: Math.round(performance.now() - start), peer: text(vm.runtime.targets.find(t => !t.isStage && t !== target)) });
				}
			};
			vm.runtime.on("SAY", listen);
			try {
				if (rehearsal) {
					for (const isDown of [true, false]) vm.postIOData("keyboard", { key: "r", isDown });
				}
				else {
					vm.greenFlag();
				}
				do {
					await new Promise(resolve => setTimeout(resolve, 30));
					if (events.length && !vm.runtime.targets.some(t => !t.isStage && text(t))
						&& !vm.runtime.threads.some(t => !t.updateMonitor)) {
						break;
					}
				} while (performance.now() - start < 8000);
				return { events, elapsed: Math.round(performance.now() - start), cleared: vm.runtime.targets.every(t => !text(t)) };
			}
			finally {
				vm.runtime.off("SAY", listen);
			}
		}, rehearsal);
		assert.deepEqual(scene.events.map(e => [e.name, e.message, e.peer]), rehearsal
			? [["Orange", "Shall we rehearse our scene?", ""], ["Player", "Yes, let’s begin!", ""]]
			: [["Player", "Hello! I am ready to build.", ""], ["Orange", "Me too! What shall we make?", ""]]);
		assert.ok(scene.cleared);
		const [first, second] = scene.events;
		for (const ms of [second.ms - first.ms, scene.elapsed - second.ms]) assert.ok(ms >= 1950 && ms < 3500, `Speech duration ${ms} ms`);
		scenes.push(scene);
	}
	observations.conversation = scenes;

	const dances = [];
	for (const sides of [3, 4]) {
		await load("dance-loop", { sides });
		await key("s");
		const corners = [];
		const route = [[40, 0, 90], [40, -40, 180], [0, -40, -90], [0, 0, 0]];
		for (const [x, y, dir] of route.slice(0, sides)) {
			const s = await until("Square side", s => at(s, "Orange", x, y) && s.sprites.Orange.direction === dir);
			corners.push([...xy(s, "Orange").map(Math.round), dir]);
		}
		const [x, y] = route[sides - 1];
		const end = await until("Square final turn", s => at(s, "Orange", x, y) && s.sprites.Orange.direction === (sides === 3 ? 0 : 90));
		dances.push({ sides, corners, finish: [...xy(end, "Orange").map(Math.round), end.sprites.Orange.direction] });
	}
	observations["dance-loop"] = dances;

	await load("maze-reset");
	await flag();
	const maze = [xy(await until("Maze start", s => at(s, "Player", -180, -120)), "Player")];
	let previous = -180;
	do {
		await key("ArrowRight");
		const step = await until("Right arrow", s => s.sprites.Player.x !== previous);
		previous = step.sprites.Player.x;
		maze.push(xy(step, "Player"));
	} while (previous < -30 && maze.length < 20);
	assert.equal(previous, -30);
	for (let i = 0; i < 3 && previous !== -100; i++) {
		await key("ArrowRight");
		await delay(140);
		const step = await state();
		previous = step.sprites.Player.x;
		maze.push(xy(step, "Player"));
	}
	assert.equal(previous, -100);
	await key("ArrowLeft");
	maze.push(xy(await until("Open space after checkpoint", s => at(s, "Player", -110, -120)), "Player"));
	await flag();
	maze.push(xy(await until("Flag after checkpoint", s => at(s, "Player", -180, -120)), "Player"));
	observations["maze-reset"] = maze;

	const versions = [];
	for (const normal of [true, false]) {
		await load("click-score", { normal });
		const scores = [];
		const actions = ["flag", "Orange", "Player", "Player", "flag", "Orange", "Orange"];
		const expected = normal ? [0, 1, 2, 3, 0, 1, 2] : [0, -1, 0, 1, 0, -1, -2];
		for (const [index, action] of actions.entries()) {
			if (action === "flag") await flag();
			else await click(action);
			const s = await until("Visible Score", s => s.score === expected[index] && s.display === s.score);
			scores.push(s.display);
		}
		versions.push({ version: normal ? "Normal" : "remix", scores });
	}
	observations["click-score"] = versions;
	return observations;
}
