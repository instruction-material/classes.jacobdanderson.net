import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createContext, runInContext } from "node:vm";
import { TextEncoder } from "node:util";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { javascriptCourseProjectKey } from "@/modules/javascriptCourseResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjectsAsync,
	loadPythonIdeStarterFilesFromGitHub,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
const fixture = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/javascript-local-persistence-sources.json"),
		"utf8"
	)
);
const sha = (value: string) => createHash("sha256").update(value).digest("hex");
afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});
for (const resource of fixture.resources) {
	it(
		"imports,saves,reopens and exports every " +
			resource.project +
			"/" +
			resource.role +
			" file",
		async () => {
			vi.stubGlobal("crypto", webcrypto);
			const prefix = "/course-assets/javascript-level-2/",
				requests: string[] = [];
			vi.stubGlobal(
				"fetch",
				vi.fn(async (url: string, options: RequestInit) => {
					expect(url.startsWith(prefix)).toBe(true);
					expect(options).toMatchObject({
						credentials: "omit",
						redirect: "error"
					});
					requests.push(url);
					return new Response(
						readFileSync(
							resolve(
								"public/course-assets/javascript-level-2",
								url.slice(prefix.length)
							)
						)
					);
				})
			);
			const files = await loadPythonIdeStarterFilesFromGitHub(
				resource.urls[0],
				"web"
			);
			expect(requests).toHaveLength(resource.files.length);
			for (const file of files) {
				expect(file.content).toBe(
					fixture.files[resource.project][resource.role][file.name]
				);
				expect(sha(file.content)).toBe(
					resource.files.find(
						(f: { name: string }) => f.name === file.name
					).sha256
				);
			}
			const key = javascriptCourseProjectKey(
				fixture.courseId,
				resource.itemId,
				resource.role,
				resource.urls[0]
			);
			for (const alias of resource.urls)
				expect(
					javascriptCourseProjectKey(
						fixture.courseId,
						resource.itemId,
						resource.role,
						alias
					)
				).toBe(key);
			const earlier = createPythonIdeProject("web", {
				files: [
					{
						name: "index.html",
						content: "Earlier work",
						encoding: "text"
					}
				],
				courseID: fixture.courseId,
				courseProjectKey: key + ":earlier"
			});
			const project = createPythonIdeProject("web", {
				files,
				courseID: fixture.courseId,
				courseProjectKey: key,
				starterUrl: resource.urls[0]
			});
			project.files.find(f => f.name === "README.md")!.content +=
				"\nSaved observations.\n";
			saveLocalPythonProjects([earlier, project]);
			const projects = await loadLocalPythonProjectsAsync();
			expect(projects.find(p => p._id === earlier._id)).toEqual(earlier);
			const saved = projects.find(p => p._id === project._id)!;
			expect(saved.files).toEqual(project.files);
			const archive = unzipSync(await createProjectArchive(saved));
			expect(Object.keys(archive)).toHaveLength(resource.files.length);
			for (const file of saved.files) {
				const member = Object.keys(archive).find(name =>
					name.endsWith("/" + file.name)
				)!;
				expect(strFromU8(archive[member])).toBe(file.content);
			}
		}
	);
}
for (const role of ["learner", "instructor"]) {
	it(
		"preserves all five assignments,optional placement and complete teaching for " +
			role,
		async () => {
			setActivePinia(createPinia());
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "notes-tutor",
					name: "Tutor",
					email: "tutor@example.invalid",
					age: 30,
					state: "GA",
					usersOfTutorLength: 0,
					coursePermissions: [fixture.courseId],
					editTutors: false,
					saveEdit: "Save"
				});
			const course = (await useCoursesStore().loadCourseById(
				fixture.courseId
			))!;
			for (const project of fixture.projects) {
				const module = course.modules.find(
					m => m.id === project.moduleId
				)!;
				const item = [
					...module.curriculum,
					...module.supplementalProjects
				].find(i => i.id === project.itemId)!;
				expect(item, project.project).toBeDefined();
				expect(item.title).toBe(project.catalogTitle);
				expect(item.learningPath).toBe(project.learningPath);
				const guide = fixture.files[project.project].starter[
					"README.md"
				]
					.split("\n\n")
					.slice(1)
					.join("\n\n")
					.split("\n\n## Run and continue\n\n")[0];
				expect(item.content).toContain(guide);
				for (const sourceRole of ["starter", "reference"]) {
					const resource = fixture.resources.find(
						r =>
							r.project === project.project &&
							r.role === sourceRole
					);
					expect(
						sourceRole === "starter"
							? item.projectLink
							: item.solutionLink
					).toBe(
						sourceRole === "reference" && role === "learner"
							? undefined
							: resource.urls[0]
					);
				}
			}
			for (const reading of fixture.readings) {
				const item = course.modules
					.find(m => m.id === reading.moduleId)!
					.curriculum.find(i => i.id === reading.id)!;
				expect(item.contentKind).toBe("reading");
				expect(item.content).toBe(reading.content.trim());
			}
		}
	);
}
type Seed = Record<string, unknown> | string[] | string;
function runtime(project: string, role = "reference", initial?: Seed) {
	const files = fixture.files[project][role];
	document.body.innerHTML = files["index.html"].replace(
		/<script[\s\S]*?<\/script>/g,
		""
	);
	const key = "classes-course:" + project + ":document";
	const memory = new Map<string, string>();
	if (initial !== undefined)
		memory.set(
			key,
			typeof initial === "string" ? initial : JSON.stringify(initial)
		);
	let deny = false,
		answer = true,
		writes = 0;
	const storage = {
		getItem: (name: string) => memory.get(name) ?? null,
		setItem: (name: string, value: string) => {
			if (deny) throw new Error("quota");
			writes++;
			memory.set(name, value);
		}
	};
	const scope = createContext({
		document,
		localStorage: storage,
		URL,
		TextEncoder,
		structuredClone,
		crypto: webcrypto,
		confirm: () => answer,
		console
	});
	for (const name of ["fixtures.js", "storage.js", "script.js"])
		runInContext(files[name], scope);
	return {
		key,
		memory,
		read: (expression: string) => runInContext(expression, scope),
		deny: (value: boolean) => {
			deny = value;
		},
		confirm: (value: boolean) => {
			answer = value;
		},
		writes: () => writes
	};
}
function submit(form: string, fields: Record<string, string>) {
	for (const [selector, value] of Object.entries(fields))
		(document.querySelector(selector) as HTMLInputElement).value = value;
	document
		.querySelector(form)!
		.dispatchEvent(
			new Event("submit", { bubbles: true, cancelable: true })
		);
}
it("keeps future deletion/completion/comment answers out of earlier task scripts", () => {
	expect(fixture.files["todo-list"].starter["script.js"]).not.toContain(
		"function deleteNote"
	);
	expect(fixture.files["todo-list"].starter["script.js"]).not.toContain(
		"function setCompletion"
	);
	expect(fixture.files["deleting-notes"].starter["script.js"]).not.toContain(
		"function setCompletion"
	);
	expect(fixture.files["message-board"].starter["script.js"]).not.toContain(
		"function addComment"
	);
	for (const project of fixture.projects) {
		const starter = fixture.files[project.project].starter["script.js"];
		for (const target of project.targets)
			expect(starter).toContain("Complete " + target + " in script.js.");
	}
});
it("adds literal,normalized notes and restores the same IDs on reload", () => {
	const app = runtime("todo-list");
	submit("#note-form", { "#note-input": "  <b>Keep this text.</b>  " });
	expect(app.read("store.state.notes.length")).toBe(3);
	expect(app.read("store.state.notes[2].text")).toBe(
		"<b>Keep this text.</b>"
	);
	expect(document.querySelectorAll("#notes b")).toHaveLength(0);
	expect(document.querySelector("#notes")!.textContent).toContain(
		"<b>Keep this text.</b>"
	);
	const saved = app.memory.get(app.key)!;
	const ids = JSON.stringify(
		app.read("store.state.notes.map(note=>note.id)")
	);
	const reopened = runtime("todo-list", "reference", saved);
	expect(
		JSON.stringify(reopened.read("store.state.notes.map(note=>note.id)"))
	).toBe(ids);
	expect(reopened.read("store.state.notes.length")).toBe(3);
});
it("deletes the selected stable ID with repeat/unknown/only cases and preserves state on failed save", () => {
	const app = runtime("deleting-notes");
	expect(
		app.read("perform(state=>deleteNote(state,'note-a'),'Deleted.')")
	).toBe(true);
	expect(
		JSON.stringify(app.read("store.state.notes.map(note=>note.id)"))
	).toBe('["note-b"]');
	const saved = app.memory.get(app.key);
	expect(
		app.read("perform(state=>deleteNote(state,'note-a'),'Deleted.')")
	).toBe(false);
	expect(
		app.read("perform(state=>deleteNote(state,'unknown'),'Deleted.')")
	).toBe(false);
	expect(app.memory.get(app.key)).toBe(saved);
	app.deny(true);
	expect(
		app.read("perform(state=>deleteNote(state,'note-b'),'Deleted.')")
	).toBe(false);
	expect(app.memory.get(app.key)).toBe(saved);
	expect(app.read("store.state.notes.length")).toBe(1);
	expect(document.querySelector("#status")!.textContent).toContain(
		"prior document"
	);
	app.deny(false);
	expect(
		app.read("perform(state=>deleteNote(state,'note-b'),'Deleted.')")
	).toBe(true);
	expect(app.read("store.state.notes.length")).toBe(0);
	expect(document.querySelector("#notes")!.textContent).toContain(
		"No notes."
	);
});
it("migrates both older note schemas and isolates completion across reload", () => {
	let app = runtime("checking-notes", "reference", ["Same", "", "Same"]);
	expect(JSON.stringify(app.read("store.state.notes"))).toBe(
		JSON.stringify([
			{ id: "legacy-0", text: "Same", done: false },
			{ id: "legacy-2", text: "Same", done: false }
		])
	);
	expect(app.writes()).toBe(0);
	expect(
		app.read(
			"perform(state=>setCompletion(state,'legacy-2',true),'Saved.')"
		)
	).toBe(true);
	expect(
		JSON.stringify(app.read("store.state.notes.map(note=>note.done)"))
	).toBe("[false,true]");
	app = runtime("checking-notes", "reference", app.memory.get(app.key)!);
	expect(app.read("store.state.schemaVersion")).toBe(2);
	expect(app.read("store.state.notes[1].id")).toBe("legacy-2");
	expect(app.read("store.state.notes[1].done")).toBe(true);
	const v1 = {
		schemaVersion: 1,
		notes: [{ id: "retained-id", text: "Keep ID" }]
	};
	app = runtime("checking-notes", "reference", v1);
	expect(app.read("store.state.notes[0].id")).toBe("retained-id");
	expect(app.read("store.state.notes[0].done")).toBe(false);
	expect(
		app.read("perform(state=>setCompletion(state,'missing',true),'Saved.')")
	).toBe(false);
	expect(
		app.read(
			"perform(state=>setCompletion(state,'retained-id','yes'),'Saved.')"
		)
	).toBe(false);
});
it("preserves corrupt,unknown and oversized saved bytes with read-only recovery", () => {
	for (const raw of [
		"{broken",
		JSON.stringify({ schemaVersion: 99, notes: [] }),
		"x".repeat(131073)
	]) {
		const app = runtime("todo-list", "reference", raw);
		expect(app.read("store.readOnly")).toBe(true);
		expect(app.memory.get(app.key)).toBe(raw);
		expect(
			(document.querySelector("#recovery") as HTMLTextAreaElement).value
		).toBe(raw);
		expect(
			app.read("perform(state=>addNote(state,'New','new-id'),'Saved.')")
		).toBe(false);
		expect(app.writes()).toBe(0);
	}
});
it("bounds note text,counts,IDs and completion types before saving", () => {
	const app = runtime("checking-notes");
	expect(() =>
		app.read(
			"normalizeDocument({schemaVersion:2,notes:[{id:'x',text:'A',done:false},{id:'x',text:'B',done:true}]})"
		)
	).toThrow();
	expect(() =>
		app.read(
			"normalizeDocument({schemaVersion:2,notes:[{id:'x',text:'A',done:'yes'}]})"
		)
	).toThrow();
	expect(() =>
		app.read("addNote(store.state,' '.repeat(3),'blank')")
	).toThrow();
	expect(() =>
		app.read("addNote(store.state,'x'.repeat(201),'long')")
	).toThrow();
	expect(app.read("textField(' '+ 'x'.repeat(200)+' ',200).length")).toBe(
		200
	);
	expect(() =>
		app.read(
			"normalizeDocument({schemaVersion:2,notes:Array.from({length:101},(_,i)=>({id:'n'+i,text:'A',done:false}))})"
		)
	).toThrow();
});
it("keeps topic fields distinct,safely renders titles and preserves the prior board on failed save", () => {
	const app = runtime("message-board");
	submit("#topic-form", {
		"#title": " <b>Literal topic</b> ",
		"#url": "https://example.com/guide",
		"#image": ""
	});
	expect(app.read("store.state.posts.length")).toBe(3);
	expect(app.read("store.state.posts[2].title")).toBe("<b>Literal topic</b>");
	expect(app.read("store.state.posts[2].url")).toBe(
		"https://example.com/guide"
	);
	expect(app.read("store.state.posts[2].imageUrl")).toBe("");
	expect(document.querySelector("#topics article h2 a")!.textContent).toBe(
		"<b>Literal topic</b>"
	);
	expect(document.querySelectorAll("#topics h2 b")).toHaveLength(0);
	const saved = app.memory.get(app.key);
	app.deny(true);
	submit("#topic-form", {
		"#title": "Blocked save",
		"#url": "https://example.com/new",
		"#image": ""
	});
	expect(app.memory.get(app.key)).toBe(saved);
	expect(app.read("store.state.posts.length")).toBe(3);
});
it("rejects unsafe origins,credentials and oversized addresses while allowing reviewed URLs", () => {
	const app = runtime("message-board");
	for (const value of [
		"javascript:alert(1)",
		"http://example.com/",
		"https://elsewhere.invalid/",
		"https://user@example.com/",
		"https://example.com/" + "x".repeat(1100)
	]) {
		expect(() =>
			app.read("reviewedUrl(" + JSON.stringify(value) + ")")
		).toThrow();
	}
	expect(app.read("reviewedUrl('https://example.com/guide')")).toBe(
		"https://example.com/guide"
	);
	expect(app.read("reviewedUrl('',true)")).toBe("");
	expect(() =>
		app.read("reviewedUrl('https://www.fws.gov/unsafe.svg',true)")
	).toThrow();
	expect(
		app.read("reviewedUrl('https://www.fws.gov/example.jpg',true)")
	).toBe("https://www.fws.gov/example.jpg");
});
it("keeps comments on their stable parent after reordering and reload", () => {
	let app = runtime("adding-comments");
	submit('form[data-post-id="post-a"]', {
		'form[data-post-id="post-a"] input': "<strong>Literal comment</strong>"
	});
	expect(
		app.read(
			"store.state.posts.find(post=>post.id==='post-a').comments.length"
		)
	).toBe(1);
	expect(document.querySelectorAll("#topics .comments strong")).toHaveLength(
		0
	);
	submit("#topic-form", {
		"#title": "Newer topic",
		"#url": "https://example.com/new",
		"#image": ""
	});
	submit('form[data-post-id="post-a"]', {
		'form[data-post-id="post-a"] input': "Second comment"
	});
	expect(
		app.read(
			"store.state.posts.find(post=>post.id==='post-a').comments.length"
		)
	).toBe(2);
	expect(
		app.read(
			"store.state.posts.find(post=>post.id==='post-b').comments.length"
		)
	).toBe(0);
	const saved = app.memory.get(app.key)!;
	expect(
		app.read(
			"perform(state=>addComment(state,'missing','Ignored','missing-id'),'Saved.')"
		)
	).toBe(false);
	expect(app.memory.get(app.key)).toBe(saved);
	app = runtime("adding-comments", "reference", saved);
	expect(
		app.read(
			"store.state.posts.find(post=>post.id==='post-a').comments[0].text"
		)
	).toBe("<strong>Literal comment</strong>");
	expect(
		document.querySelectorAll('article[data-post-id="post-a"] .comments li')
	).toHaveLength(2);
});
it("bounds comment IDs and parent/global capacities before mutation", () => {
	const app = runtime("adding-comments");
	expect(
		app.read(
			"perform(state=>addComment(state,'post-a','Same','c-one'),'Saved.')"
		)
	).toBe(true);
	const saved = app.memory.get(app.key);
	expect(
		app.read(
			"perform(state=>addComment(state,'post-a','Same','c-one'),'Saved.')"
		)
	).toBe(false);
	expect(app.memory.get(app.key)).toBe(saved);
	expect(() =>
		app.read("addComment(store.state,'post-a','x'.repeat(401),'too-long')")
	).toThrow();
	expect(() =>
		app.read("addComment(store.state,'post-a','  ','blank')")
	).toThrow();
	app.read(
		"store.state.posts[0].comments=Array.from({length:20},(_,i)=>({id:'c'+i,text:'A'}))"
	);
	expect(() =>
		app.read("addComment(store.state,'post-a','Another','overflow')")
	).toThrow();
	const posts = Array.from({ length: 11 }, (_, p) => ({
		id: "p" + p,
		title: "Topic",
		url: "https://example.com/",
		imageUrl: "",
		order: p,
		comments:
			p < 10
				? Array.from({ length: 20 }, (_, i) => ({
						id: "c" + p + "-" + i,
						text: "A"
					}))
				: []
	}));
	const full = runtime("adding-comments", "reference", {
		schemaVersion: 2,
		posts
	});
	expect(full.read("store.readOnly")).toBe(false);
	expect(() =>
		full.read("addComment(store.state,'p10','Another','global-overflow')")
	).toThrow();
});
it("upgrades an earlier board and confirms reset without changing canceled work", () => {
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
	const app = runtime("adding-comments", "reference", previous);
	expect(app.read("store.state.schemaVersion")).toBe(2);
	expect(app.read("store.state.posts[0].id")).toBe("old-post");
	expect(app.read("store.state.posts[0].comments.length")).toBe(0);
	app.read(
		"perform(state=>addComment(state,'old-post','Saved','c-one'),'Saved.')"
	);
	const saved = app.memory.get(app.key);
	app.confirm(false);
	(document.querySelector("#reset") as HTMLButtonElement).click();
	expect(app.memory.get(app.key)).toBe(saved);
	app.confirm(true);
	(document.querySelector("#reset") as HTMLButtonElement).click();
	expect(app.read("store.state.posts.length")).toBe(2);
	expect(
		app.read("store.state.posts.flatMap(post=>post.comments).length")
	).toBe(0);
});

it("opens denied storage read-only without attempting a replacement write", () => {
	const app = runtime("todo-list");
	app.read(
		"globalThis.deniedWrites=0;globalThis.deniedStore=openDocument(()=>({getItem(){throw new Error('denied');},setItem(){deniedWrites++;}}),'denied',normalizeDocument,seedDocument)"
	);
	expect(app.read("deniedStore.readOnly")).toBe(true);
	expect(app.read("deniedStore.storage")).toBe(null);
	expect(app.read("deniedStore.state.notes.length")).toBe(2);
	expect(() =>
		app.read(
			"commitDocument(deniedStore,state=>addNote(state,'New','denied-id'),normalizeDocument)"
		)
	).toThrow();
	expect(app.read("deniedWrites")).toBe(0);
});
it("rejects an oversized encoded document before writing or changing working state", () => {
	const app = runtime("todo-list");
	const original = JSON.stringify(app.read("store.state"));
	app.read(
		"globalThis.largeStore={state:{text:'prior'},storage:{setItem(){throw new Error('write must not be called');}},key:'large',readOnly:false};globalThis.identityDocument=value=>({document:value})"
	);
	expect(() =>
		app.read(
			"commitDocument(largeStore,state=>{state.text='界'.repeat(45000);return true;},identityDocument)"
		)
	).toThrow("Document is too large.");
	expect(app.read("largeStore.state.text")).toBe("prior");
	expect(JSON.stringify(app.read("store.state"))).toBe(original);
});
