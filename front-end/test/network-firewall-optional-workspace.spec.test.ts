import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { afterEach, expect, it, vi } from "vitest";
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
	taskFile: string;
	files: Record<string, { content: string }>;
	roleEdits: Record<string, { before: string; after: string }>;
};
const fixtures: Fixture[] = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/network-firewall-optional-contracts.json"
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
	"preserves the actual $fixture.pack/$role policy change through save, reopen and export",
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
		const project = createPythonIdeProject("linux", {
			files,
			starterUrl: source
		});
		const name = role + "/" + fixture.taskFile;
		const edited = project.files.find(file => file.name === name)!;
		expect(edited.content).toBe(fixture.roleEdits[role].before);
		edited.content = fixture.roleEdits[role].after;
		project.activeFileName = name;
		saveLocalPythonProjects([project]);
		const reopened = loadLocalPythonProjects()[0];
		expect(reopened).toEqual(project);
		const zip = unzipSync(createProjectArchive(reopened));
		expect(Object.keys(zip)).toHaveLength(6);
		for (const file of reopened.files) {
			const member = Object.keys(zip).find(path =>
				path.endsWith("/" + file.name)
			)!;
			expect(strFromU8(zip[member])).toBe(file.content);
			if (file.name !== name)
				expect(file.content).toBe(fixture.files[file.name].content);
		}
	}
);
