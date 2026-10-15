import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createProject } from "../front-end/scripts/scratch/generate-projects.mjs";

// The browser fixture exposes the real GUI VM through one test-only assignment
// in its served adapter. These checks do not replace its scheduler or renderer.
export async function checkScratchGameProgression(page, frame, files, openFile) {
	await frame.waitForFunction(() => Boolean(window.__courseTestVm));
	const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
	const snapshot = () => frame.evaluate(() => {
		const targets = window.__courseTestVm.runtime.targets;
		return {
			values: Object.fromEntries(Object.entries(targets.find(t => t.isStage).variables).map(([id, variable]) => [id, Number(variable.value)])),
			sprites: Object.fromEntries(targets.filter(t => !t.isStage).map(t => [t.sprite.name, { x: t.x, y: t.y, visible: t.visible }]))
		};
	});
	const setCase = (values = {}, positions = {}) => frame.evaluate(({ values, positions }) => {
		const targets = window.__courseTestVm.runtime.targets;
		const stage = targets.find(t => t.isStage);
		for (const [id, value] of Object.entries(values)) stage.variables[id].value = value;
		for (const [name, [x, y]] of Object.entries(positions)) targets.find(t => t.sprite?.name === name).setXY(x, y);
	}, { values, positions });
	const flag = async () => {
		await frame.evaluate(() => window.__courseTestVm.greenFlag());
		await pause(90);
	};
	const waitValues = values => frame.waitForFunction((values) => {
		const stage = window.__courseTestVm.runtime.targets.find(t => t.isStage);
		return Object.entries(values).every(([id, value]) => Number(stage.variables[id]?.value) === value);
	}, { timeout: 5000 }, values);
	const waitRespawn = () => frame.waitForFunction(() => window.__courseTestVm.runtime.targets.find(t => t.sprite?.name === "Token").y > 80, { timeout: 5000 });
	const focus = () => frame.click("[class*=\"stage_stage_\"] > div > canvas");
	async function load(id, solution) {
		await page.keyboard.up("ArrowLeft");
		await page.keyboard.up("ArrowRight");
		await page.keyboard.up("Space");
		await frame.evaluate(async (bytes) => {
			const vm = window.__courseTestVm;
			vm.stopAll();
			for (const key of ["left arrow", "right arrow", "space"]) vm.postIOData("keyboard", { key, isDown: false });
			await vm.loadProject(new Uint8Array(bytes).buffer);
		}, Array.from(createProject(id, solution).archive));
		await flag();
		await focus();
	}
	async function roundTrip(id) {
		await frame.evaluate(() => window.__courseTestVm.stopAll());
		const bytes = new Uint8Array(await frame.evaluate(async () => Array.from(new Uint8Array(await (await window.__courseTestVm.saveProjectSb3()).arrayBuffer()))));
		const archive = unzipSync(bytes);
		const project = JSON.parse(strFromU8(archive["project.json"]));
		for (const target of project.targets) {
			for (const costume of target.costumes) assert.ok(archive[costume.md5ext]);
		}
		const filename = join(files, `${id}-runtime-reopened.sb3`);
		await writeFile(filename, bytes);
		await openFile(filename);
		await flag();
		await focus();
	}
	async function catchDrop(expected) {
		await setCase({}, { Player: [-120, -130], Token: [-120, -125] });
		await waitValues({ score: expected });
		await waitRespawn();
		await pause(90);
		assert.equal((await snapshot()).values.score, expected, "A catch is counted once after respawn");
	}
	async function missDrop(expected) {
		await setCase({}, { Player: [-120, -130], Token: [120, -155] });
		await waitRespawn();
		assert.equal((await snapshot()).values.score, expected);
	}
	for (const solution of [false, true]) {
		await load("falling-catch", solution);
		let current = await snapshot();
		assert.equal(current.values.score, 0);
		assert.equal(current.sprites.Player.x, -120);
		assert.ok(current.sprites.Token.x >= -200 && current.sprites.Token.x <= 200);
		await catchDrop(1);
		await missDrop(solution ? 0 : 1);
		if (solution) {
			for (let score = 1; score <= 3; score++) await catchDrop(score);
			// Put the two contact surfaces together: the actual renderer must see
			// both, while the script still awards exactly one catch outcome.
			await setCase({}, { Ground: [-120, -130], Token: [-120, -130] });
			await waitValues({ score: 4 });
			await waitRespawn();
			await setCase({}, { Ground: [0, -165] });
			await page.keyboard.down("ArrowRight");
			await frame.waitForFunction(() => window.__courseTestVm.runtime.targets.find(t => t.sprite?.name === "Player").x > -80);
			await page.keyboard.up("ArrowRight");
			await pause(70);
			const releasedX = (await snapshot()).sprites.Player.x;
			await pause(140);
			assert.equal((await snapshot()).sprites.Player.x, releasedX, "Releasing a held arrow stops polling movement");
			for (const [x, key, boundary] of [[195, "ArrowRight", 200], [-195, "ArrowLeft", -200]]) {
				await setCase({}, { Player: [x, -130] });
				await page.keyboard.down(key);
				await pause(160);
				assert.equal((await snapshot()).sprites.Player.x, boundary);
				await page.keyboard.up(key);
			}
			await setCase({}, { Player: [0, -130] });
			await page.keyboard.down("ArrowLeft");
			await page.keyboard.down("ArrowRight");
			await pause(70);
			const bothHeldX = (await snapshot()).sprites.Player.x;
			await pause(140);
			assert.equal((await snapshot()).sprites.Player.x, bothHeldX);
			await page.keyboard.up("ArrowLeft");
			await page.keyboard.up("ArrowRight");
			await page.keyboard.down("ArrowRight");
			await page.focus(".scratch-toolbar input[maxlength=\"120\"]");
			await pause(90);
			const blurredX = (await snapshot()).sprites.Player.x;
			await pause(140);
			assert.equal((await snapshot()).sprites.Player.x, blurredX, "Leaving the stage clears held movement");
			await page.keyboard.up("ArrowRight");
			await roundTrip("falling-catch");
			await catchDrop(1);
			await missDrop(0);
		}
		await flag();
		current = await snapshot();
		assert.equal(current.values.score, 0);
		assert.equal(current.sprites.Player.x, -120);
		assert.ok(current.sprites.Token.y > 80 && current.sprites.Token.y <= 145);
		console.log(JSON.stringify({ event: "verified-falling-catch-runtime", solution, collisionScoringAndReset: true, heldInputAndRoundTrip: solution }));
	}
	for (const solution of [false, true]) {
		await load("projectile-state", solution);
		assert.equal((await snapshot()).values.isFired, 0);
		assert.equal((await snapshot()).sprites.Projectile.visible, false);
		await page.keyboard.down("Space");
		await waitValues({ isFired: 1 });
		if (!solution) {
			const before = (await snapshot()).sprites.Projectile.x;
			await pause(160);
			assert.equal((await snapshot()).sprites.Projectile.x, before, "The named false comparison leaves flight unfinished");
			assert.equal((await snapshot()).sprites.Projectile.visible, true);
		}
		else {
			await frame.waitForFunction(() => window.__courseTestVm.runtime.targets.find(t => t.sprite?.name === "Projectile").x > -70);
			await page.keyboard.down("ArrowLeft");
			await pause(160);
			await page.keyboard.up("ArrowLeft");
			let current = await snapshot();
			assert.ok(current.sprites.Player.x < -120);
			assert.ok(current.sprites.Projectile.x > -70, "Moving Player does not recall an active shot");
			await waitValues({ isFired: 0 });
			await pause(160);
			current = await snapshot();
			assert.equal(current.sprites.Projectile.visible, false);
			assert.equal(current.values.isFired, 0, "Holding Space through the edge does not fire again");
			await page.keyboard.up("Space");
			await pause(90);
			await page.keyboard.down("Space");
			await waitValues({ isFired: 1 });
			await page.keyboard.up("Space");
			await pause(140);
			assert.equal((await snapshot()).values.isFired, 1, "Releasing Space in flight does not stop the shot");
			await waitValues({ isFired: 0 });
			await page.keyboard.down("Space");
			await waitValues({ isFired: 1 });
		}
		await flag();
		await pause(140);
		assert.equal((await snapshot()).values.isFired, 0);
		assert.equal((await snapshot()).sprites.Projectile.visible, false);
		await page.keyboard.up("Space");
		if (solution) {
			await roundTrip("projectile-state");
			await page.keyboard.down("Space");
			await waitValues({ isFired: 1 });
			await page.keyboard.up("Space");
			await waitValues({ isFired: 0 });
		}
		console.log(JSON.stringify({ event: "verified-projectile-state-runtime", solution, namedComparisonGap: !solution, heldSpaceAndFlightAndResetAndRoundTrip: solution }));
	}
	for (const solution of [false, true]) {
		await load("catch-levels", solution);
		await catchDrop(1);
		await missDrop(0);
		for (const [score, level, speed] of [[2, 1, 3], [3, 2, 5], [5, 2, 5], [6, 3, 7]]) {
			await setCase({ score }, { Token: [120, 120] });
			await waitValues({ Level: solution ? level : 1, FallSpeed: solution ? speed : 3 });
			const before = (await snapshot()).sprites.Token.y;
			await pause(140);
			const delta = before - (await snapshot()).sprites.Token.y;
			assert.ok(delta > 0, "The actual token continues falling");
			assert.equal(delta % (solution ? speed : 3), 0, "Movement uses the current fall speed");
		}
		if (solution) {
			await missDrop(5);
			assert.equal((await snapshot()).values.Level, 3);
			assert.equal((await snapshot()).values.FallSpeed, 7);
			await flag();
			await setCase({ score: 6 });
			await waitValues({ Level: 3, FallSpeed: 7 });
			await roundTrip("catch-levels");
			await waitValues({ score: 0, Level: 1, FallSpeed: 3 });
			await setCase({ score: 3 });
			await waitValues({ Level: 2, FallSpeed: 5 });
		}
		for (let repeat = 0; repeat < 2; repeat++) {
			await flag();
			await waitValues({ score: 0, Level: 1, FallSpeed: 3 });
			assert.equal((await snapshot()).sprites.Player.x, -120);
		}
		console.log(JSON.stringify({ event: "verified-catch-levels-runtime", solution, thresholdsAndActualSpeed: true, nonDemotionAndRoundTrip: solution, repeatedReset: true }));
	}
	await frame.evaluate(() => window.__courseTestVm.stopAll());
}
