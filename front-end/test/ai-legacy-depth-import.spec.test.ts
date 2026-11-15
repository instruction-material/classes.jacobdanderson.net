import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
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

function readFixture(name: string) {
	return JSON.parse(
		readFileSync(resolve("../test/fixtures/" + name), "utf8")
	);
}
const fixtures = [
	readFixture("ai-legacy-depth-sources.json"),
	readFixture("ai-legacy-bank-sources.json")
];
const sha = (value: string) => createHash("sha256").update(value).digest("hex");
afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});
for (const fixture of fixtures) {
	it(
		"keeps corrected legacy references on exact source " + fixture.revision,
		async () => {
			setActivePinia(createPinia());
			useAppStore().setCurrentTutor({
				_id: "depth-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: ["ai-level-1"],
				editTutors: false,
				saveEdit: "Save"
			});
			const course =
				(await useCoursesStore().loadCourseById("ai-level-1"))!;
			const text = JSON.stringify(course);
			for (const project of fixture.projects)
				expect(text).toContain(project.url);
		}
	);
	for (const project of fixture.projects) {
		it(
			"imports, saves, reopens and exports the complete corrected " +
				project.folder,
			async () => {
				vi.stubGlobal("crypto", webcrypto);
				const expected = Object.fromEntries(
					(project.files ?? ["main.py", "README.md"]).map(
						(name: string) => [
							name,
							fixture.files[project.folder + "/" + name]
						]
					)
				);
				const requests: string[] = [];
				vi.stubGlobal(
					"fetch",
					vi.fn(async (input: string | URL | Request) => {
						const url = new URL(String(input));
						requests.push(String(url));
						if (url.hostname === "api.github.com") {
							expect(url.searchParams.get("ref")).toBe(
								fixture.revision
							);
							expect(decodeURIComponent(url.pathname)).toBe(
								"/repos/instruction-material/AI-Level-1/contents/" +
									project.folder
							);
							return new Response(
								JSON.stringify(
									Object.entries(expected).map(
										([name, file]: [string, any]) => ({
											type: "file",
											name,
											path: project.folder + "/" + name,
											size: file.byteLength,
											sha: file.gitBlob,
											html_url:
												"https://github.com/instruction-material/AI-Level-1/blob/" +
												fixture.revision +
												"/" +
												project.folder +
												"/" +
												name,
											download_url:
												"https://raw.githubusercontent.com/instruction-material/AI-Level-1/" +
												fixture.revision +
												"/" +
												project.folder +
												"/" +
												name
										})
									)
								)
							);
						}
						expect(url.hostname).toBe("raw.githubusercontent.com");
						const name = url.pathname.split("/").at(-1)!;
						expect(url.pathname).toBe(
							"/instruction-material/AI-Level-1/" +
								fixture.revision +
								"/" +
								project.folder +
								"/" +
								name
						);
						expect(expected[name]).toBeTruthy();
						return new Response(expected[name].content);
					})
				);
				expect(requests).toHaveLength(0);
				const files = await loadPythonIdeStarterFilesFromGitHub(
					project.url,
					"data"
				);
				expect(files).toHaveLength(Object.keys(expected).length);
				for (const file of files) {
					expect(file.content).toBe(expected[file.name].content);
					expect(sha(file.content)).toBe(expected[file.name].sha256);
				}
				if (
					project.folder === "FAI9-Implement-DLS" ||
					project.folder === "FAI9-Implement-IDS"
				) {
					expect(
						files.find(f => f.name === "main.py")!.content
					).toContain("best_depth");
					expect(
						files.find(f => f.name === "README.md")!.content
					).toContain("S B C X A G");
				}
				const saved = createPythonIdeProject("data", {
					courseID: "ai-level-1",
					files
				});
				saved.files.find(f => f.name === "main.py")!.content +=
					"\n# Saved legacy reference case.\n";
				await saveLocalPythonProjects([saved]);
				const reopened = (await loadLocalPythonProjectsAsync()).find(
					p => p._id === saved._id
				)!;
				expect(reopened.files).toEqual(saved.files);
				const archive = unzipSync(await createProjectArchive(reopened));
				expect(Object.keys(archive)).toHaveLength(
					Object.keys(expected).length
				);
				for (const file of reopened.files) {
					const path = Object.keys(archive).find(
						name =>
							name === file.name || name.endsWith("/" + file.name)
					)!;
					expect(strFromU8(archive[path])).toBe(file.content);
				}
				expect(requests).toHaveLength(1 + Object.keys(expected).length);
			}
		);
	}
}
