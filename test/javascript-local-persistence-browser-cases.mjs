/* global store */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-local-persistence-sources.json",
			import.meta.url
		),
		"utf8"
	)
);
export function editedLocalProjectSource(resource, filename) {
	const source = fixture.files[resource.project][resource.role][filename];
	if (filename === "index.html") {
		return source.replace(
			`<h1>${resource.title}</h1>`,
			`<h1>Saved ${resource.title}</h1>`
		);
	}
	if (filename === "styles.css")
		return `${source}\nmain { outline: 3px solid #334155; }\n`;
	if (filename === "script.js") {
		return `${
			fixture.files[resource.project].reference[filename]
		}\n// Saved completed local document project.\n`;
	}
}
const status = page => page.$eval("#status", e => e.textContent);
const state = page => page.evaluate(() => structuredClone(store.state));
async function submit(page, form, fields) {
	await page.evaluate(
		(selector, values) => {
			for (const [id, value] of Object.entries(values))
				document.querySelector(id).value = value;
			document.querySelector(selector).requestSubmit();
		},
		form,
		fields
	);
}
async function notes(page, text) {
	await submit(page, "#note-form", { "#note-input": text });
}
async function topic(page, title, image = "") {
	await submit(page, "#topic-form", {
		"#title": title,
		"#url": "https://example.com/guide",
		"#image": image
	});
}
export async function inspectLocalProject(page, resource, kind, url) {
	const project = resource.project;
	const complete = resource.role === "reference" || kind === "edited";
	const board = ["message-board", "adding-comments"].includes(project);
	const key = `classes-course:${project}:document`;
	await page.goto(url, { waitUntil: "load" });
	await page.waitForSelector("#status");
	if (!complete) {
		if (project === "deleting-notes")
			await page.click("li[data-note-id=\"note-a\"] button");
		if (project === "checking-notes")
			await page.click("input[data-note-id=\"note-a\"]");
		if (project === "adding-comments") {
			await submit(page, "form[data-post-id=\"post-a\"]", {
				"#comment-post-a": "Starter attempt"
			});
		}
		assert.match(await status(page), /Complete /);
		assert.equal(
			await page.evaluate(key => localStorage.getItem(key), key),
			null
		);
		return {
			complete,
			scaffoldExplainsRequiredFunctions: true,
			noSavedStateReplaced: true
		};
	}
	assert.equal(await page.evaluate(() => store.readOnly), false);
	const before = await state(page);
	if (board) {
		await topic(page, "<b>Literal topic</b>");
		let current = await state(page);
		assert.equal(current.posts.length, before.posts.length + 1);
		const added = current.posts.at(-1);
		assert.equal(added.title, "<b>Literal topic</b>");
		assert.equal(added.url, "https://example.com/guide");
		assert.equal(added.imageUrl, "");
		assert.equal(await page.$$eval("#topics h2 b", els => els.length), 0);
		assert.equal(
			await page.$eval("#topics article h2 a", e => e.textContent),
			added.title
		);
		assert.equal(
			await page.$eval("#title", e => e === document.activeElement),
			true
		);
		assert.deepEqual(
			await page.$eval("#topics article h2 a", e => ({
				target: e.target,
				rel: e.rel
			})),
			{ target: "_blank", rel: "noopener noreferrer" }
		);
		if (project === "adding-comments") {
			const form = `form[data-post-id="${added.id}"]`;
			await submit(page, form, {
				[`${form} input`]: "<strong>Literal comment</strong>"
			});
			assert.equal(
				await page.$eval(
					`${form} input`,
					e => e === document.activeElement
				),
				true
			);
			await topic(page, "Newer topic");
			await submit(page, form, { [`${form} input`]: "Second comment" });
			current = await state(page);
			assert.equal(
				current.posts.find(p => p.id === added.id).comments.length,
				2
			);
			assert.equal(current.posts.at(-1).comments.length, 0);
			assert.equal(
				await page.$$eval(
					"#topics .comments strong",
					els => els.length
				),
				0
			);
		}
		const saved = await page.evaluate(
			key => localStorage.getItem(key),
			key
		);
		await submit(page, "#topic-form", {
			"#title": "Rejected origin",
			"#url": "https://elsewhere.invalid/",
			"#image": ""
		});
		assert.match(await status(page), /reviewed HTTPS origin/);
		assert.equal(
			await page.evaluate(key => localStorage.getItem(key), key),
			saved
		);
		await page.reload({ waitUntil: "load" });
		assert.ok((await state(page)).posts.some(p => p.id === added.id));
		await topic(
			page,
			"Broken picture",
			"https://www.fws.gov/local-course-missing.jpg"
		);
		await page.waitForFunction(() =>
			Array.from(document.querySelectorAll("#topics .image-status")).some(
				e => !e.hidden && e.textContent === "Image unavailable."
			)
		);
		const beforeReset = await page.evaluate(
			key => localStorage.getItem(key),
			key
		);
		page.once("dialog", dialog => void dialog.dismiss());
		await page.click("#reset");
		assert.equal(
			await page.evaluate(key => localStorage.getItem(key), key),
			beforeReset
		);
		page.once("dialog", dialog => void dialog.accept());
		await page.click("#reset");
		assert.deepEqual(await state(page), before);
		if (project === "adding-comments") {
			const previous = {
				schemaVersion: 1,
				posts: [
					{
						id: "old-post",
						title: "Retained",
						url: "https://example.com/",
						imageUrl: "",
						order: 7
					}
				]
			};
			const raw = JSON.stringify(previous);
			await page.evaluate(
				(key, raw) => localStorage.setItem(key, raw),
				key,
				raw
			);
			await page.reload({ waitUntil: "load" });
			assert.equal(
				await page.evaluate(key => localStorage.getItem(key), key),
				raw
			);
			assert.equal((await state(page)).posts[0].id, "old-post");
			await submit(page, "form[data-post-id=\"old-post\"]", {
				"#comment-old-post": "Migrated comment"
			});
			assert.equal(
				JSON.parse(
					await page.evaluate(key => localStorage.getItem(key), key)
				).schemaVersion,
				2
			);
		}
	}
	else {
		await notes(page, " <b>Literal note</b> ");
		await notes(page, "Same text");
		await notes(page, "Same text");
		let current = await state(page);
		assert.equal(current.notes.length, before.notes.length + 3);
		assert.equal(current.notes.at(-3).text, "<b>Literal note</b>");
		assert.notEqual(current.notes.at(-1).id, current.notes.at(-2).id);
		assert.equal(await page.$$eval("#notes b", els => els.length), 0);
		assert.equal(
			await page.$eval("#note-input", e => e === document.activeElement),
			true
		);
		await page.reload({ waitUntil: "load" });
		assert.deepEqual(await state(page), current);
		if (project !== "todo-list") {
			const first = current.notes[0].id;
			const last = current.notes.at(-1).id;
			for (const id of [first, last]) {
				await page.click(`li[data-note-id="${id}"] button`);
				assert.equal(
					await page.$eval(
						"#note-input",
						e => e === document.activeElement
					),
					true
				);
			}
			current = await state(page);
			assert.equal(
				current.notes.some(n => n.id === first || n.id === last),
				false
			);
		}
		if (project === "checking-notes") {
			const id = current.notes[0].id;
			await page.click(`input[data-note-id="${id}"]`);
			assert.equal(
				await page.$eval(
					`input[data-note-id="${id}"]`,
					e => e === document.activeElement
				),
				true
			);
			await page.reload({ waitUntil: "load" });
			current = await state(page);
			assert.equal(current.notes.find(n => n.id === id).done, true);
			assert.equal(current.notes.filter(n => n.done).length, 1);
			const legacy = JSON.stringify(["Same", "", "Same"]);
			await page.evaluate(
				(key, raw) => localStorage.setItem(key, raw),
				key,
				legacy
			);
			await page.reload({ waitUntil: "load" });
			assert.equal(
				await page.evaluate(key => localStorage.getItem(key), key),
				legacy
			);
			assert.deepEqual(
				(await state(page)).notes.map(n => n.id),
				["legacy-0", "legacy-2"]
			);
			await page.click("input[data-note-id=\"legacy-2\"]");
			await page.reload({ waitUntil: "load" });
			assert.deepEqual(
				(await state(page)).notes.map(n => n.done),
				[false, true]
			);
		}
		if (project === "deleting-notes") {
			for (const note of (await state(page)).notes)
				await page.click(`li[data-note-id="${note.id}"] button`);
			assert.match(
				await page.$eval("#notes", e => e.textContent),
				/No notes/
			);
			await page.reload({ waitUntil: "load" });
			assert.equal((await state(page)).notes.length, 0);
		}
	}
	const original = await page.evaluate(key => localStorage.getItem(key), key);
	const originalState = await state(page);
	await page.evaluate(() => {
		Storage.prototype.setItem = function () {
			throw new DOMException("Quota exceeded", "QuotaExceededError");
		};
	});
	if (board) await topic(page, "Quota save");
	else await notes(page, "Quota save");
	assert.match(await status(page), /prior document/);
	assert.equal(
		await page.evaluate(key => localStorage.getItem(key), key),
		original
	);
	assert.deepEqual(await state(page), originalState);
	await page.reload({ waitUntil: "load" });
	for (const raw of [
		"{broken",
		JSON.stringify({ schemaVersion: 99 }),
		"x".repeat(131073)
	]) {
		await page.evaluate(
			(key, raw) => localStorage.setItem(key, raw),
			key,
			raw
		);
		await page.reload({ waitUntil: "load" });
		assert.equal(await page.evaluate(() => store.readOnly), true);
		assert.equal(await page.$eval("#recovery", e => e.value), raw);
		assert.equal(
			await page.evaluate(key => localStorage.getItem(key), key),
			raw
		);
		assert.equal(
			await page.$$eval("button,input", els =>
				els.every(e => e.disabled)),
			true
		);
	}
	const denied = await page.evaluateOnNewDocument(() => {
		Object.defineProperty(window, "localStorage", {
			get() {
				throw new DOMException("Denied", "SecurityError");
			}
		});
	});
	await page.reload({ waitUntil: "load" });
	assert.equal(await page.evaluate(() => store.readOnly), true);
	assert.match(await status(page), /Storage is unavailable/);
	await page.removeScriptToEvaluateOnNewDocument(denied.identifier);
	await page.reload({ waitUntil: "load" });
	assert.equal(
		await page.evaluate(key => localStorage.getItem(key), key),
		"x".repeat(131073)
	);
	await page.evaluate(
		(key, raw) => localStorage.setItem(key, raw),
		key,
		original
	);
	await page.reload({ waitUntil: "load" });
	assert.deepEqual(await state(page), originalState);
	const heading = await page.$eval("h1", e => e.textContent);
	assert.equal(heading, (kind === "edited" ? "Saved " : "") + resource.title);
	if (kind === "edited") {
		assert.equal(
			await page.$eval("main", e => getComputedStyle(e).outlineWidth),
			"3px"
		);
	}
	return {
		complete,
		stableIdsAndReload: true,
		literalText: true,
		failedSaveAtomic: true,
		corruptUnknownOversizedBytesPreserved: true,
		deniedReadOnly: true,
		restoredOriginalDocument: true,
		board,
		commentsOnStableParent: project === "adding-comments",
		completionMigration: project === "checking-notes",
		confirmedReset: board,
		savedHeading: heading
	};
}
