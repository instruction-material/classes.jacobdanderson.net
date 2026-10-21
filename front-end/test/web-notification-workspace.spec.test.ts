import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { strFromU8, unzipSync } from "fflate";
import { JSDOM } from "jsdom";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { webBuildInstructions } from "@/modules/webBuildInstructions";
import {
	webCourseProjectKey,
	webCourseResourceUrl,
	webNotificationRoot
} from "@/modules/webProjectResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/web-notification-source.json"),
		"utf8"
	)
);
const moduleId =
	"web-development-foundations-wdf4-stage-3-front-end-applications";
const names = [
	"index.html",
	"app.mjs",
	"state.mjs",
	"styles.css",
	"events.json",
	"empty.json",
	"invalid.json",
	"malformed.json",
	"history.json",
	"out-of-order.json",
	"README.md",
	"serve.mjs"
];
const settle = async () => {
	for (let i = 0; i < 4; i++)
		await new Promise(resolve => setTimeout(resolve, 0));
};

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

describe("web notification source workflow", () => {
	it("requires the local front-end lab and preserves full reading and reference roles", async () => {
		setActivePinia(createPinia());
		const app = useAppStore();
		app.setCurrentTutor({
			_id: "web-tutor",
			name: "Tutor",
			email: "tutor@example.invalid",
			age: 30,
			state: "GA",
			usersOfTutorLength: 0,
			coursePermissions: ["web-development-foundations"],
			editTutors: false,
			saveEdit: "Save"
		});
		const store = useCoursesStore();
		const staff = (await store.loadCourseById(
			"web-development-foundations"
		))!.modules.find(row => row.id === moduleId)!;
		app.setCurrentTutor(null);
		const learner = (await store.loadCourseById(
			"web-development-foundations"
		))!.modules.find(row => row.id === moduleId)!;
		expect(learner.title).toBe(
			"WDF4 Notification Views and Asynchronous State"
		);
		const source = fixture.files[`${fixture.pack}/README.md`].content;
		const [intro, body] = source.split("## Files and startup");
		expect(learner.curriculum[0].content).toContain(intro.trim());
		expect(learner.curriculum[0].content.replaceAll("`TODO`", "TODO")).toContain(
			`## Files and startup${body}`.trim()
		);
		expect(learner.curriculum[0].content).toBe(
			readFileSync(
				resolve("src/assets/course-guides/web-notification-state.md"),
				"utf8"
			).trim()
		);
		expect(learner.curriculum[0].content).toContain(
			`git switch --detach ${fixture.revision}`
		);
		expect(learner.curriculum[1].learningPath).toBe("core");
		expect(learner.curriculum[1].projectLink).toBe(
			`${webNotificationRoot}/starter`
		);
		expect(staff.curriculum[1].solutionLink).toBe(
			`${webNotificationRoot}/solution`
		);
		expect(learner.curriculum[1].solutionLink).toBeUndefined();
		expect(
			learner.supplementalProjects.map(row => row.learningPath)
		).toEqual(["choice", "choice", "challenge"]);
		expect(staff.supplementalProjects[0].projectLink).toContain(
			`/tree/${fixture.revision}/WDF4-Realtime-Chat-App/starter`
		);
		expect(
			staff.supplementalProjects.slice(1).every(row => !row.solutionLink)
		).toBe(true);
		expect(learner.curriculum.map(row => row.id)).toEqual(
			staff.curriculum.map(row => row.id)
		);
	});

	it.each(["starter", "solution"] as const)(
		"imports, completes and exports the exact %s source without replacing earlier work",
		async role => {
			const requests: string[] = [];
			vi.stubGlobal(
				"fetch",
				vi.fn(async (input: string | URL) => {
					const url = String(input);
					requests.push(url);
					const file =
						fixture.files[url.split(`/${fixture.revision}/`)[1]];
					return new Response(file?.content ?? "missing", {
						status: file ? 200 : 404
					});
				})
			);
			const url = `${webNotificationRoot}/${role}`;
			expect(webCourseResourceUrl(url)).toBe(url);
			const files = await loadPythonIdeStarterFilesFromGitHub(url, "web");
			expect(files.map(row => row.name)).toEqual(names);
			expect(requests).toHaveLength(12);
			for (const file of files) {
				const path = fixture.sharedFiles.includes(file.name)
					? `${fixture.pack}/${file.name}`
					: `${fixture.pack}/${role}/${file.name}`;
				expect(file.content).toBe(fixture.files[path].content);
			}
			expect(
				requests.some(request =>
					request.includes(
						role === "starter" ? "/solution/" : "/starter/"
					)
				)
			).toBe(false);
			const prior = createPythonIdeProject("web", {
				title: "Earlier portfolio",
				courseProjectKey:
					"web-development-foundations:portfolio:starter:web-source-v2",
				files: [
					{
						name: "index.html",
						content: "<h1>Saved portfolio</h1>",
						encoding: "text"
					}
				]
			});
			const original = structuredClone(prior);
			const key = webCourseProjectKey(
				"web-development-foundations",
				moduleId,
				role === "starter" ? "starter" : "reference",
				url
			);
			expect(key).toBe(
				`web-development-foundations:notification-state:${role === "starter" ? "starter" : "reference"}:web-source-v1`
			);
			const project = createPythonIdeProject("web", {
				files,
				courseProjectKey: key,
				starterUrl: url
			});
			project.files.find(row => row.name === "state.mjs")!.content =
				fixture.files[`${fixture.pack}/solution/state.mjs`].content +
				"\n// Saved notification completion\n";
			project.activeFileName = "state.mjs";
			await saveLocalPythonProjects([prior, project]);
			const reopened = await loadLocalPythonProjects();
			expect(reopened.find(row => row._id === prior._id)).toEqual(
				original
			);
			const saved = reopened.find(row => row._id === project._id)!;
			expect(saved).toEqual(project);
			const bytes = createProjectArchive(saved);
			const zip = unzipSync(bytes);
			expect(Object.keys(zip)).toHaveLength(12);
			for (const file of saved.files) {
				const name = Object.keys(zip).find(name =>
					name.endsWith(`/${file.name}`)
				)!;
				expect(strFromU8(zip[name])).toBe(file.content);
			}
			const instructions = webBuildInstructions(url).join("\n");
			expect(instructions).toContain("node serve.mjs");
			expect(instructions).toContain(fixture.revision);
			expect(instructions).not.toContain("npm ci");
			if (process.env.WEB_NOTIFICATION_EXPORT_DIR) {
				mkdirSync(process.env.WEB_NOTIFICATION_EXPORT_DIR, {
					recursive: true
				});
				writeFileSync(
					resolve(
						process.env.WEB_NOTIFICATION_EXPORT_DIR,
						`${role}.zip`
					),
					bytes
				);
				writeFileSync(
					resolve(
						process.env.WEB_NOTIFICATION_EXPORT_DIR,
						`${role}.json`
					),
					JSON.stringify(
						{
							role,
							sourceRevision: fixture.revision,
							courseProjectKey: key,
							activeFileName: saved.activeFileName,
							files: saved.files
						},
						null,
						2
					)
				);
			}
		}
	);

	it.each(["starter", "solution"] as const)(
		"executes %s fixture states, routing, focus and late-response recovery",
		async role => {
			const root = `${fixture.pack}/${role}/`;
			const dom = new JSDOM(fixture.files[root + "index.html"].content, {
				url: "https://example.invalid/#all"
			});
			try {
				const { window } = dom;
				const { document } = window;
				let override: string | undefined;
				let hold = false;
				let release: () => void;
				const requests: { url: string; signal: AbortSignal }[] = [];
				const fetchFixture = (
					url: string,
					options: { signal: AbortSignal }
				) => {
					requests.push({ url, signal: options.signal });
					const text =
						override ??
						fixture.files[root + url.replace("./", "")]?.content;
					const response = new Response(text ?? "missing", {
						status: text === undefined ? 404 : 200
					});
					return hold
						? new Promise(resolve => {
								release = () => resolve(response);
							})
						: Promise.resolve(response);
				};
				const code =
					fixture.files[root + "state.mjs"].content.replaceAll(
						"export ",
						""
					) +
					"\n" +
					fixture.files[root + "app.mjs"].content.replace(
						/^import[\s\S]+?from "\.\/state.mjs";\s*/,
						""
					);
				runInNewContext(code, {
					window,
					document,
					AbortController,
					fetch: fetchFixture
				});
				const phase = () =>
					(document.querySelector("#load-status") as HTMLElement)
						.dataset.phase;
				const select = document.querySelector(
					"#fixture"
				) as HTMLSelectElement;
				const button = (name: string) =>
					document.querySelector("#" + name) as HTMLButtonElement;
				expect(phase()).toBe("ready");
				if (role === "starter") {
					button("load").focus();
					button("load").click();
					await settle();
					expect(phase()).toBe("error");
					expect(document.activeElement).toBe(button("load"));
					button("reset").click();
					await settle();
					expect(phase()).toBe("ready");
					return;
				}
				for (const [name, expected, count] of [
					["events", "connected", 2],
					["empty", "empty", 0],
					["invalid", "error", 0],
					["malformed", "error", 0],
					["history", "connected", 10],
					["out-of-order", "connected", 2]
				] as const) {
					select.value = name;
					button("load").focus();
					button("load").click();
					expect(phase()).toBe("loading");
					expect(document.activeElement).toBe(button("load"));
					const before = requests.length;
					button("load").click();
					expect(requests).toHaveLength(before);
					await settle();
					expect(phase()).toBe(expected);
					expect(document.querySelectorAll("#items li")).toHaveLength(
						count
					);
					expect(document.activeElement).toBe(button("load"));
				}
				select.value = "events";
				button("load").click();
				await settle();
				for (const [view, count] of [
					["messages", 1],
					["status", 1],
					["unknown", 2]
				] as const) {
					const before = requests.length;
					window.location.hash = view;
					await settle();
					expect(document.querySelectorAll("#items li")).toHaveLength(
						count
					);
					expect(requests).toHaveLength(before);
					expect(
						(
							document.querySelector(
								"nav [aria-current]"
							) as HTMLAnchorElement
						).hash
					).toBe("#" + (view === "unknown" ? "all" : view));
				}
				button("disconnect").focus();
				button("disconnect").click();
				expect(phase()).toBe("disconnected");
				expect(document.activeElement).toBe(button("disconnect"));
				button("reconnect").focus();
				button("reconnect").click();
				expect(phase()).toBe("reconnecting");
				await settle();
				expect(phase()).toBe("connected");
				override = JSON.stringify([
					{
						id: "literal",
						sequence: 1,
						type: "message",
						text: "<b>literal text</b>"
					}
				]);
				button("load").click();
				await settle();
				expect(document.querySelector("#items b")).toBeNull();
				expect(document.querySelector("#items p")!.textContent).toBe(
					"<b>literal text</b>"
				);
				window.location.hash = "status";
				await settle();
				expect(document.querySelectorAll("#items li")).toHaveLength(0);
				expect(
					(document.querySelector("#empty-view") as HTMLElement)
						.hidden
				).toBe(false);
				override = undefined;
				hold = true;
				select.value = "events";
				button("load").click();
				expect(phase()).toBe("loading");
				button("reset").focus();
				button("reset").click();
				expect(requests.at(-1)!.signal.aborted).toBe(true);
				release!();
				await settle();
				expect(phase()).toBe("ready");
				expect(document.querySelectorAll("#items li")).toHaveLength(0);
				expect(document.activeElement).toBe(button("reset"));
			} finally {
				dom.window.dispatchEvent(new dom.window.Event("pagehide"));
				dom.window.close();
			}
		}
	);
});
