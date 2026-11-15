import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { linuxBuildInstructions } from "@/modules/linuxBuildInstructions";
import { networkDnsOptionalPacks } from "@/modules/networkDnsOptionalResources";
import {
	networkCourseProjectKey,
	networkCourseResource,
	networkPinnedCourseUrl
} from "@/modules/networkProjectResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

type Fixture = {
	pack: string;
	revision: string;
	moduleId: string;
	coreItemId: string;
	learningPath: string;
	mode: string;
	files: Record<string, { content: string; sha256: string }>;
	caseEdits: Record<string, Record<string, string>>;
};
const fixtures: Fixture[] = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/network-dns-optional-contracts.json"
		),
		"utf8"
	)
);
afterEach(() => {
	clearLocalPythonProjects();
	vi.unstubAllGlobals();
});

it.each(["learner", "instructor"])(
	"preserves optional identities, complete guidance and independent attempts for %s",
	async role => {
		setActivePinia(createPinia());
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "dns-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: ["network-systems"],
				editTutors: false,
				saveEdit: "Save"
			});
		const course =
			(await useCoursesStore().loadCourseById("network-systems"))!;
		const module = course.modules.find(m => m.id === fixtures[0].moduleId)!;
		const keys = new Set<string>();
		for (const fixture of fixtures) {
			const item = module.supplementalProjects.find(
				i => i.id === fixture.coreItemId
			)!;
			expect(item.learningPath).toBe(fixture.learningPath);
			expect(item.content).toContain(
				fixture.files["README.md"].content.trim()
			);
			expect(item.ideImport).toBe(true);
			for (const sourceRole of (role === "instructor"
				? ["starter", "reference"]
				: ["starter"]) as ("starter" | "reference")[]) {
				const url =
					sourceRole === "starter"
						? item.projectLink!
						: item.solutionLink!;
				expect(networkCourseResource(url)?.definition.coreItemId).toBe(
					item.id
				);
				keys.add(
					networkCourseProjectKey(course.id, item.id, sourceRole, url)
				);
			}
		}
		expect(keys.size).toBe(role === "instructor" ? 4 : 2);
	}
);

it.each(
	fixtures.flatMap(fixture =>
		["starter", "solution"].map(role => ({ fixture, role }))
	)
)(
	"imports exact $fixture.pack/$role source and preserves case edits through reopen/export",
	async ({ fixture, role }) => {
		setActivePinia(createPinia());
		const url =
			"https://github.com/instruction-material/Network-Systems/tree/" +
			fixture.revision +
			"/" +
			fixture.pack +
			"/" +
			role;
		const prefix =
			"https://raw.githubusercontent.com/instruction-material/Network-Systems/" +
			fixture.revision +
			"/" +
			fixture.pack +
			"/";
		const requests: string[] = [];
		vi.stubGlobal(
			"fetch",
			vi.fn(async input => {
				const requested = String(input);
				expect(requested.startsWith(prefix)).toBe(true);
				const name = decodeURIComponent(requested.slice(prefix.length));
				expect(
					name === "README.md" || name.startsWith(role + "/")
				).toBe(true);
				requests.push(name);
				return new Response(fixture.files[name].content, {
					status: 200
				});
			})
		);
		const files = await loadPythonIdeStarterFilesFromGitHub(url, "linux");
		const expected = Object.keys(fixture.files)
			.filter(name => name === "README.md" || name.startsWith(role + "/"))
			.sort();
		expect(files.map(file => file.name).sort()).toEqual(expected);
		expect(requests.sort()).toEqual(expected);
		for (const file of files)
			expect(
				createHash("sha256").update(file.content).digest("hex")
			).toBe(fixture.files[file.name].sha256);
		const key = networkCourseProjectKey(
			"network-systems",
			fixture.coreItemId,
			role === "starter" ? "starter" : "reference",
			url
		);
		const earlier = createPythonIdeProject("python", {
			title: "Earlier DNS work",
			courseProjectKey: key.replace(":native-network", "")
		});
		const project = createPythonIdeProject("linux", {
			files,
			courseID: "network-systems",
			courseProjectKey: key,
			starterUrl: url
		});
		expect(project.activeFileName).toBe(role + "/network-notes.md");
		const commands = linuxBuildInstructions(project.files, url).join("\n");
		expect(commands).toContain("--port 1053 --phase live --output");
		expect(commands).toContain("Python programming is optional");
		expect(commands.includes("--phase stopped")).toBe(
			fixture.mode === "dns-transport"
		);
		const definition = networkDnsOptionalPacks.find(
			p => p.pack === fixture.pack
		)!;
		expect(
			linuxBuildInstructions(
				files.filter(
					file => file.name !== role + "/" + definition.roleFiles[1]
				),
				url
			).join("\n")
		).toContain("incomplete");
		project.activeFileName = role + "/case.json";
		project.files.find(
			file => file.name === project.activeFileName
		)!.content = JSON.stringify(fixture.caseEdits[role], null, 2) + "\n";
		saveLocalPythonProjects([earlier, project]);
		const saved = loadLocalPythonProjects();
		expect(saved[0]).toEqual(earlier);
		expect(saved[1]).toEqual(project);
		const zip = unzipSync(createProjectArchive(saved[1]));
		expect(Object.keys(zip)).toHaveLength(5);
		for (const file of saved[1].files) {
			const member = Object.keys(zip).find(name =>
				name.endsWith("/" + file.name)
			)!;
			expect(strFromU8(zip[member])).toBe(file.content);
		}
		expect(
			JSON.parse(
				saved[1].files.find(file => file.name === role + "/case.json")!
					.content
			)
		).toEqual(fixture.caseEdits[role]);
	}
);

it("pins only the two declared role roots and rejects unregistered descendants", () => {
	for (const pack of networkDnsOptionalPacks) {
		const base =
			"https://github.com/instruction-material/Network-Systems/tree/";
		expect(
			networkPinnedCourseUrl(base + "main/" + pack.pack + "/starter")
		).toBe(base + pack.revision + "/" + pack.pack + "/starter");
		expect(
			networkCourseResource(
				base + pack.revision + "/" + pack.pack + "/starter/dns_probe.py"
			)
		).toBeNull();
		expect(
			networkCourseResource(
				base + pack.revision + "/" + pack.pack + "/other"
			)
		).toBeNull();
	}
});
