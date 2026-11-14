import { describe, expect, it } from "vitest";
import { smartMoneyPersonalFinanceCourse } from "@/stores/courses/source-library-courses";

const EXPECTED_MODULE_SEQUENCE = [
	"PF1 Building Wealth Through Personal Finance",
	"PF2 How to Grow My Income",
	"PF3 How to Manage My Spending",
	"PF4 How to Build Credit: Making Your Small Purchases Count",
	"PF5 How to Make Smart Purchase Decisions",
	"PF6 How To Find Your Perfect Bank",
	"PF7 How to Plan for and Invest in Your Future",
	"PF8 Making Your Money Count",
	"PF9 Smart Money Master Project"
];

function requireModule(title: string) {
	const module = smartMoneyPersonalFinanceCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Smart Money module ${title}.`);
	return module;
}

describe("Smart Money personal-finance learner flow", () => {
	it("keeps one fictional profile from baseline budget through capstone", () => {
		expect(
			smartMoneyPersonalFinanceCourse.modules.map(module => module.title)
		).toEqual(EXPECTED_MODULE_SEQUENCE);
		expect(
			requireModule("PF1 Building Wealth Through Personal Finance")
				.curriculum[0]?.content
		).toContain("one fictional Graduate Profile");
		expect(
			requireModule("PF9 Smart Money Master Project").curriculum[0]
				?.content
		).toContain("Reconcile the fictional profile");
	});

	it("gives every module pacing, decision targets, and explicit paths", () => {
		for (const module of smartMoneyPersonalFinanceCourse.modules) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(5);
			expect(
				module.curriculum.every(item => item.learningPath === "core"),
				module.title
			).toBe(true);
			expect(
				module.supplementalProjects.every(item =>
					["choice", "challenge"].includes(item.learningPath ?? "")
				),
				module.title
			).toBe(true);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Course flow:**"
			);
		}
	});

	it("keeps the core plan manageable while preserving original choices", () => {
		const requiredCount = smartMoneyPersonalFinanceCourse.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = smartMoneyPersonalFinanceCourse.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);
		const choiceTitles = smartMoneyPersonalFinanceCourse.modules.flatMap(
			module =>
				module.supplementalProjects
					.filter(item => item.learningPath === "choice")
					.map(item => item.title)
		);

		expect(requiredCount).toBe(24);
		expect(optionCount).toBe(24);
		for (const optionalCase of [
			"Spend Like Bill Gates Constraint Ladder",
			"Wealth-Building Research and Financial Perspectives",
			"Salary Negotiation Case",
			"Car Loan and Housing What-If",
			"Vehicle Purchase Decision",
			"Cause-Aligned Business or Awareness Project"
		]) {
			expect(choiceTitles).toContain(optionalCase);
		}
	});

	it("protects privacy and separates instruction from real financial action", () => {
		expect(
			requireModule("PF1 Building Wealth Through Personal Finance")
				.curriculum[0]?.content
		).toContain("personal balances, credentials, and real account access");
		expect(
			requireModule(
				"PF4 How to Build Credit: Making Your Small Purchases Count"
			).curriculum[0]?.content
		).toContain("no real credit application");
		expect(
			requireModule("PF6 How To Find Your Perfect Bank").curriculum[0]
				?.content
		).toContain("Opening a real account is not part of the course");
		expect(
			requireModule("PF9 Smart Money Master Project").curriculum[0]
				?.content
		).toContain("no public sharing or real financial action is required");
	});

	it("requires current facts and works without unavailable images", () => {
		const text = smartMoneyPersonalFinanceCourse.modules
			.flatMap(module => [
				module.title,
				...module.curriculum.map(item => item.content),
				...module.supplementalProjects.map(item => item.content)
			])
			.join("\n");

		expect(
			requireModule("PF7 How to Plan for and Invest in Your Future")
				.curriculum[0]?.content
		).toContain("current authoritative sources");
		expect(
			requireModule("PF3 How to Manage My Spending").curriculum[0]
				?.content
		).toContain("text table and the supplied calculations");
		expect(
			smartMoneyPersonalFinanceCourse.modules.some(
				module => module.title === "Pending Static Assets"
			)
		).toBe(false);
		for (const filename of [
			"ent3_project2_0.png",
			"ent3_project2_1.png",
			"pf5_concept1_1.png",
			"pf5_concept1_2.png",
			"pf5_concept1_3.png",
			"pf5_concept1_4.png",
			"pf5_concept1_5.png",
			"pf5_concept1_6.png"
		]) {
			expect(text).not.toContain(filename);
		}
	});
});
