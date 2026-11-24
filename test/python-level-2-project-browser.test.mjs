import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
// eslint-disable-next-line test/no-import-node-test -- Exercises the real course and IDE in Chrome.
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { gunzipSync } from "node:zlib";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const moduleFiles = {
	"first": "first",
	"loops": "loop",
	"check-ins": "check-ins",
	"ascii": "ascii",
	"conditionals": "conditionals",
	"functions": "functions",
	"collections": "collections",
	"console": "console",
	"capstones": "capstones",
	"lists-and-music": "lists-and-music",
	"named-music-and-morse": "named-music-and-morse",
	"dictionaries": "dictionaries",
	"supplemental-practice": "supplemental-practice",
	"supplemental-sets-word-games": "supplemental-sets-word-games"
};
const selectedModule = process.env.PYTHON_LEVEL_2_BROWSER_MODULE ?? "first";
assert.ok(Object.hasOwn(moduleFiles, selectedModule), `Unknown Python module: ${selectedModule}`);
const moduleName = moduleFiles[selectedModule];
const fixturePath = `./fixtures/python-level-2-${moduleName}-module-sources.json`;
const fixture = JSON.parse(
	readFileSync(new URL(fixturePath, import.meta.url), "utf8")
);
const outputMarker = "Saved Python exercise check";

const sharedDictionary = selectedModule === "supplemental-sets-word-games"
	? gunzipSync(readFileSync(new URL("./fixtures/wordsmith-valid-words.txt.gz", import.meta.url)))
	: undefined;

function prepareSourceFixture(data) {
	for (const file of Object.values(data.files)) {
		if (!file.sharedDictionary) continue;
		assert.ok(sharedDictionary);
		assert.equal(sharedDictionary.length, file.byteLength);
		assert.equal(createHash("sha256").update(sharedDictionary).digest("hex"), file.sha256);
		file.content = sharedDictionary.toString("utf8");
	}
}

function expectsRunError(example) {
	return Boolean(example.expectsSyntaxError || example.expectedError);
}

function sourceDirectoryListing(pack, { url, role }) {
	const root = `/repos/instruction-material/${fixture.repository}/contents/`;
	const path = decodeURIComponent(url.pathname.slice(root.length));
	const rolePath = `${pack}/${role}`;
	const valid = url.pathname.startsWith(root)
		&& (path === rolePath || path.startsWith(`${rolePath}/`))
		&& url.searchParams.get("ref") === fixture.revision;
	const entries = new Map();
	if (valid) {
		for (const [name, file] of Object.entries(fixture.files)) {
			if (!name.startsWith(`${path}/`)) continue;
			const [child, nested] = name.slice(path.length + 1).split("/");
			entries.set(child, nested
				? {
						type: "dir",
						name: child,
						path: `${path}/${child}`
					}
				: {
						type: "file",
						name: child,
						path: name,
						size: file.byteLength,
						sha: file.gitBlob,
						download_url: `https://raw.githubusercontent.com/instruction-material/${fixture.repository}/${fixture.revision}/${name}`
					});
		}
	}
	return { valid, entries: [...entries.values()] };
}

async function captureWav(page, audio, output, member, edited) {
	const player = ".artifact-card audio";
	const duration = (edited ? audio.editedFrames : audio.frames) / 44100;
	await page.waitForFunction((selector) => {
		const element = document.querySelector(selector);
		return element?.readyState >= 2 && Number.isFinite(element.duration);
	}, { timeout: 15000 }, player);
	const preview = await page.$eval(player, async (element) => {
		await element.play();
		return { duration: element.duration, source: element.currentSrc, controls: element.controls };
	});
	assert.equal(preview.controls, true);
	assert.ok(Math.abs(preview.duration - duration) < 0.001);
	await page.waitForFunction(
		selector => document.querySelector(selector)?.currentTime > 0.05,
		{ timeout: 6000 },
		player
	);
	await page.$eval(player, element => element.pause());
	assert.ok(preview.source.startsWith("data:audio/wav;base64,"));
	const previewBytes = Buffer.from(preview.source.slice(preview.source.indexOf(",") + 1), "base64");

	const download = `.artifact-card a[download="${audio.filename}"]`;
	const folder = await mkdtemp(join(tmpdir(), "course-wav-"));
	try {
		await page.browserContext().setDownloadBehavior({ policy: "allow", downloadPath: folder });
		await page.locator(download).click();
		const deadline = Date.now() + 15000;
		let bytes;
		while (Date.now() < deadline) {
			try {
				bytes = await readFile(join(folder, audio.filename));
				break;
			}
			catch (error) {
				if (error.code !== "ENOENT") throw error;
				await delay(75);
			}
		}
		assert.ok(bytes, `The browser did not finish downloading ${audio.filename}.`);
		assert.deepEqual(bytes, previewBytes);
		assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
		assert.equal(bytes.toString("ascii", 8, 12), "WAVE");
		assert.equal(bytes.readUInt16LE(22), 1);
		assert.equal(bytes.readUInt32LE(24), 44100);
		assert.equal(bytes.readUInt16LE(34), 16);
		assert.equal(bytes.toString("ascii", 36, 40), "data");
		const frames = bytes.readUInt32LE(40) / 2;
		assert.equal(frames, edited ? audio.editedFrames : audio.frames);
		assert.equal(bytes.length, 44 + frames * 2);
		await writeFile(join(output, member), bytes);
		return {
			member,
			filename: audio.filename,
			frames,
			sha256: createHash("sha256").update(bytes).digest("hex"),
			played: true,
			downloadMatchesPreview: true
		};
	}
	finally {
		await rm(folder, { recursive: true, force: true });
	}
}

async function verifyExecution(
	page,
	{ input, expected, expectsSyntaxError, expectedError },
	edited = false
) {
	const selector = ".stdin-panel textarea";
	await page.waitForSelector(selector);
	await page.$eval(
		selector,
		(element, value) => {
			element.value = value;
			element.dispatchEvent(new Event("input", { bubbles: true }));
		},
		input
	);
	await page.locator("button.run-control:not([disabled])").click();
	const tokens = edited ? [...expected, outputMarker] : expected;
	const selectorOutput = ".output-panel .output-line";
	const result = await page.waitForFunction(
		({ values, selector }) => {
			const output = Array.from(document.querySelectorAll(selector))
				.map(line => line.textContent)
				.join("\n");
			const finished = document.querySelector(
				"button.run-control:not(.run-control--stop):not([disabled])"
			);
			return finished && values.every(value => output.includes(value))
				? output
				: false;
		},
		{ timeout: 90000 },
		{ values: tokens, selector: selectorOutput }
	).catch(async (error) => {
		const observed = await page.$$eval(selectorOutput, lines =>
			lines.map(line => line.textContent).join("\n"));
		throw new Error(`Python output did not match ${JSON.stringify(tokens)}. Observed:\n${observed}`, { cause: error });
	});
	const output = await result.jsonValue();
	await result.dispose();
	if (expectsSyntaxError) {
		assert.match(output, /\bSyntaxError\b/);
	}
	else if (expectedError) {
		assert.ok(output.includes(expectedError), output);
	}
	else {
		assert.doesNotMatch(
			output,
			/Traceback|\b(?:Syntax|Runtime|Type|Name|Import|Index|EOF|Attribute)Error:/
		);
	}
	return output;
}

for (const exercise of fixture.exercises) {
	for (const classroom of [false, true]) {
		const courseID = classroom
			? "python-level-2-classroom"
			: "python-level-2";
		const sourceRole = role => (classroom ? "solution" : role);
		const { pack, itemId, examples } = exercise;
		const exampleFor = role => examples[sourceRole(role)];
		const audioFor = role => exercise.audio?.[sourceRole(role)];
		const outputBase = `output/python-${moduleName}-module-browser`;
		const outputSubdirectory = `${courseID}/${pack}`;
		const audioOutput = join(process.env.PYTHON_LEVEL_2_BROWSER_DIR ?? outputBase, outputSubdirectory);
		const initialAudio = new Map();
		test(
			`${pack} ${courseID}: consent, runtime, saved edits and ZIPs`,
			{ timeout: 360000 },
			async (t) => {
				await runAssemblyCoreCourseWorkflow(t, {
					kind: pack.toLowerCase().replaceAll("/", "-"),
					courseID,
					moduleID: exercise.moduleId ?? fixture.moduleId,
					coreID: itemId,
					previousProject: () => ({
						_id: "earlier-python-project",
						title: "Earlier work",
						mode: "python",
						files: [
							{
								name: "main.py",
								content: "print('Earlier work')\n"
							}
						],
						activeFileName: "main.py",
						courseID,
						courseProjectKey: `${courseID}:earlier-python-project:starter`,
						createdAt: "2026-11-01T12:00:00.000Z",
						updatedAt: "2026-11-01T12:00:00.000Z"
					}),
					mode: "python",
					pack,
					sourceRepository: fixture.repository,
					fixturePath,
					prepareFixture: prepareSourceFixture,
					sourceRole,
					sourceUrl: role =>
						`https://github.com/instruction-material/${fixture.repository}/tree/${fixture.revision}/${pack}/${sourceRole(role)}`,
					sameTab: true,
					githubDirectory: true,
					...(exercise.audio ? { githubDirectoryListing: request => sourceDirectoryListing(pack, request) } : {}),
					allowPythonRuntime: true,
					flatFiles: true,
					sharedFiles: [],
					fileCount: role =>
						Object.keys(fixture.files).filter(path =>
							path.startsWith(`${pack}/${sourceRole(role)}/`)
						).length,
					primaryFile: "main.py",
					expectedFile: (role, name) =>
						classroom && name === "main.py"
							? { sha256: exercise.classroomMainSha256 }
							: fixture.files[`${pack}/${sourceRole(role)}/${name}`],
					editFiles: ["main.py"],
					editContent: ({ original, role }) => {
						let edited = expectsRunError(exampleFor(role))
							? fixture.files[`${pack}/solution/main.py`].content
							: original;
						const audio = audioFor(role);
						if (audio) {
							assert.equal(edited.split(audio.edit.from).length, 2);
							edited = edited.replace(audio.edit.from, audio.edit.to);
						}
						return `${edited.trimEnd()}\n\nprint(${JSON.stringify(outputMarker)})\n`;
					},
					continuationIDs: [itemId],
					projectKey: role =>
						`${courseID}:${itemId}:${classroom || role === "starter" ? "starter" : "reference"}`,
					verifyRun: async (page, { role, width }) => {
						await verifyExecution(page, exampleFor(role));
						const audio = audioFor(role);
						if (audio) {
							const key = `${role}-${width}`;
							initialAudio.set(key, await captureWav(page, audio, audioOutput, `${key}-exact.wav`, false));
						}
					},
					afterEdit: async (page, { role, width }) => {
						const audio = audioFor(role);
						const output = await verifyExecution(
							page,
							expectsRunError(exampleFor(role))
								? examples.solution
								: audio?.editedExample ?? exampleFor(role),
							true
						);
						if (!audio) return { output };
						const key = `${role}-${width}`;
						const exact = initialAudio.get(key);
						const edited = await captureWav(page, audio, audioOutput, `${key}-edited.wav`, true);
						assert.ok(exact);
						assert.notEqual(exact.sha256, edited.sha256);
						return { output, audio: { exact, edited } };
					},
					outputEnv: "PYTHON_LEVEL_2_BROWSER_DIR",
					outputSubdirectory,
					defaultOutput: outputBase
				});
			}
		);
	}
}
