import { describe, expect, it } from "vitest";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	javaLevel3ProjectKey,
	javaSearchImportFiles,
	javaSearchProjects,
	javaSearchURL
} from "@/modules/javaSearchResources";

describe("AJ5 native workspace", () => {
	it("preserves the main search key for the all-matches continuation", () => {
		const search = javaSearchProjects[0];
		const url = javaSearchURL(search.pack, "starter");
		const core = javaLevel3ProjectKey(
			"java-level-3",
			search.id,
			"starter",
			url
		);
		const continuation = javaLevel3ProjectKey(
			"java-level-3",
			"java-level-3-aj5-linear-search-and-big-o-notation-supplemental-extension-challenge-linear-search-and-big-o-notation",
			"starter",
			url
		);
		expect(continuation).toBe(core);
		expect(javaNativeBuildInstructions(core, url)).toContain(
			"javac --release 21 -Xlint:all -Werror Main.java ContractTests.java"
		);
		const reference = javaSearchURL(search.pack, "solution");
		expect(
			javaLevel3ProjectKey(
				"java-level-3",
				search.id,
				"reference",
				reference
			)
		).not.toBe(core);
	});

	it("uses the three files belonging to the exact source role and revision", () => {
		for (const project of javaSearchProjects) {
			for (const role of ["starter", "solution"] as const) {
				const url = javaSearchURL(project.pack, role);
				const files = javaSearchImportFiles(url);
				expect(files?.map(entry => entry.name)).toEqual([
					"Main.java",
					"ContractTests.java",
					"README.md"
				]);
				for (const entry of files ?? []) {
					expect(entry.file.path).toBe(
						`${project.pack}/${role}/${entry.name}`
					);
				}
				expect(
					javaSearchImportFiles(
						url.replace(/tree\/[^/]+/, "tree/main")
					)
				).toBeNull();
			}
		}
	});
});
