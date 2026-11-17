import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	machineLearningNativeResource,
	machineLearningNativeRunInstructions
} from "@/modules/machineLearningNativeInstructions";
import { loadPythonIdeStarterFilesFromGitHub } from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import fixture from "../../test/fixtures/machine-learning-library-workspaces.json";

const base = "https://github.com/instruction-material/AI-Level-2";
const roots = [
	...new Set(
		Object.keys(fixture.files).map(path =>
			path.split("/").slice(0, -1).join("/")
		)
	)
];

afterEach(() => vi.unstubAllGlobals());

describe("native Machine Learning library workspaces", () => {
	it("imports all fourteen complete roles with their committed data and runtime lock", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async (input: RequestInfo | URL) => {
				const url = new URL(String(input));
				if (url.hostname === "api.github.com") {
					expect(url.searchParams.get("ref")).toBe(fixture.revision);
					const prefix =
						decodeURIComponent(
							url.pathname.split("/contents/")[1]!
						) + "/";
					return new Response(
						JSON.stringify(
							Object.entries(fixture.files)
								.filter(([path]) => path.startsWith(prefix))
								.map(([path, file]) => ({
									type: "file",
									name: path.slice(prefix.length),
									path,
									size: file.byteLength,
									html_url: `${base}/blob/${fixture.revision}/${path}`,
									download_url: `https://raw.githubusercontent.com/instruction-material/AI-Level-2/${fixture.revision}/${path}`
								}))
						),
						{ headers: { "Content-Type": "application/json" } }
					);
				}
				expect(url.hostname).toBe("raw.githubusercontent.com");
				const path = url.pathname.split("/").slice(4).join("/");
				const files: Record<string, { content: string }> =
					fixture.files;
				expect(files[path], path).toBeDefined();
				return new Response(files[path]!.content);
			})
		);
		expect(roots).toHaveLength(14);
		for (const root of roots) {
			const url = `${base}/tree/${fixture.revision}/${root}`;
			const imported = await loadPythonIdeStarterFilesFromGitHub(
				url,
				"data"
			);
			const expected = Object.entries(fixture.files).filter(([path]) =>
				path.startsWith(root + "/")
			);
			expect(imported).toHaveLength(expected.length);
			for (const [path, file] of expected) {
				const name = path.slice(root.length + 1);
				const actual = imported.find(row => row.name === name)!;
				expect(actual?.content, path).toBe(file.content);
				expect(Buffer.byteLength(actual.content)).toBe(file.byteLength);
				expect(
					createHash("sha256").update(actual.content).digest("hex")
				).toBe(file.sha256);
			}
			const instructions = machineLearningNativeRunInstructions(
				imported,
				url
			)!;
			expect(instructions).toContain("python3.14 -m venv .venv");
			expect(instructions).toContain(
				".venv/bin/python -m pip install --require-hashes -r requirements.txt"
			);
			expect(instructions).toContain(
				"MPLBACKEND=Agg .venv/bin/python main.py"
			);
			expect(
				machineLearningNativeRunInstructions(
					imported.filter(file => file.name !== "requirements.txt"),
					url
				)
			).toEqual([
				"A required project file is missing. Restore the complete selected source before running locally."
			]);
		}
	});

	it("keeps earlier data and clustering workflows on their existing runtime", () => {
		const library = `${base}/tree/${fixture.revision}/ML-Library-Workspaces/car-neighbors/starter`;
		expect(machineLearningNativeResource(library)?.kind).toBe("library");
		expect(
			machineLearningNativeResource(
				`${base}/tree/main/ML1-Flower-Clustering-Starter`
			)
		).toBeNull();
		for (const url of [
			`${base}/tree/main/ML-01-ml2-k-nearest-neighbors-supplemental-2/starter`,
			`${base}/tree/main/ML0-Offline-Data-Card/starter`,
			library.replace("instruction-material", "another-owner"),
			library.replace("/starter", "/unknown"),
			library + "/main.py",
			library.replace("/tree/", "/blob/")
		])
			expect(machineLearningNativeResource(url), url).toBeNull();
	});

	for (const role of ["learner", "instructor"] as const) {
		it(`preserves all twelve activity identities and complete assignments for ${role}`, async () => {
			setActivePinia(createPinia());
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "ml-library-tutor",
					name: "Instructor",
					email: "ml@example.invalid",
					age: 30,
					state: "GA",
					usersOfTutorLength: 0,
					coursePermissions: ["machine-learning"],
					editTutors: false,
					saveEdit: "Save"
				});
			const course =
				(await useCoursesStore().loadCourseById("machine-learning"))!;
			for (const project of fixture.projects) {
				const module = course.modules.find(
					row => row.id === project.moduleId
				)!;
				const item = [
					...module.curriculum,
					...module.supplementalProjects
				].find(row => row.id === project.itemId)!;
				expect(item, project.rawTitle).toBeDefined();
				expect(item.content).toBe(project.assignmentText.trim());
				expect(item.projectLink).toBe(
					`${base}/tree/${fixture.revision}/${project.sources.starter}`
				);
				expect(item.solutionLink).toBe(
					role === "instructor"
						? `${base}/tree/${fixture.revision}/${project.sources.solution}`
						: undefined
				);
				expect(item.ideImport).toBe(true);
				if (project.analysis) expect(item.content).toMatch(/completed/);
			}
			const car = course.modules.find(
				row => row.title === "KNN Car Classification: Practice Studio"
			)!;
			expect(
				car.curriculum.find(row => row.title.endsWith("Core Concepts"))
					?.content
			).toContain("squared distance 2");
			expect(
				car.curriculum.find(row => row.title.endsWith("Guided Example"))
					?.content
			).toContain("distance to (low,low) is 1");
			expect(
				car.curriculum.find(row => row.title.startsWith("Review:"))
					?.content
			).toContain("3/7");
		});
	}
});
