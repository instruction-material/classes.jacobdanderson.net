import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { linuxBuildInstructions } from "@/modules/linuxBuildInstructions";
import {
	linuxCourseProjectKey,
	linuxCourseResource,
	linuxVerifiedPacks
} from "@/modules/linuxProjectResources";
import { getCodeIdeProjectSubtitle } from "@/modules/codeIdeProjectLabels";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	isPythonIdeRunnableFile,
	isValidPythonFileName,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	normalizeImportedPythonIdeFileName,
	normalizePythonFileName,
	pythonIdeModeForCourseResource,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

type Pack = {
	pack: string;
	revision: string;
	files: Record<string, { content: string; sha256: string }>;
};
const fixtures = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/linux-owned-labs-contracts.json"
		),
		"utf8"
	)
) as Pack[];
const sourceRoot = `https://github.com/instruction-material/Linux-Systems/tree/${fixtures[0]!.revision}`;

afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

it("preserves core and notebook identities, complete reading, reference privacy and a shared attempt", async () => {
	setActivePinia(createPinia());
	useAppStore().setCurrentTutor({
		_id: "linux-tutor",
		name: "Tutor",
		email: "tutor@example.invalid",
		age: 30,
		state: "GA",
		usersOfTutorLength: 0,
		coursePermissions: ["linux-systems"],
		editTutors: false,
		saveEdit: "Save"
	});
	const course = (await useCoursesStore().loadCourseById("linux-systems"))!;
	const items = course.modules.flatMap(m => [
		...m.curriculum,
		...m.supplementalProjects
	]);
	const baseline = JSON.parse(readFileSync(resolve(process.cwd(), "../test/fixtures/linux-published-identities.json"), "utf8")) as {moduleId:string;id:string}[];
	expect(items.map(i => i.id).sort()).toEqual(baseline.map(i => i.id).sort());
	for (const definition of linuxVerifiedPacks) {
		const core = items.find(i => i.id === definition.coreItemId)!;
		const notebook = items.find(i => i.id === definition.notebookItemId)!;
		expect(core).toBeDefined();
		expect(notebook).toBeDefined();
		expect(core.ideImport).toBe(true);
		expect(notebook.ideImport).toBe(true);
		expect(core.content).toContain(
			fixtures
				.find(f => f.pack === definition.pack)!
				.files["README.md"]!.content.trim()
				.replace(/\bTODO\b/g, "`TODO`").replace("Instructor walkthrough", "Walkthrough")
		);
		expect(notebook.content).toContain("reopens the matching core project");
		for (const role of ["starter", "reference"] as const) {
			const link =
				role === "starter" ? core.projectLink! : core.solutionLink!;
			expect(link).toBe(
				`${sourceRoot}/${definition.pack}/${role === "starter" ? "starter" : "solution"}`
			);
			expect(
				linuxCourseProjectKey("linux-systems", notebook.id, role, link)
			).toBe(linuxCourseProjectKey("linux-systems", core.id, role, link));
		}
	}
	useAppStore().setCurrentTutor(null);
	const learner = (await useCoursesStore().loadCourseById("linux-systems"))!;
	expect(
		learner.modules
			.flatMap(m => [...m.curriculum, ...m.supplementalProjects])
			.every(i => !i.solutionLink)
	).toBe(true);
});

it.each(
	fixtures.flatMap(fixture =>
		["starter", "solution"].map(role => ({ fixture, role }))
	)
)(
	"imports and exports exact $fixture.pack/$role bytes and preserves existing attempts",
	async ({ fixture, role }) => {
		const prefix = `https://raw.githubusercontent.com/instruction-material/Linux-Systems/${fixture.revision}/${fixture.pack}/`;
		const requests: string[] = [];
		vi.stubGlobal(
			"fetch",
			vi.fn(async (url: string) => {
				const path = decodeURIComponent(
					String(url).slice(prefix.length)
				);
				requests.push(path);
				expect(String(url).startsWith(prefix)).toBe(true);
				const file = fixture.files[path];
				return new Response(file?.content ?? "missing", {
					status: file ? 200 : 404
				});
			})
		);
		const url = `${sourceRoot}/${fixture.pack}/${role}`;
		expect(pythonIdeModeForCourseResource("linux-systems", url)).toBe(
			"linux"
		);
		const files = await loadPythonIdeStarterFilesFromGitHub(url, "linux");
		const expected = Object.keys(fixture.files)
			.filter(p => p === "README.md" || p.startsWith(`${role}/`))
			.sort();
		expect(files.map(f => f.name).sort()).toEqual(expected);
		expect(requests.sort()).toEqual(expected);
		for (const file of files) {
			expect(isValidPythonFileName(file.name)).toBe(true);
			expect(
				createHash("sha256").update(file.content).digest("hex")
			).toBe(fixture.files[file.name]!.sha256);
			expect(isPythonIdeRunnableFile(file.name, "linux")).toBe(false);
		}
		const definition = linuxVerifiedPacks.find(
			p => p.pack === fixture.pack
		)!;
		const key = linuxCourseProjectKey(
			"linux-systems",
			definition.coreItemId,
			role === "starter" ? "starter" : "reference",
			url
		);
		const earlier = createPythonIdeProject("python", {
			courseProjectKey: key.replace(/:native-linux$/, "")
		});
		const project = createPythonIdeProject("linux", {
			files,
			courseID: "linux-systems",
			courseProjectKey: key,
			starterUrl: url
		});
		expect(project.activeFileName).toBe(
			`${role}/${definition.roleFiles[0]}`
		);
		expect(getCodeIdeProjectSubtitle(project)).toBe(
			`${role === "starter" ? "Learner" : "Reference"} · Linux`
		);
		saveLocalPythonProjects([earlier, project]);
		expect(loadLocalPythonProjects()).toEqual([earlier, project]);
		const archive = createProjectArchive(project);
		const entries = unzipSync(archive);
		for (const file of files)
			expect(strFromU8(entries[`${project.title}/${file.name}`]!)).toBe(
				file.content
			);
		const directory = resolve(
			process.cwd(),
			"../../linux-owned-labs-unit-exports"
		);
		mkdirSync(directory, { recursive: true });
		writeFileSync(
			resolve(directory, `${fixture.pack}-${role}.zip`),
			archive
		);
		expect(linuxBuildInstructions(files, url).join("\n")).toContain(
			"Read ../README.md"
		);
	}
);

it("retains literal Linux names and rejects unsafe paths and unverified imports", async () => {
	expect(
		normalizePythonFileName("starter/reports/app 1.log", ".sh", "linux")
	).toBe("starter/reports/app 1.log");
	expect(normalizeImportedPythonIdeFileName("app 1.log", "linux")).toBe(
		"app 1.log"
	);
	expect(normalizePythonFileName("app 1.py")).toBe("app_1.py");
	for (const name of [
		"../task.sh",
		"starter/../task.sh",
		"/task.sh",
		"starter//task.sh",
		"starter\\task.sh",
		"starter/reports/app\t1.log",
		"starter/notes.md",
		"images/task.sh",
		"pgzero.py",
		"starter/reports/app 1.py"
	]) {
		expect(isValidPythonFileName(name), name).toBe(false);
	}
	const unverified = `${sourceRoot}/LS-03-unit-1-shell-foundations-supplemental-2/starter`;
	expect(linuxCourseResource(unverified)).toBeNull();
	expect(
		pythonIdeModeForCourseResource("linux-systems", unverified)
	).toBeNull();
	await expect(
		loadPythonIdeStarterFilesFromGitHub(unverified, "linux")
	).rejects.toThrow("no verified site import");
	const project = createPythonIdeProject("linux");
	expect(project.files[0]!.name).toBe("main.sh");
	expect(project.files[0]!.content).toContain("#!/usr/bin/env bash");
	expect(() =>
		createProjectArchive({
			...project,
			files: [{ name: "starter/../task.sh", content: "" }]
		})
	).toThrow("unsafe");
});
