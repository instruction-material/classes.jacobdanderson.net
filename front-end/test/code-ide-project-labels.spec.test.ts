import type { PythonIdeProject } from "@/modules/pythonIde";
import { describe, expect, it } from "vitest";
import {
	getCodeIdeProjectAccessibleLabel,
	getCodeIdeProjectSubtitle
} from "@/modules/codeIdeProjectLabels";

const project: PythonIdeProject = {
	_id: "saved-attempt",
	title: "Same project name",
	mode: "java",
	files: [{ name: "Main.java", content: "// Preserved learner edit\n" }],
	activeFileName: "Main.java"
};

describe("saved project labels", () => {
	it.each([
		["c-systems-engineering:setup:starter:native-c17", "c", "Learner · C17"],
		["c-systems-engineering:setup:reference:native-c17", "c", "Reference · C17"],
		["cpp-level-2:grocery:starter", "cpp", "Learner · C++"],
		["cpp-level-2:grocery:reference", "cpp", "Reference · C++"],
		["usaco-silver:gifts:starter", "cpp", "Learner · C++"],
		["usaco-silver:gifts:reference", "cpp", "Reference · C++"],
		["usaco-silver:gifts:starter:native-java", "java", "Learner · Java"],
		[
			"usaco-silver:gifts:reference:native-java",
			"java",
			"Reference · Java"
		],
		["python-level-1:lesson-1:starter", "python", "Learner · Python"]
	] as const)(
		"labels the origin and language of %s",
		(key, mode, subtitle) => {
			const saved = { ...project, courseProjectKey: key, mode };
			const original = structuredClone(saved);
			expect(getCodeIdeProjectSubtitle(saved)).toBe(subtitle);
			expect(getCodeIdeProjectAccessibleLabel(saved)).toBe(
				`Same project name (${subtitle})`
			);
			expect(saved).toEqual(original);
		}
	);

	it.each([
		undefined,
		"",
		"ide-template:java:demo",
		"invented-course:lesson:reference",
		"usaco-silver::starter",
		"usaco-silver: :reference",
		"usaco-silver:two words:reference",
		"usaco-silver:lesson:solution",
		"usaco-silver:lesson:Reference",
		"usaco-silver:lesson:starter:unknown",
		"usaco-silver:lesson:starter:native-java:extra",
		"usaco-silver:lesson:starter:",
		"usaco-silver:starter"
	])("does not invent a role for unsupported key %s", courseProjectKey => {
		expect(
			getCodeIdeProjectSubtitle({
				...project,
				title: "Reference starter practice",
				starterLabel: "Reference",
				courseProjectKey
			})
		).toBe("Java");
	});

	it.each(["python-level-1", ""])(
		"does not invent a role when the stored course %s contradicts the key",
		courseID => {
			expect(
				getCodeIdeProjectSubtitle({
					...project,
					courseID,
					courseProjectKey: "usaco-silver:gifts:starter:native-java"
				})
			).toBe("Java");
		}
	);

	it("keeps native Java variants separate from a conflicting C++ mode", () => {
		expect(
			getCodeIdeProjectSubtitle({
				...project,
				mode: "cpp",
				courseProjectKey: "usaco-silver:gifts:reference:native-java"
			})
		).toBe("C++");
	});

	it("retains the project kind and fallback name for ordinary BlueJ projects", () => {
		const saved = { ...project, title: "", starterLabel: "BlueJ" };
		expect(getCodeIdeProjectSubtitle(saved)).toBe("BlueJ Java");
		expect(getCodeIdeProjectAccessibleLabel(saved)).toBe(
			"Untitled Project (BlueJ Java)"
		);
	});
});
