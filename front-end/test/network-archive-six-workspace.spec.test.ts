import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { afterEach, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCoursesStore } from "@/stores/courses";
import { networkArchiveSixPacks } from "@/modules/networkArchiveSixResources";
import {
	networkCourseResource,
	networkVerifiedPacks
} from "@/modules/networkProjectResources";
import { isLinuxProjectTextPath as backendLinuxTextPath } from "../../back-end/src/utils/linuxProjectFiles";
import { isLinuxProjectTextPath as frontendLinuxTextPath } from "@/modules/linuxProjectFiles";
import { isValidPythonFileName } from "@/modules/pythonIde";
import { linuxBuildInstructions } from "@/modules/linuxBuildInstructions";
import { networkCourseProjectKey } from "@/modules/networkProjectResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	saveLocalPythonProjects
} from "@/modules/pythonIde";

type Fixture = {
	pack: string;
	revision: string;
	coreItemId: string;
	instructionCommand: string;
	taskFile: string;
	mode: string;
	files: Record<string, { content: string; sha256: string }>;
	roleEdits: Record<string, string>;
};
const fixtures: Fixture[] = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/network-archive-six-contracts.json"
		),
		"utf8"
	)
);
afterEach(() => {
	clearLocalPythonProjects();
	vi.unstubAllGlobals();
});

it.each(
	fixtures.flatMap(fixture =>
		["starter", "solution"].map(role => ({ fixture, role }))
	)
)(
	"keeps the actual $fixture.pack/$role task edit through save, reopen and export",
	async ({ fixture, role }) => {
		const prefix =
			"https://raw.githubusercontent.com/instruction-material/Network-Systems/" +
			fixture.revision +
			"/" +
			fixture.pack +
			"/";
		vi.stubGlobal(
			"fetch",
			vi.fn(async input => {
				const url = String(input);
				expect(url.startsWith(prefix)).toBe(true);
				const name = decodeURIComponent(url.slice(prefix.length));
				expect(
					name === "README.md" || name.startsWith(role + "/")
				).toBe(true);
				return new Response(fixture.files[name].content);
			})
		);
		const source =
			"https://github.com/instruction-material/Network-Systems/tree/" +
			fixture.revision +
			"/" +
			fixture.pack +
			"/" +
			role;
		const files = await loadPythonIdeStarterFilesFromGitHub(
			source,
			"linux"
		);
		expect(files).toHaveLength(8);
		for (const file of files)
			expect(
				createHash("sha256").update(file.content).digest("hex")
			).toBe(fixture.files[file.name].sha256);
		const key = networkCourseProjectKey(
			"network-systems",
			fixture.coreItemId,
			role === "starter" ? "starter" : "reference",
			source
		);
		const project = createPythonIdeProject("linux", {
			files,
			courseProjectKey: key,
			starterUrl: source
		});
		const instructions = linuxBuildInstructions(files, source).join("\n");
		expect(instructions).toContain("ordinary account");
		expect(instructions).not.toContain("sudo");
		expect(instructions).toContain(fixture.instructionCommand);
		expect(instructions).toContain("recorded network observations");
		const name = role + "/" + fixture.taskFile;
		project.files.find(file => file.name === name)!.content =
			fixture.roleEdits[role];
		project.activeFileName = name;
		const earlier = createPythonIdeProject("python", {
			title: "Earlier network attempt",
			courseProjectKey: key.replace(":native-network", "")
		});
		saveLocalPythonProjects([earlier, project]);
		const reopened = loadLocalPythonProjects();
		expect(reopened[0]).toEqual(earlier);
		expect(reopened[1]).toEqual(project);
		const zip = unzipSync(createProjectArchive(reopened[1]));
		expect(Object.keys(zip)).toHaveLength(8);
		for (const file of reopened[1].files) {
			const member = Object.keys(zip).find(path =>
				path.endsWith("/" + file.name)
			)!;
			expect(strFromU8(zip[member])).toBe(file.content);
			if (file.name !== name)
				expect(file.content).toBe(fixture.files[file.name].content);
		}
	}
);

it("connects all six optional archive purposes without changing their task identities", async () => {
	setActivePinia(createPinia());
	const course = await useCoursesStore().loadCourseById("network-systems");
	expect(course).toBeDefined();
	expect(networkVerifiedPacks).toHaveLength(50);
	const items = course!.modules.flatMap(module => [
		...module.curriculum,
		...module.supplementalProjects
	]);
	for (const definition of networkArchiveSixPacks) {
		const item = items.find(item => item.id === definition.coreItemId);
		expect(item, definition.pack).toBeDefined();
		expect(["choice", "challenge"]).toContain(item!.learningPath);
		expect(item!.content).toContain("## Prepare and run");
		expect(item!.content).toContain("assessment.json");
		expect(item!.content).toContain("## Finish and review");
		expect(networkCourseResource(item!.projectLink!)?.pack).toBe(
			definition.pack
		);
	}
});

it("keeps the three archive filenames within both native path policies", () => {
	for (const role of ["starter", "solution"]) {
		for (const name of [
			"assessment.json",
			"observations.json",
			"SOURCES.md"
		]) {
			const path = role + "/" + name;
			expect(frontendLinuxTextPath(path)).toBe(true);
			expect(backendLinuxTextPath(path)).toBe(true);
			expect(isValidPythonFileName(path, "linux")).toBe(true);
		}
	}
	for (const path of [
		"starter/../assessment.json",
		"solution/private/observations.json",
		"starter/SOURCES.md/secret",
		"../assessment.json",
		"starter/credentials.json"
	]) {
		expect(frontendLinuxTextPath(path)).toBe(false);
		expect(backendLinuxTextPath(path)).toBe(false);
		expect(isValidPythonFileName(path, "linux")).toBe(false);
	}
});
