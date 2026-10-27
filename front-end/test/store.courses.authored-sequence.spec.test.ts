import { expect, it } from "vitest";
import { courseCatalog, loadRawCourse } from "@/stores/courses/index";

it("keeps authored teaching progression through catalog normalization", async () => {
	for (const entry of courseCatalog) {
		const authored = await entry.load();
		const normalized = (await loadRawCourse(entry.id))!;
		const before = authored.modules
			.filter(module => module.kind !== "appendix")
			.map(module => module.title);
		const after = normalized.modules
			.filter(module => module.kind !== "appendix")
			.map(module => module.title);
		const common = new Set(before.filter(title => after.includes(title)));
		const authoredCommon = before.filter(title => common.has(title));
		const displayedCommon = after.filter(title => common.has(title));
		if (entry.id === "data-structures-and-algorithms-in-cpp") {
			// This course deliberately teaches container contracts before the
			// priority-queue graph lab, independently of the original lab numbers.
			const containers =
				"DSCPP3 STL Containers and State-Based Text Generation";
			const graphs = "DSCPP2 Graphs and Shortest Paths";
			expect(displayedCommon, entry.id).toContain(containers);
			expect(displayedCommon.indexOf(graphs), entry.id).toBeGreaterThan(
				displayedCommon.indexOf(containers)
			);
		} else {
			expect(displayedCommon, entry.id).toEqual(authoredCommon);
		}
	}
}, 180000);
