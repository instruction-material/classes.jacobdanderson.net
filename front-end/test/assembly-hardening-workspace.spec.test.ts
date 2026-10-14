import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { assemblyBuildInstructions } from "@/modules/assemblyBuildInstructions";
import {
	assemblyCourseProjectKey,
	assemblyCourseResource,
	assemblyHardeningPack,
	assemblyHardeningTracePack
} from "@/modules/assemblyProjectResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	isValidPythonFileName,
	pythonIdeModeForCourseResource,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/assembly-hardening-contracts.json"
		),
		"utf8"
	)
) as {
	pack: string;
	revision: string;
	files: Record<string, { content: string; sha256: string }>;
};
const root =
	"https://github.com/instruction-material/Assembly/tree/" + fixture.revision;
const assignments = [
	{
		pack: assemblyHardeningPack,
		worksheet: "analysis.md",
		id: "assembly-unit-12-security-and-reliability-visibility-supplemental-reliability-visibility-transfer-practice"
	},
	{
		pack: assemblyHardeningTracePack,
		worksheet: "trace.md",
		id: "assembly-unit-12-security-and-reliability-visibility-supplemental-reliability-visibility-extension-practice"
	}
] as const;

afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

it("preserves two optional identities and the reverse-engineering core with complete distinct investigations", async () => {
	setActivePinia(createPinia());
	const app = useAppStore();
	app.setCurrentTutor({
		_id: "hardening-tutor",
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
	expect(course.modules.flatMap(m => m.curriculum)).toHaveLength(49);
	const module = course.modules.find(m =>
		m.title.includes("Security and Reliability Visibility")
	)!;
	expect(
		module.curriculum.some(i =>
			i.title.includes("Reverse-Engineer a Toy Program")
		)
	).toBe(true);
	const items = assignments.map(a =>
		module.supplementalProjects.find(i => i.id === a.id)!
	);
	for (const [index, assignment] of assignments.entries()) {
		expect(items[index].ideImport).toBe(true);
		expect(items[index].projectLink).toBe(
			root + "/" + assignment.pack + "/starter"
		);
		expect(items[index].solutionLink).toBe(
			root + "/" + assignment.pack + "/solution"
		);
		expect(items[index].content).toContain(assignment.worksheet);
		expect(items[index].content).toContain("-DLAB_PROFILE=baseline");
		expect(items[index].content).toContain("show disable-randomization");
	}
	expect(items[0].content).toContain(
		fixture.files[fixture.pack + "/README.md"].content
			.split("\n")
			.slice(1)
			.join("\n")
			.replace(
				"predict which evidence should change",
				"predict the changes in the observed evidence"
			)
			.replace(
				"All builds should pass the same",
				"All builds must pass the same"
			)
			.trim()
	);
	expect(items[1].content).toContain("separate saved attempt");
	expect(items[0].content).not.toBe(items[1].content);
	app.setCurrentTutor(null);
	const learner = (await useCoursesStore().loadCourseById("assembly"))!;
	for (const assignment of assignments) {
		const item = learner.modules
			.flatMap(m => m.supplementalProjects)
			.find(i => i.id === assignment.id)!;
		expect(item.solutionLink).toBeUndefined();
		expect(item.projectLink).toBe(
			root + "/" + assignment.pack + "/starter"
		);
	}
});

it.each(
	assignments.flatMap(assignment =>
		["starter", "solution"].map(role => ({ ...assignment, role }))
	)
)(
	"imports exact role bytes for $pack/$role and opens $worksheet with a distinct retained attempt",
	async assignment => {
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
		const url = root + "/" + assignment.pack + "/" + assignment.role;
		expect(pythonIdeModeForCourseResource("assembly", url)).toBe(
			"assembly"
		);
		const files = await loadPythonIdeStarterFilesFromGitHub(
			url,
			"assembly"
		);
		expect(files).toHaveLength(10);
		expect(requests).toHaveLength(10);
		expect(requests.every(u => u.includes("/" + fixture.pack + "/"))).toBe(
			true
		);
		expect(
			requests.some(u =>
				u.includes(
					assignment.role === "starter" ? "/solution/" : "/starter/"
				)
			)
		).toBe(false);
		const key = assemblyCourseProjectKey(
			"assembly",
			assignment.id,
			assignment.role === "starter" ? "starter" : "reference",
			url
		);
		const old = createPythonIdeProject("python", {
			courseProjectKey: key.replace(/:native-assembly$/, "")
		});
		const project = createPythonIdeProject("assembly", {
			files,
			starterUrl: url,
			courseProjectKey: key
		});
		expect(project.activeFileName).toBe(
			assignment.role + "/" + assignment.worksheet
		);
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
					assignment.pack + "-" + assignment.role + ".zip"
				),
				archive
			);
		}
		const entries = unzipSync(archive);
		expect(Object.keys(entries)).toHaveLength(10);
		for (const file of files) {
			const expected = fixture.files[fixture.pack + "/" + file.name];
			const exported = entries[saved.title + "/" + file.name];
			expect(strFromU8(exported)).toBe(expected.content);
			expect(createHash("sha256").update(exported).digest("hex")).toBe(
				expected.sha256
			);
		}
		const instructions = assemblyBuildInstructions(files, url).join("\n");
		expect(instructions).toContain("working baseline");
		expect(instructions).toContain("-DLAB_PROFILE=baseline");
		expect(instructions).toContain("-DLAB_PROFILE=guard-pie");
		expect(instructions).toContain(
			"./build-guard-pie/assembly_hardening ABC"
		);
		expect(instructions).toContain("Complete " + assignment.worksheet);
		expect(instructions).not.toContain("exits 78");
	}
);

it("accepts the companion only at its verified immutable revision and keeps its attempt separate", () => {
	expect(isValidPythonFileName("starter/trace.md")).toBe(true);
	expect(isValidPythonFileName("solution/trace.md")).toBe(true);
	for (const path of [
		"starter/notes.md",
		"starter/nested/trace.md",
		"../trace.md",
		"images/trace.md"
	]) {
		expect(isValidPythonFileName(path)).toBe(false);
	}
	const trace = root + "/" + assemblyHardeningTracePack + "/starter";
	expect(assemblyCourseResource(trace)?.pack).toBe(
		assemblyHardeningTracePack
	);
	expect(
		assemblyCourseResource(trace.replace(fixture.revision, "main"))
	).toBeNull();
	expect(assemblyCourseResource(trace + "/trace.md")).toBeNull();
	const keys = assignments.map(a =>
		assemblyCourseProjectKey(
			"assembly",
			a.id,
			"starter",
			root + "/" + a.pack + "/starter"
		)
	);
	expect(new Set(keys).size).toBe(2);
});
