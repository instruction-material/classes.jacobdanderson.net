import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { introToChemistryCourse } from "@/stores/courses/intro-to-chemistry";

const EXPECTED_CORE_SEQUENCE = [
	"CHM1 Workflow, Safety, Measurement, and Models",
	"CHM2 Matter, Classification, and Particle Models",
	"CHM3 Atomic Structure, Isotopes, and Ions",
	"CHM4 Periodic Table and Trends",
	"CHM5 Bonding, Formulas, and Molecular Structure",
	"CHM6 Energy, Phase Change, and Intermolecular Forces",
	"CHM7 Chemical Reactions and Conservation",
	"CHM8 Solutions, Concentration, and pH",
	"CHM9 Moles and Stoichiometry",
	"CHM10 Advanced Chemistry Map",
	"CHM11 Capstone: Real-World Chemistry Explanation"
];

function requireModule(title: string) {
	const module = introToChemistryCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) {
		throw new Error(`Expected Intro to Chemistry module ${title}.`);
	}
	return module;
}

function moduleText(title: string) {
	const module = requireModule(title);
	return [...module.curriculum, ...module.supplementalProjects]
		.map(item => `${item.title}\n${item.content}`)
		.join("\n");
}

function courseText() {
	return introToChemistryCourse.modules
		.map(module => `${module.title}\n${moduleText(module.title)}`)
		.join("\n");
}

function resourceText() {
	return introToChemistryCourse.modules
		.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		])
		.flatMap(item => [
			item.projectLink,
			item.solutionLink,
			item.datasetLink,
			item.mediaLink,
			...[
				...item.content.matchAll(/\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/g)
			].map(match => match[1])
		])
		.filter(Boolean)
		.join("\n");
}

describe("Intro to Chemistry learner flow", () => {
	it("uses an eleven-stage chemistry spine followed by one resource appendix", () => {
		expect(
			introToChemistryCourse.modules
				.slice(0, 11)
				.map(module => module.title)
		).toEqual(EXPECTED_CORE_SEQUENCE);
		expect(introToChemistryCourse.modules).toHaveLength(12);
		expect(introToChemistryCourse.modules.at(-1)).toMatchObject({
			kind: "appendix",
			title: "Reference Appendix: Chemistry Resource Bank"
		});
	});

	it("gives every core stage pacing, milestones, and explicit paths", () => {
		for (const module of introToChemistryCourse.modules.slice(0, 11)) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(6);
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

	it("preserves all original authored lessons, projects, and references", () => {
		const curriculumTitles = introToChemistryCourse.modules.flatMap(
			module => module.curriculum.map(item => item.title)
		);
		const optionTitles = introToChemistryCourse.modules.flatMap(module =>
			module.supplementalProjects.map(item => item.title)
		);

		expect(curriculumTitles).toHaveLength(76);
		expect(optionTitles).toHaveLength(37);
		for (const title of [
			"Course Overview and Learning Workflow",
			"Periodic Table Reference Set and Symbol Reading",
			"Bond Energies and Reaction Estimates",
			"Checkpoint: Quantitative Chemistry Reasoning",
			"Chemistry Explanation Rubric"
		]) {
			expect(curriculumTitles, title).toContain(title);
		}
		for (const title of [
			"Project: Making Oobleck Case Analysis",
			"Project: Mystery Element Cards and Symbol Codes",
			"Project: Elephant Toothpaste Case Analysis",
			"Project: Solution Simulation",
			"Project: Stoichiometry Error Analysis",
			"Project: Chemistry in Your World Showcase"
		]) {
			expect(optionTitles, title).toContain(title);
		}
	});

	it("places formal molarity after mole and molar-mass foundations", () => {
		const solutions = requireModule(
			"CHM8 Solutions, Concentration, and pH"
		);
		const quantitative = requireModule("CHM9 Moles and Stoichiometry");
		const quantitativeTitles = quantitative.curriculum.map(
			item => item.title
		);

		expect(solutions.curriculum.map(item => item.title)).not.toContain(
			"Molarity as a Quantitative Concentration"
		);
		expect(
			quantitativeTitles.indexOf(
				"Molarity as a Quantitative Concentration"
			)
		).toBeGreaterThan(
			quantitativeTitles.indexOf("Molar Mass and Unit Conversion")
		);
		expect(
			quantitativeTitles.indexOf(
				"Molarity as a Quantitative Concentration"
			)
		).toBeLessThan(
			quantitativeTitles.indexOf("Mole Ratios from Balanced Equations")
		);
		expect(moduleText("CHM8 Solutions, Concentration, and pH")).toContain(
			"Formal molarity moves to CHM9"
		);
	});

	it("makes representations, accessibility, and laboratory scope explicit", () => {
		const setup = moduleText(
			"CHM1 Workflow, Safety, Measurement, and Models"
		);

		expect(setup).toContain("macroscopic observation");
		expect(setup).toContain("submicroscopic particle or system model");
		expect(setup).toContain("symbolic representation");
		expect(setup).toContain("Color is never the only carrier");
		expect(setup).toContain("equivalent nonvisual dataset or description");
		expect(setup).toContain(
			"This course does not certify hands-on competence"
		);
		expect(setup).toContain(
			"recognize hazards, assess risks, minimize risks, and prepare"
		);
		expect(resourceText()).toContain(
			"acs.org/education/policies/middle-and-high-school-chemistry/teaching-and-assessment/lab-experience"
		);
	});

	it("addresses the highest-impact chemistry model misconceptions", () => {
		const text = courseText();

		for (const statement of [
			"Uniform appearance can support a homogeneous-mixture claim, but it cannot prove purity",
			"Particles do not expand when a sample expands",
			"Changing neutron count creates an isotope",
			"Changing electron count creates an ion",
			"tendencies across selected comparisons, not exception-free laws",
			"An ionic formula gives the lowest whole-number ratio in an extended lattice",
			"Breaking a bond requires energy and forming a bond releases energy",
			"changing a subscript invents a different substance",
			"Dilution adds solvent but does not remove solute",
			"pH alone does not determine whether a material is safe"
		]) {
			expect(text, statement).toContain(statement);
		}
	});

	it("makes quantitative work unit-driven and bounded by reasonableness", () => {
		const reactions = moduleText(
			"CHM7 Chemical Reactions and Conservation"
		);
		const quantitative = moduleText("CHM9 Moles and Stoichiometry");

		expect(reactions).toContain(
			"uses whole-number particle or recipe batches"
		);
		expect(reactions).toContain(
			"Mole, molar-mass, molarity, and measured-mass calculations wait for CHM9"
		);
		expect(quantitative).toContain("particles ↔ moles");
		expect(quantitative).toContain("grams ↔ moles");
		expect(quantitative).toContain("solution volume ↔ moles");
		expect(quantitative).toContain("unwanted units cancel");
		expect(quantitative).toContain("round once at the end");
		expect(quantitative).toContain(
			"formula mass, equation balance, reciprocal ratio"
		);
	});

	it("matches the ice-vapor phase point to the IAPWS reference correlation", () => {
		const materials = fs.readFileSync(
			"public/course-assets/chemistry/chemistry-materials-pack.md",
			"utf8"
		);
		const phase = materials
			.split("## Phase Diagram Data\n")[1]
			?.split("\n## ")[0];
		expect(phase).toBeTypeOf("string");
		const point = phase!.match(
			/^\| F\s*\|\s*(-?[\d.]+)\s*\|\s*([\d.]+)\s*\|/m
		);
		expect(point).not.toBeNull();
		// IAPWS R14-08(2011), equation 6 and table 3 (pressures in Pa).
		const sublimationPressure = (temperature: number) => {
			const theta = temperature / 273.16;
			const terms = [
				[-21.2144006, 0.00333333333],
				[27.3203819, 1.20666667],
				[-6.1059813, 1.70333333]
			];
			return (
				611.657 *
				Math.exp(
					terms.reduce(
						(sum, [coefficient, exponent]) =>
							sum + coefficient * theta ** exponent,
						0
					) / theta
				)
			);
		};
		expect(sublimationPressure(230)).toBeCloseTo(8.94735, 5);
		const reference =
			sublimationPressure(Number(point![1]) + 273.15) / 101325;
		// The classroom point is rounded to two significant figures.
		expect(Math.abs(Number(point![2]) / reference - 1)).toBeLessThan(0.02);
	});

	it("ends with bounded advanced previews and a defensible capstone", () => {
		const advanced = moduleText("CHM10 Advanced Chemistry Map");
		const capstone = moduleText(
			"CHM11 Capstone: Real-World Chemistry Explanation"
		);

		expect(advanced).toContain("orientation topics here");
		expect(advanced).toContain("does not certify the mathematical");
		expect(advanced).toContain(
			"function, hazard, amount, waste, energy, feedstock"
		);
		expect(advanced).toContain("burden shifted elsewhere");
		expect(capstone).toContain("exact claim supported");
		expect(capstone).toContain("what new result would weaken or change");
		expect(capstone).toContain("one before-and-after section");
		expect(capstone).toContain("response to challenge");
		expect(resourceText()).toContain(
			"acs.org/green-chemistry-sustainability/principles"
		);
	});
});
