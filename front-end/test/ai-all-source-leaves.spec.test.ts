import { createHash, webcrypto } from "node:crypto";
import { afterEach, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { unzipSync, strFromU8 } from "fflate";
import fixture from "../../test/fixtures/ai-all-source-leaves.json";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjectsAsync,
	loadPythonIdeStarterFilesFromGitHub,
	pythonIdeModeForCourseResource,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useCoursesStore } from "@/stores/courses";

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});
const sha = (text: string) => createHash("sha256").update(text).digest("hex");
it("offers imports for every exact AI source leaf while retaining the archive as a reference", async () => {
	setActivePinia(createPinia());
	const course = (await useCoursesStore().loadCourseById("ai-level-1"))!;
	const leafURLs = new Set(fixture.projects.map(p => p.url));
	const items = course.modules
		.filter(m => !m.internal)
		.flatMap(m => [...m.curriculum, ...m.supplementalProjects]);
	for (const item of items) {
		if (item.projectLink && leafURLs.has(item.projectLink)) {
			expect(item.ideImport, item.title).toBe(true);
			expect(
				pythonIdeModeForCourseResource("ai-level-1", item.projectLink)
			).toBe("data");
		}
	}
	const archive = items.find(
		item => item.title === "Reference Archive: AI Level 1 Workspace"
	)!;
	expect(archive.ideImport).not.toBe(true);
	expect(leafURLs.has(archive.projectLink!)).toBe(false);
	expect(leafURLs.size).toBe(85);
});
for (const project of fixture.projects) {
	it(
		"imports, edits, saves, reopens and exports exact " +
			project.folder +
			" @" +
			project.revision.slice(0, 7),
		async () => {
			vi.stubGlobal("crypto", webcrypto);
			const expected = new Map(
				project.files.map(file => [
					file.path,
					{
						...file,
						...fixture.files[file.key as keyof typeof fixture.files]
					}
				])
			);
			const requests: string[] = [];
			vi.stubGlobal(
				"fetch",
				vi.fn(async (input: string | URL | Request) => {
					const url = new URL(String(input));
					requests.push(url.href);
					if (url.hostname === "api.github.com") {
						expect(url.searchParams.get("ref")).toBe(
							project.revision
						);
						expect(decodeURIComponent(url.pathname)).toBe(
							"/repos/instruction-material/AI-Level-1/contents/" +
								project.folder
						);
						return new Response(
							JSON.stringify(
								[...expected.values()].map(file => ({
									type: "file",
									name: file.name,
									path: file.path,
									size: file.bytes,
									html_url:
										"https://github.com/instruction-material/AI-Level-1/blob/" +
										project.revision +
										"/" +
										file.path,
									download_url:
										"https://raw.githubusercontent.com/instruction-material/AI-Level-1/" +
										project.revision +
										"/" +
										file.path
								}))
							)
						);
					}
					expect(url.hostname).toBe("raw.githubusercontent.com");
					const path = decodeURIComponent(url.pathname).slice(
						(
							"/instruction-material/AI-Level-1/" +
							project.revision +
							"/"
						).length
					);
					const file = expected.get(path);
					expect(file, path).toBeDefined();
					return new Response(file!.content);
				})
			);
			const mode = pythonIdeModeForCourseResource(
				"ai-level-1",
				project.url
			)!;
			expect(mode).toBe("data");
			const files = await loadPythonIdeStarterFilesFromGitHub(
				project.url,
				mode
			);
			expect(files.map(file => file.name).sort()).toEqual(
				project.files.map(file => file.name).sort()
			);
			for (const file of files) {
				const original = [...expected.values()].find(
					row => row.name === file.name
				)!;
				expect(file.content).toBe(original.content);
				expect(sha(file.content)).toBe(original.sha256);
			}
			expect(requests[0]).toContain("api.github.com/");
			const saved = createPythonIdeProject(mode, {
				courseID: "ai-level-1",
				files
			});
			const entry = saved.files.find(file => file.name === "main.py")!;
			entry.content += "\n# Recorded source-leaf observation\n";
			await saveLocalPythonProjects([saved]);
			const reopened = (await loadLocalPythonProjectsAsync()).find(
				row => row._id === saved._id
			)!;
			expect(reopened.files).toEqual(saved.files);
			const archive = unzipSync(await createProjectArchive(reopened));
			expect(Object.keys(archive)).toHaveLength(saved.files.length);
			for (const file of saved.files) {
				const path = Object.keys(archive).find(path =>
					path.endsWith("/" + file.name)
				)!;
				expect(path, file.name).toBeDefined();
				expect(strFromU8(archive[path])).toBe(file.content);
			}
			expect(requests).toHaveLength(1 + project.files.length);
		}
	);
}
