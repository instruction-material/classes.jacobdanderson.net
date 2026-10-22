import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
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
	webChatRoot,
	webChatRoleFiles,
	webCourseProjectKey,
	webCourseResource,
	webNotificationRoot
} from "@/modules/webProjectResources";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(
	readFileSync(resolve("../test/fixtures/web-live-chat-source.json"), "utf8")
);
const moduleId =
	"web-development-foundations-wdf4-stage-3-front-end-applications";
const activityId = `${moduleId}-supplemental-project-real-time-chat-or-notification-app`;

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

describe("live chat source workflow", () => {
	it("keeps the required fixture lab and assigns the live transport after backend basics", async () => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById(
			"web-development-foundations"
		))!;
		const module = course.modules.find(row => row.id === moduleId)!;
		expect(module.curriculum[1].projectLink).toBe(
			`${webNotificationRoot}/starter`
		);
		expect(module.curriculum[1].learningPath).toBe("core");
		const chat = module.supplementalProjects[0];
		expect(chat.id).toBe(activityId);
		expect(chat.title).toBe("Choice: Trace Live Chat after WDF5");
		expect(chat.learningPath).toBe("choice");
		expect(chat.projectLink).toBe(`${webChatRoot}/starter`);
		expect(chat.ideImport).toBe(true);
		expect(chat.content).toBe(
			readFileSync(
				resolve("src/assets/course-guides/web-live-chat.md"),
				"utf8"
			).trim()
		);
		expect(module.curriculum).toHaveLength(2);
		expect(module.supplementalProjects).toHaveLength(3);
		for (const token of [
			"chat:message",
			"chat:join",
			"textContent",
			"acknowledgement timeout",
			"100-item",
			"root lockfile",
			"does not implement rooms",
			"does not implement this protocol"
		])
			expect(chat.content).toContain(token);
	});

	it.each(["starter", "solution"] as const)(
		"retains complete %s exports and leaves notification and historical chat attempts intact",
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
			const url = `${webChatRoot}/${role}`;
			expect(
				webCourseResource(url.replace(fixture.revision, "main"))
					?.resource.ref
			).toBe(fixture.revision);
			expect(
				webCourseResource(`${webNotificationRoot}/${role}`)?.definition
					.project
			).toBe("notification-state");
			expect(webCourseResource(url)?.definition.project).toBe(
				"live-chat"
			);
			const files = await loadPythonIdeStarterFilesFromGitHub(url, "web");
			const names = [
				...webChatRoleFiles,
				...(role === "solution" ? ["public/styles.css"] : []),
				"README.md"
			];
			expect(files.map(row => row.name)).toEqual(names);
			expect(requests).toHaveLength(names.length);
			for (const file of files) {
				const path = `${fixture.pack}/${file.name === "README.md" ? "" : role + "/"}${file.name}`;
				expect(file.content).toBe(fixture.files[path].content);
				expect(
					createHash("sha256").update(file.content).digest("hex")
				).toBe(fixture.files[path].sha256);
			}
			const keyRole = role === "starter" ? "starter" : "reference";
			const prior = [
				`web-development-foundations:notification-state:${keyRole}:web-source-v1`,
				`web-development-foundations:${activityId}:${keyRole}`
			].map(courseProjectKey =>
				createPythonIdeProject("web", {
					courseProjectKey,
					files: [
						{
							name: "README.md",
							content: "Retained earlier work\n",
							encoding: "text"
						}
					]
				})
			);
			const originals = structuredClone(prior);
			const key = webCourseProjectKey(
				"web-development-foundations",
				activityId,
				keyRole,
				url
			);
			expect(key).toBe(
				`web-development-foundations:live-chat:${keyRole}:web-source-v1`
			);
			const project = createPythonIdeProject("web", {
				files,
				courseProjectKey: key,
				starterUrl: url
			});
			expect(project.activeFileName).toBe("src/server.js");
			project.files.find(row => row.name === "src/server.js")!.content +=
				"\n// Saved native transport investigation\n";
			project.files.find(row => row.name === "public/chat.js")!.content +=
				"\n// Saved client event trace\n";
			project.files.find(row => row.name === "README.md")!.content +=
				"\nSaved two-client recovery observations.\n";
			await saveLocalPythonProjects([...prior, project]);
			const reopened = await loadLocalPythonProjects();
			for (const original of originals)
				expect(reopened.find(row => row._id === original._id)).toEqual(
					original
				);
			const saved = reopened.find(row => row._id === project._id)!;
			expect(saved).toEqual(project);
			const bytes = createProjectArchive(saved);
			const zip = unzipSync(bytes);
			expect(Object.keys(zip)).toHaveLength(names.length);
			for (const file of saved.files) {
				const paths = Object.keys(zip).filter(name =>
					name.endsWith(`/${file.name}`)
				);
				expect(paths).toHaveLength(1);
				expect(strFromU8(zip[paths[0]])).toBe(file.content);
			}
			const commands = webBuildInstructions(url).join("\n");
			expect(commands).toContain(fixture.revision);
			expect(commands).toContain(
				`npm run start --workspace ${fixture.pack}/${role}`
			);
			expect(commands).toContain("127.0.0.1:3003");
			expect(commands).toContain("lacks the root dependency lockfile");
			expect(commands).toContain(
				"does not run the Node.js or Socket.IO service"
			);
			if (process.env.WEB_CHAT_EXPORT_DIR) {
				mkdirSync(process.env.WEB_CHAT_EXPORT_DIR, { recursive: true });
				writeFileSync(
					resolve(process.env.WEB_CHAT_EXPORT_DIR, `${role}.zip`),
					bytes
				);
			}
		}
	);
});
