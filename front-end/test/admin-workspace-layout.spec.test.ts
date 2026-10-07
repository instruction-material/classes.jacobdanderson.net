import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readSource = (path: string) =>
	readFileSync(resolve(__dirname, path), "utf8");

describe("admin workspace mobile layout", () => {
	it("allows admin shell panels to shrink inside narrow viewports", () => {
		const source = readSource("../src/components/AdminWorkspaceShell.vue");

		expect(source).toContain("<WorkspaceHeader");
		expect(source).toContain("min-width: 0;");
		expect(source).toContain("max-width: 100%;");
		expect(source).toContain(".admin-shell__body");
		expect(readSource("../src/styles/main.css")).toContain(
			"box-sizing: border-box;"
		);
		expect(source).toContain(".admin-shell__nav-link");
	});

	it("keeps admin profile card grids and learner identity rows bounded", () => {
		const source = readSource("../src/components/AdminProfile.vue");

		expect(source).toContain(
			"grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));"
		);
		expect(source).toContain(
			"grid-template-columns: repeat(auto-fit, minmax(min(100%, 170px), 1fr));"
		);
		expect(source).toContain(".directory-card-name-row");
		expect(source).toContain("overflow-wrap: anywhere;");
		expect(source).toContain("@media (max-width: 380px)");
	});

	it("keeps embedded learner tool summaries from widening admin cards", () => {
		const sessionTools = readSource(
			"../src/components/LearnerSessionTools.vue"
		);
		const codeReviewTools = readSource(
			"../src/components/LearnerCodeReviewTools.vue"
		);

		for (const source of [sessionTools, codeReviewTools]) {
			expect(source).toContain(".tools-summary");
			expect(source).toContain("min-width: 0;");
			expect(source).toContain("overflow-wrap: anywhere;");
		}
	});

	it("opens session notes by default without a duplicate overview grid", () => {
		const source = readSource("../src/pages/admin/index.vue");

		expect(source).toContain('router.replace("/admin/mdmail")');
		expect(source).not.toContain("tool-grid");
	});
});
