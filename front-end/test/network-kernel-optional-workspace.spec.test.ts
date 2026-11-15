import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { afterEach, expect, it, vi } from "vitest";
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
			"../test/fixtures/network-kernel-optional-contracts.json"
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
		expect(files).toHaveLength(5);
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
		expect(instructions).toContain("root access");
		expect(instructions).not.toContain("ordinary account");
		expect(instructions).toContain(fixture.instructionCommand);
		expect(instructions.includes("--exposure-policy")).toBe(
			fixture.mode.includes("exposure-")
		);
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
		expect(Object.keys(zip)).toHaveLength(5);
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
