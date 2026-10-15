import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { flushPromises, mount } from "@vue/test-utils";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { api } from "@/api";
import CourseExplorer from "@/components/CourseExplorer.vue";
import { getCodeIdeProjectSubtitle } from "@/modules/codeIdeProjectLabels";
import { linuxBuildInstructions } from "@/modules/linuxBuildInstructions";
import {
	networkCourseProjectKey,
	networkCourseResource,
	networkPinnedCourseUrl,
	networkVerifiedPacks
} from "@/modules/networkProjectResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	isPythonIdeRunnableFile,
	isValidPythonFileName,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	pythonIdeModeForCourseResource,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

type Fixture = {
	pack: string;
	revision: string;
	files: Record<string, { content: string; sha256: string }>;
};
const fixtures: Fixture[] = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/network-foundations-contracts.json"
		),
		"utf8"
	)
);
const identities = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/network-published-identities.json"
		),
		"utf8"
	)
);
const base = "https://github.com/instruction-material/Network-Systems/tree/";

vi.mock("@/api", () => ({ api: { get: vi.fn(), put: vi.fn() } }));

afterEach(() => {
	vi.clearAllMocks();
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

it.each(
	networkVerifiedPacks.flatMap(definition =>
		["learner", "instructor"].map(role => ({ definition, role }))
	)
)(
	"opens the actual $definition.pack lesson and notebook with separate $role controls",
	async ({ definition, role }) => {
		const pinia = createPinia();
		setActivePinia(pinia);
		window.history.replaceState(
			{},
			"",
			`/courses#${definition.coreItemId.split("-curriculum-")[0]}`
		);
		const learner = {
			_id: "network-learner",
			name: "Learner",
			email: "learner@example.invalid",
			age: 14,
			state: "GA",
			courseAccess: ["network-systems"],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		};
		if (role === "learner") useAppStore().setCurrentUser(learner);
		else {
			vi.mocked(api.get).mockResolvedValue({ data: [learner] });
			useAppStore().setCurrentTutor({
				_id: "network-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 1,
				coursePermissions: ["network-systems"],
				editTutors: false,
				saveEdit: "Save"
			});
		}
		const wrapper = mount(CourseExplorer, { global: { plugins: [pinia] } });
		try {
			await flushPromises();
			await vi.waitFor(() =>
				expect(
					wrapper.findAll("a.is-ide-starter").length
				).toBeGreaterThan(0)
			);
			const core = wrapper
				.findAll(".lesson-item")
				.find(card =>
					card.attributes("id")?.endsWith(definition.coreItemId)
				)!;
			expect(core).toBeDefined();
			const links = core.findAll("a.is-ide-starter");
			expect(links).toHaveLength(role === "learner" ? 1 : 2);
			for (const [index, link] of links.entries()) {
				const params = new URL(
					link.attributes("href"),
					"https://classes.local"
				).searchParams;
				expect(params.get("mode")).toBe("linux");
				expect(params.get("starterUrl")).toBe(
					`${base}${definition.revision}/${definition.pack}/${index ? "solution" : "starter"}`
				);
				expect(params.get("projectKey")).toBe(
					`network-systems:${definition.coreItemId}:${index ? "reference" : "starter"}:native-network`
				);
			}
		} finally {
			wrapper.unmount();
			window.history.replaceState({}, "", "/courses");
		}
	}
);

it("preserves every published lesson while making two networking notebooks continue their core attempts", async () => {
	setActivePinia(createPinia());
	useAppStore().setCurrentTutor({
		_id: "network-tutor",
		name: "Tutor",
		email: "tutor@example.invalid",
		age: 30,
		state: "GA",
		usersOfTutorLength: 0,
		coursePermissions: ["network-systems"],
		editTutors: false,
		saveEdit: "Save"
	});
	const course = (await useCoursesStore().loadCourseById("network-systems"))!;
	const items = course.modules.flatMap(module => [
		...module.curriculum,
		...module.supplementalProjects
	]);
	expect(
		course.modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects].map(
				item => ({ moduleId: module.id, id: item.id })
			)
		)
	).toEqual(identities);
	for (const definition of networkVerifiedPacks) {
		const core = items.find(item => item.id === definition.coreItemId)!;
		const notebook = items.find(
			item => item.id === definition.notebookItemId
		)!;
		const source = fixtures.find(
			fixture => fixture.pack === definition.pack
		)!;
		const reading = source.files["README.md"].content
			.replace(
				/This replaces the unrelated port-list exercise previously (?:present )?in this folder\./,
				""
			)
			.replace("should retain", "retains")
			.replace(
				/agreed\s+instructor checkpoint/g,
				"agreed review checkpoint"
			)
			.replace(
				"Independent and instructor use",
				"Independent and guided use"
			)
			.trim();
		expect(core.content).toContain(reading);
		expect(core.learningPath).toBe("core");
		expect(notebook.learningPath).toBe("core");
		expect(core.ideImport).toBe(true);
		expect(notebook.ideImport).toBe(true);
		expect(notebook.projectLink).toBe(core.projectLink);
		expect(notebook.solutionLink).toBe(core.solutionLink);
		expect(notebook.content).toContain("reopens the matching core project");
		expect(notebook.content).toContain("Python programming is optional");
		expect(core.content).not.toMatch(/\bshould\b|port-list exercise/);
		for (const role of ["starter", "reference"] as const) {
			const url =
				role === "starter" ? core.projectLink! : core.solutionLink!;
			expect(
				networkCourseProjectKey(course.id, notebook.id, role, url)
			).toBe(networkCourseProjectKey(course.id, core.id, role, url));
		}
	}
});

it.each(
	fixtures.flatMap(fixture =>
		["starter", "solution"].map(role => ({ fixture, role }))
	)
)(
	"imports exact $fixture.pack/$role files, saves the notebook and exports the selected role",
	async ({ fixture, role }) => {
		const url = `${base}${fixture.revision}/${fixture.pack}/${role}`;
		const requests: string[] = [];
		vi.stubGlobal(
			"fetch",
			vi.fn(async (input: string | URL | Request) => {
				const requested = String(input);
				const prefix = `https://raw.githubusercontent.com/instruction-material/Network-Systems/${fixture.revision}/${fixture.pack}/`;
				expect(requested.startsWith(prefix)).toBe(true);
				const name = decodeURIComponent(requested.slice(prefix.length));
				requests.push(name);
				expect(
					name === "README.md" || name.startsWith(`${role}/`)
				).toBe(true);
				const file = fixture.files[name];
				expect(file).toBeDefined();
				return new Response(file.content, { status: 200 });
			})
		);
		expect(pythonIdeModeForCourseResource("network-systems", url)).toBe(
			"linux"
		);
		const files = await loadPythonIdeStarterFilesFromGitHub(url, "linux");
		const expected = [
			"README.md",
			`${role}/network-notes.md`,
			`${role}/main.py`,
			`${role}/network_lab.py`
		].sort();
		expect(files.map(file => file.name).sort()).toEqual(expected);
		expect(requests.sort()).toEqual(expected);
		for (const file of files) {
			expect(
				createHash("sha256").update(file.content).digest("hex")
			).toBe(fixture.files[file.name].sha256);
			expect(isValidPythonFileName(file.name, "linux")).toBe(true);
			expect(isPythonIdeRunnableFile(file.name, "linux")).toBe(false);
		}
		const definition = networkVerifiedPacks.find(
			pack => pack.pack === fixture.pack
		)!;
		const key = networkCourseProjectKey(
			"network-systems",
			definition.coreItemId,
			role === "starter" ? "starter" : "reference",
			url
		);
		const project = createPythonIdeProject("linux", {
			files,
			courseID: "network-systems",
			courseProjectKey: key,
			starterUrl: url
		});
		expect(project.activeFileName).toBe(`${role}/network-notes.md`);
		expect(getCodeIdeProjectSubtitle(project)).toBe(
			`${role === "starter" ? "Learner" : "Reference"} · Linux`
		);
		const instructions = linuxBuildInstructions(files, url).join("\n");
		expect(instructions).toContain(`cd ${role}`);
		expect(instructions).toContain("python3 main.py");
		expect(instructions).toContain("Python programming is optional");
		expect(instructions).not.toMatch(/bash main\.sh|Hello, Linux|Nginx/);
		expect(
			linuxBuildInstructions(
				files.filter(file => file.name !== `${role}/network_lab.py`),
				url
			).join("\n")
		).toContain("incomplete");
		const before = createPythonIdeProject("python", {
			title: "Earlier attempt",
			courseProjectKey: key.replace(":native-network", "")
		});
		saveLocalPythonProjects([before, project]);
		expect(loadLocalPythonProjects()).toEqual([before, project]);
		const exactArchive = unzipSync(createProjectArchive(project));
		expect(Object.keys(exactArchive).length).toBe(4);
		for (const file of files)
			expect(
				strFromU8(exactArchive[`${project.title}/${file.name}`])
			).toBe(file.content);
		project.files = project.files.map(file =>
			file.name === project.activeFileName
				? {
						...file,
						content: `${file.content}\nIndependent network observation\n`
					}
				: file
		);
		saveLocalPythonProjects([before, project]);
		const saved = loadLocalPythonProjects();
		expect(saved[0]).toEqual(before);
		expect(saved[1]).toEqual(project);
		const editedArchive = unzipSync(createProjectArchive(saved[1]));
		for (const file of project.files)
			expect(
				strFromU8(editedArchive[`${project.title}/${file.name}`])
			).toBe(file.content);
	}
);

it("rejects mutable revisions, unverified projects, other repositories and role descendants before fetching", async () => {
	const fetcher = vi.fn();
	vi.stubGlobal("fetch", fetcher);
	const definition = networkVerifiedPacks[0];
	const pinned = `${base}${definition.revision}/${definition.pack}/starter`;
	expect(
		networkPinnedCourseUrl(`${base}main/${definition.pack}/starter`)
	).toBe(pinned);
	for (const url of [
		`${base}main/${definition.pack}/starter`,
		`${base}${definition.revision}/NS-01-ns0-setup-and-tooling-supplemental-2/starter`,
		`${base}${definition.revision}/${definition.pack}/starter/main.py`,
		pinned.replace("Network-Systems", "Linux-Systems"),
		pinned.replace(definition.revision, "0".repeat(40))
	]) {
		expect(networkCourseResource(url)).toBeNull();
		expect(
			pythonIdeModeForCourseResource("network-systems", url)
		).toBeNull();
		await expect(
			loadPythonIdeStarterFilesFromGitHub(url, "linux")
		).rejects.toThrow(/no verified site import/);
	}
	expect(fetcher).not.toHaveBeenCalled();
});
