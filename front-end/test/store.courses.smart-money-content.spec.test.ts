import { createHash } from "node:crypto";
import { createPinia, setActivePinia } from "pinia";
import MarkdownIt from "markdown-it";
import { expect, it } from "vitest";
import published from "../../test/fixtures/catalog-published-identities.json";
import restored from "../../test/fixtures/smart-money-restored-identities.json";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import {
	smartMoneyReadings,
	smartMoneyActivities
} from "@/stores/courses/smartMoneyReadings";
import { smartMoneyPersonalFinanceCourse as raw } from "@/stores/courses/source-library-courses";
const id = "smart-money-personal-finance";
function text(markdown: string) {
	const div = document.createElement("div");
	div.innerHTML = new MarkdownIt().render(markdown);
	return div.textContent!.replace(/\s+/gu, " ").trim();
}
it.each(["learner", "instructor"])(
	"supplies all nine finance lessons and intact core/optional assignments for %s",
	async role => {
		setActivePinia(createPinia());
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "finance-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: [id],
				editTutors: false,
				saveEdit: "Save"
			});
		const course = (await useCoursesStore().loadCourseById(id))!;
		expect(course.modules.filter(m => m.kind !== "appendix")).toHaveLength(
			9
		);
		const identities = course.modules.flatMap(module =>
			(
				[
					["core", module.curriculum],
					["optional", module.supplementalProjects]
				] as const
			).flatMap(([section, items]) =>
				items.map(item => ({
					moduleId: module.id,
					id: item.id,
					section
				}))
			)
		);
		expect(identities).toHaveLength(published[id].items + restored.length);
		for (const added of restored)
			expect(identities.filter(i => i.id === added.id)).toEqual([added]);
		const originalIdentities = identities.filter(
			i => !restored.some(added => added.id === i.id)
		);
		expect(
			createHash("sha256")
				.update(JSON.stringify(originalIdentities))
				.digest("hex")
		).toBe(published[id].sha256);
		let originals = 0;
		let activities = 0;
		for (const original of raw.modules) {
			const module = course.modules.find(
				m => m.title === original.title
			)!;
			const reading = module.curriculum.find(
				i => i.contentKind === "reading"
			)!;
			expect(reading).toBeDefined();
			expect(isLessonLearningItem(reading)).toBe(true);
			expect(text(reading.content)).toContain(
				text(smartMoneyReadings[original.title])
			);
			expect(reading.content).not.toContain(
				"Break a typical problem, passage"
			);
			for (const section of [
				"curriculum",
				"supplementalProjects"
			] as const) {
				for (const item of original[section].filter(i =>
					i.content.startsWith("**Project goal:**")
				)) {
					const current = module[section].find(
						i => i.title === item.title
					)!;
					expect(current, item.title).toBeDefined();
					expect(current.learningPath).toBe(item.learningPath);
					expect(isLessonLearningItem(current)).toBe(false);
					expect(text(current.content)).toContain(text(item.content).replace(/^Project goal:\s*/u, ""));
					originals++;
				}
			}
			for (const [prefix, kind] of [
				["Practice Map:", "practice"],
				["Extension Review:", "extension"]
			] as const) {
				const activity = module.supplementalProjects.find(i =>
					i.title.startsWith(prefix)
				)!;
				expect(activity, prefix + original.title).toBeDefined();
				expect(activity.contentKind).toBe("assignment");
				expect(isLessonLearningItem(activity)).toBe(false);
				expect(text(activity.content)).toBe(
					text(smartMoneyActivities[original.title][kind])
				);
				expect(activity.content).toContain("Check:");
				activities++;
			}
		}
		expect(originals).toBe(21);
		expect(activities).toBe(18);
		const all = course.modules.flatMap(m => [
			...m.curriculum,
			...m.supplementalProjects
		]);
		expect(all.filter(i => i.contentKind === "reading")).toHaveLength(9);
		expect(all.filter(i => i.ideImport)).toHaveLength(0);
	}
);
it("keeps model inputs,transfer conservation and stress results visible in their actual lessons", () => {
	expect(
		smartMoneyReadings["PF1 Building Wealth Through Personal Finance"]
	).toContain("3,000 − 1,700 − 300 − 275 − 600 = $125");
	expect(
		smartMoneyReadings[
			"PF4 How to Build Credit: Making Your Small Purchases Count"
		]
	).toContain("$261.62");
	expect(smartMoneyReadings["PF9 Smart Money Master Project"]).toContain(
		"−$9,218.37"
	);
	expect(
		smartMoneyActivities["PF9 Smart Money Master Project"].extension
	).toContain("$15,910");
	for (const value of Object.values(smartMoneyReadings)) {
		for (const url of value.matchAll(/https:\/\/([^/)\s]+)/gu)) {
			expect([
				"www.consumerfinance.gov",
				"www.investor.gov",
				"www.irs.gov",
				"www.fdic.gov"
			]).toContain(url[1]);
		}
	}
});
