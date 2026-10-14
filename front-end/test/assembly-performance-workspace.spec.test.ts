import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { assemblyBuildInstructions } from "@/modules/assemblyBuildInstructions";
import { assemblyCourseProjectKey } from "@/modules/assemblyProjectResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	pythonIdeModeForCourseResource,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/assembly-performance-contracts.json"
		),
		"utf8"
	)
) as {
	pack: string;
	revision: string;
	files: Record<string, { content: string; sha256: string }>;
};
const root =
	"https://github.com/instruction-material/Assembly/tree/" +
	fixture.revision +
	"/" +
	fixture.pack;
const itemId =
	"assembly-unit-11-performance-and-code-shape-curriculum-core-project-performance-and-code-shape";
afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

it("preserves the core progress identity, complete guide and distinct optional trace", async () => {
	setActivePinia(createPinia());
	const app = useAppStore();
	app.setCurrentTutor({
		_id: "performance-tutor",
		name: "Tutor",
		email: "tutor@example.invalid",
		age: 30,
		state: "GA",
		usersOfTutorLength: 0,
		coursePermissions: ["assembly"],
		editTutors: false,
		saveEdit: "Save"
	});
	const course = (await useCoursesStore().loadCourseById("assembly"))!;
	const items = course.modules.flatMap(m => m.curriculum);
	expect(items).toHaveLength(49);
	const project = items.find(i => i.projectLink === root + "/starter")!;
	expect(project.id).toBe(itemId);
	expect(project.ideImport).toBe(true);
	expect(project.solutionLink).toBe(root + "/solution");
	expect(project.content).toContain(
		fixture.files[fixture.pack + "/README.md"].content
			.split("\n")
			.slice(1)
			.join("\n")
			.replace(
				"Explain that wraparound before running it.",
				"Derive the wraparound sum before running it."
			)
			.trim()
	);
	const guide = course.modules
		.flatMap(m => m.supplementalProjects)
		.find(
			i =>
				i.projectLink ===
				root.replace("/tree/", "/blob/") + "/README.md"
		)!;
	expect(guide).toBeDefined();
	expect(guide.content).toContain("Optional transfer");
	expect(guide.solutionLink).toBeUndefined();
	expect(
		pythonIdeModeForCourseResource("assembly", guide.projectLink!)
	).toBeNull();
	app.setCurrentTutor(null);
	const learner = (await useCoursesStore().loadCourseById("assembly"))!;
	expect(learner.modules.flatMap(m => m.curriculum).map(i => i.id)).toEqual(
		items.map(i => i.id)
	);
	expect(
		learner.modules.flatMap(m => m.curriculum).find(i => i.id === itemId)
			?.solutionLink
	).toBeUndefined();
});

it.each(["starter", "solution"] as const)(
	"imports and exports exact %s role bytes while retaining the worksheet and earlier work",
	async role => {
		const requests: string[] = [];
		vi.stubGlobal(
			"fetch",
			vi.fn(async (input: string | URL) => {
				const url = String(input);
				requests.push(url);
				const name = url.split("/" + fixture.revision + "/")[1];
				const file = fixture.files[name];
				return new Response(file?.content ?? "missing", {
					status: file ? 200 : 404
				});
			})
		);
		const url = root + "/" + role;
		expect(pythonIdeModeForCourseResource("assembly", url)).toBe(
			"assembly"
		);
		const files = await loadPythonIdeStarterFilesFromGitHub(
			url,
			"assembly"
		);
		const expected = Object.keys(fixture.files).filter(
			name =>
				name.startsWith(fixture.pack + "/" + role + "/") ||
				name === fixture.pack + "/README.md"
		);
		expect(files.map(f => fixture.pack + "/" + f.name).sort()).toEqual(
			expected.sort()
		);
		expect(files).toHaveLength(9);
		expect(requests).toHaveLength(9);
		expect(
			requests.some(u =>
				u.includes(role === "starter" ? "/solution/" : "/starter/")
			)
		).toBe(false);
		const key = assemblyCourseProjectKey(
			"assembly",
			itemId,
			role === "starter" ? "starter" : "reference",
			url
		);
		const old = createPythonIdeProject("python", {
			courseProjectKey: key.replace(/:native-assembly$/, "")
		});
		const project = createPythonIdeProject("assembly", {
			files,
			courseID: "assembly",
			starterUrl: url,
			courseProjectKey: key
		});
		expect(project.activeFileName).toBe(role + "/loops.S");
		saveLocalPythonProjects([old, project]);
		const restored = loadLocalPythonProjects();
		expect(restored.find(p => p._id === old._id)).toEqual(old);
		const saved = restored.find(p => p._id === project._id)!;
		expect(saved.files).toEqual(files);
		const archive = createProjectArchive(saved);
		if (process.env.ASSEMBLY_EXPORT_PROOF_DIR) {
			mkdirSync(process.env.ASSEMBLY_EXPORT_PROOF_DIR, {
				recursive: true
			});
			writeFileSync(
				resolve(
					process.env.ASSEMBLY_EXPORT_PROOF_DIR,
					fixture.pack + "-" + role + ".zip"
				),
				archive
			);
		}
		const entries = unzipSync(archive);
		expect(Object.keys(entries)).toHaveLength(9);
		for (const file of files) {
			const expected = fixture.files[fixture.pack + "/" + file.name];
			const exported = entries[saved.title + "/" + file.name];
			expect(strFromU8(exported)).toBe(expected.content);
			expect(createHash("sha256").update(exported).digest("hex")).toBe(
				expected.sha256
			);
		}
		const instructions = assemblyBuildInstructions(files, url).join("\n");
		expect(instructions).toContain(
			"./build-debug/assembly_performance --example"
		);
		expect(instructions).toContain("--benchmark 64 3 2");
		expect(instructions).toContain("working baseline");
		expect(instructions).toContain("11 fixed and guard-page cases");
		expect(instructions).toContain("10,026 per profile");
		expect(instructions).toContain("analysis.md");
		expect(instructions).not.toContain("exits 78");
		expect(
			fixture.files[fixture.pack + "/starter/analysis.md"].content
		).toContain("TODO MEASURE");
		expect(
			fixture.files[fixture.pack + "/solution/analysis.md"].content
		).not.toContain("TODO");
	}
);
