import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import {
	networkCourseProjectKey,
	networkCourseResource,
	networkImportFiles
} from "@/modules/networkProjectResources";
import { useCoursesStore } from "@/stores/courses";
import { useAppStore } from "@/stores/app";

it("keeps five optional practice imports separate from core and reference attempts", async () => {
	setActivePinia(createPinia());
	useAppStore().setCurrentTutor({
		_id: "network-practice-tutor",
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
	const practice = course.modules.find(
		module => module.id === "network-systems-project-practice-guide"
	)!;
	expect(practice.supplementalProjects).toHaveLength(5);
	const keys = new Set<string>();
	for (const item of practice.supplementalProjects) {
		expect(item.contentKind).toBe("assignment");
		expect(item.learningPath).toBe("choice");
		expect(item.ideImport).toBe(true);
		expect(item.content).toContain("network-notes.md");
		expect(item.content).toContain("Complete source guide");
		const selected = networkCourseResource(item.projectLink!)!;
		expect(selected).not.toBeNull();
		expect(item.solutionLink).toContain(selected.definition.revision);
		for (const [role, url] of [
			["starter", item.projectLink!],
			["reference", item.solutionLink!]
		] as const) {
			const key = networkCourseProjectKey(course.id, item.id, role, url);
			expect(key).not.toBe(
				networkCourseProjectKey(
					course.id,
					selected.definition.coreItemId,
					role,
					url
				)
			);
			expect(keys.has(key)).toBe(false);
			keys.add(key);
			const imports = networkImportFiles(url)!;
			expect(imports).toHaveLength(
				selected.definition.roleFiles.length + 1
			);
			expect(imports.some(file => file.name === "README.md")).toBe(true);
			expect(
				imports.every(file =>
					file.file.rawUrl.includes(
						"/" + selected.definition.revision + "/"
					)
				)
			).toBe(true);
		}
	}
	expect(keys.size).toBe(10);
});

it("keeps every existing module and item reachable while classifying references", async () => {
	setActivePinia(createPinia());
	useAppStore().setCurrentTutor({
		_id: "network-practice-tutor",
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
	expect(course.modules).toHaveLength(21);
	expect(items).toHaveLength(135);
	expect(new Set(items.map(item => item.id)).size).toBe(135);
	const categories = items.find(
		item => item.title === "IPv6 Address Categories in Practice"
	)!;
	expect(categories.contentKind).toBe("reading");
	expect(categories.content).toContain("fe80::1%eth0");
	expect(categories.content).not.toContain("**Goal:**");
	for (const title of [
		"Bridged Links, Routed Paths and Translated Connections",
		"Address Families and IPv6 Diagnostic Paths",
		"Application Messages, Identity and Operational Boundaries",
		"Network Expansion and Integration Archive Guide",
		"BGP and Internet Routing at a High Level",
		"Wireless and Home-Network Variations",
		"Cloud Networking Patterns"
	]) {
		expect(
			items.find(item => item.title === title)?.contentKind,
			title
		).toBe("reading");
	}
	const references = course.modules.slice(-6);
	for (const module of references) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			expect(item.learningPath).toBe("choice");
			expect(item.content).not.toMatch(
				/Concept path:|Reference-supported work:|sanitizer|Unity\/Xcode/
			);
		}
	}
	const capstone = course.modules.find(module =>
		module.title.includes("Operations Capstone Studio")
	)!;
	const example = capstone.curriculum.find(item =>
		item.title.endsWith(": Guided Example")
	)!;
	expect(example.content).toContain("recorded-capstone-observations-v1.md");
	expect(example.content).toContain("remainingNamespaces");
	expect(example.content).toContain("empty");
	expect(example.content).toContain("owned-denial-control");
	expect(example.content).toContain("owned-operations-capstone");
});
