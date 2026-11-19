import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { unzipSync } from "fflate";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	dataScienceCleaningFolders,
	dataScienceCleaningProjectKey,
	dataScienceCleaningRevision
} from "@/modules/dataScienceCleaningResources";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { dataScienceInPythonCourse } from "@/stores/courses/data-science-in-python";
import guidance from "@/stores/courses/dataScienceCleaningGuidanceData.json";
import { normalizeRawCourse } from "@/stores/courses/normalization";

const fixture = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/data-science-cleaning-code-packs.json"
		),
		"utf8"
	)
) as {
	revision: string;
	files: Record<string, { content: string; sha256: string; bytes: number }>;
};
const url = (folder: string, role: string) =>
	`https://github.com/instruction-material/Data-Science/tree/${fixture.revision}/${folder}/${role}`;
const digest = (value: Uint8Array | string) =>
	createHash("sha256").update(value).digest("hex");

function stubGitHub(missingCSV = false) {
	vi.stubGlobal(
		"fetch",
		vi.fn(async (input: string | URL | Request) => {
			const request = new URL(String(input));
			if (request.hostname === "api.github.com") {
				expect(request.searchParams.get("ref")).toBe(fixture.revision);
				const path = decodeURIComponent(
					request.pathname.replace(
						"/repos/instruction-material/Data-Science/contents/",
						""
					)
				);
				const children = new Map<string, unknown>();
				for (const [name, file] of Object.entries(fixture.files)) {
					if (!name.startsWith(`${path}/`)) continue;
					const suffix = name.slice(path.length + 1);
					const first = suffix.split("/")[0]!;
					if (suffix.includes("/")) {
						children.set(first, {
							type: "dir",
							name: first,
							path: `${path}/${first}`
						});
					} else {
						children.set(first, {
							type: "file",
							name: first,
							path: name,
							size: file.bytes,
							html_url: `https://github.com/instruction-material/Data-Science/blob/${fixture.revision}/${name}`,
							download_url: `https://raw.githubusercontent.com/instruction-material/Data-Science/${fixture.revision}/${name}`
						});
					}
				}
				return new Response(JSON.stringify([...children.values()]));
			}
			expect(request.origin).toBe("https://raw.githubusercontent.com");
			const prefix = `/instruction-material/Data-Science/${fixture.revision}/`;
			expect(request.pathname.startsWith(prefix)).toBe(true);
			const path = decodeURIComponent(
				request.pathname.slice(prefix.length)
			);
			if (missingCSV && path.endsWith(".csv"))
				return new Response(null, { status: 404 });
			expect(fixture.files[path], path).toBeDefined();
			return new Response(fixture.files[path]!.content);
		})
	);
}

afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

describe("Data Science cleaning studio source and saved work", () => {
	it("places its complete explanations in Learn and keeps written artifacts source-free", () => {
		const course = normalizeRawCourse(
			"data-science-in-python",
			dataScienceInPythonCourse
		);
		for (const entry of guidance) {
			const module = course.modules.find(m => m.title === entry.module)!;
			const item = [
				...module.curriculum,
				...module.supplementalProjects
			].find(i => i.title === entry.title)!;
			expect(item.content, entry.title).toBe(entry.content);
			expect(isLessonLearningItem({ ...item, id: "checked-item" })).toBe(
				entry.contentKind === "reading"
			);
			if (!entry.folder) {
				expect(item.projectLink).toBeUndefined();
				expect(item.solutionLink).toBeUndefined();
				expect(item.ideImport).toBeUndefined();
			} else {
				expect(item.projectLink).toBe(url(entry.folder, "starter"));
				expect(item.solutionLink).toBe(url(entry.folder, "solution"));
			}
		}
	});

	it("continues the cleaning extension in the same saved project and keeps earlier imports distinct", () => {
		const folder = dataScienceCleaningFolders[0]!;
		const key = dataScienceCleaningProjectKey(
			"data-science-in-python",
			"summary",
			"starter",
			url(folder, "starter")
		);
		expect(
			dataScienceCleaningProjectKey(
				"data-science-in-python",
				"extension",
				"starter",
				url(folder, "starter")
			)
		).toBe(key);
		expect(key).not.toBe("data-science-in-python:summary:starter");
		expect(
			dataScienceCleaningProjectKey(
				"data-science-in-python",
				"summary",
				"reference",
				url(folder, "solution")
			)
		).not.toBe(key);
		for (const source of [
			url(folder, "starter").replace(fixture.revision, "main"),
			url(folder, "starter").replace(
				"instruction-material",
				"someone-else"
			),
			url(folder, "starter") + "/extra"
		]) {
			expect(
				dataScienceCleaningProjectKey(
					"data-science-in-python",
					"summary",
					"starter",
					source
				)
			).toBeNull();
		}
	});

	it.each(
		dataScienceCleaningFolders.flatMap(folder =>
			["starter", "solution"].map(role => ({ folder, role }))
		)
	)(
		"imports, reopens and exports every nested CSV byte for $folder/$role",
		async ({ folder, role }) => {
			stubGitHub();
			expect(fixture.revision).toBe(dataScienceCleaningRevision);
			const files = await loadPythonIdeStarterFilesFromGitHub(
				url(folder, role),
				"data"
			);
			expect(files.map(f => f.name)).toEqual([
				"main.py",
				"data/sample.csv"
			]);
			const earlier = createPythonIdeProject("data", {
				title: "Earlier CSV attempt",
				files: [{ name: "main.py", content: "print('earlier')\n" }]
			});
			const project = createPythonIdeProject("data", {
				title: "cleaning studio",
				files
			});
			saveLocalPythonProjects([earlier, project]);
			const saved = loadLocalPythonProjects();
			expect(saved[0]!.files).toEqual(earlier.files);
			expect(saved[1]!.files).toEqual(files);
			const archive = unzipSync(createProjectArchive(saved[1]!));
			for (const file of files) {
				const expected =
					fixture.files[`${folder}/${role}/${file.name}`]!;
				expect(digest(file.content)).toBe(expected.sha256);
				expect(digest(archive[`${project.title}/${file.name}`]!)).toBe(
					expected.sha256
				);
			}
		}
	);

	it("rejects a failed CSV download rather than returning a partial runnable project", async () => {
		stubGitHub(true);
		await expect(
			loadPythonIdeStarterFilesFromGitHub(
				url(dataScienceCleaningFolders[0]!, "starter"),
				"data"
			)
		).rejects.toThrow("GitHub returned 404");
	});
});
