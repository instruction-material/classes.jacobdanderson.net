import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it } from "vitest";
import { networkCourseProjectKey } from "@/modules/networkProjectResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	isValidPythonFileName,
	loadLocalPythonProjects,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useCoursesStore } from "@/stores/courses";
import { useAppStore } from "@/stores/app";

const fixture = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/network-capstone-contracts.json"
		),
		"utf8"
	)
)[0];
afterEach(() => clearLocalPythonProjects());

it("keeps the required capstone, paced continuation and optional challenge distinct", async () => {
	setActivePinia(createPinia());
	useAppStore().setCurrentTutor({
		_id: "network-capstone-tutor",
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
	const module = course.modules.find(item => item.id === fixture.moduleId)!;
	const core = module.curriculum.find(
		item => item.id === fixture.coreItemId
	)!;
	const continuation = module.curriculum.find(
		item => item.id === fixture.notebookItemId
	)!;
	const concept = module.curriculum.find(item =>
		item.title.endsWith("Core Concepts")
	)!;
	expect(core.content).toContain(fixture.files["README.md"].content);
	expect(concept.contentKind).toBe("reading");
	expect(concept.content).toContain("198.18.99.0/30");
	expect(concept.content).toContain("9001");
	expect(concept.content).toContain("recorded-capstone-observations-v1.md");
	expect(continuation.content).toContain("route-corrected");
	expect(continuation.content).toContain("502");
	expect(module.estimatedTime).toContain("8–12");
	expect(module.estimatedTime).toContain("45–60");
	for (const role of ["starter", "reference"] as const) {
		const url = role === "starter" ? core.projectLink! : core.solutionLink!;
		const key = networkCourseProjectKey(course.id, core.id, role, url);
		expect(
			networkCourseProjectKey(course.id, continuation.id, role, url)
		).toBe(key);
		for (const optional of module.supplementalProjects) {
			expect(optional.learningPath).not.toBe("core");
			expect(
				networkCourseProjectKey(course.id, optional.id, role, url)
			).not.toBe(key);
		}
	}
});

it.each(["starter", "solution"])(
	"preserves edited %s JSON and observations through save, reopen and export",
	role => {
		const files = Object.entries(
			fixture.files as Record<string, { content: string }>
		)
			.filter(
				([name]) => name === "README.md" || name.startsWith(role + "/")
			)
			.map(([name, file]) => ({ name, content: file.content }));
		const project = createPythonIdeProject("linux", {
			files,
			starterUrl:
				"https://github.com/instruction-material/Network-Systems/tree/" +
				fixture.revision +
				"/" +
				fixture.pack +
				"/" +
				role
		});
		project.activeFileName = role + "/case.json";
		const changed = {
			ipv4_service_route: "198.18.32.0/30",
			proxy_upstream_port: 9000
		};
		project.files.find(file => file.name === role + "/case.json")!.content =
			JSON.stringify(changed, null, 2) + "\n";
		project.files.find(
			file => file.name === role + "/network-notes.md"
		)!.content +=
			"\nRoute-only retest retained the independent upstream failure.\n";
		saveLocalPythonProjects([project]);
		const [saved] = loadLocalPythonProjects();
		expect(saved).toEqual(project);
		expect(saved.activeFileName).toBe(role + "/case.json");
		const archive = unzipSync(createProjectArchive(saved));
		expect(Object.keys(archive)).toHaveLength(6);
		const key = Object.keys(archive).find(name =>
			name.endsWith("/" + role + "/case.json")
		)!;
		expect(JSON.parse(strFromU8(archive[key]))).toEqual(changed);
		for (const file of project.files) {
			const member = Object.keys(archive).find(name =>
				name.endsWith("/" + file.name)
			)!;
			expect(strFromU8(archive[member])).toBe(file.content);
		}
	}
);

it("accepts the exact case filename while retaining native path restrictions", () => {
	for (const role of ["starter", "solution"])
		expect(isValidPythonFileName(role + "/case.json", "linux")).toBe(true);
	for (const path of [
		"other/case.json",
		"starter/nested/case.json",
		"starter/../case.json",
		"/starter/case.json",
		"starter/random.json",
		"starter/.env"
	])
		expect(isValidPythonFileName(path, "linux"), path).toBe(false);
});
