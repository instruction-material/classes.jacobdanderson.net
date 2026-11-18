import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { introToEnvironmentalScienceCourse } from "@/stores/courses/intro-to-environmental-science";

const EXPECTED_SEQUENCE = [
	"ES1 Ecosystems",
	"ES2 Flora and Decomposers",
	"ES3 Fauna",
	"ES4 Weather and Climate",
	"ES5 Geology and Oceanography",
	"ES6 Humans and the Environment",
	"ES7 Earth's Past, Present, and Future",
	"ES8 Environmental Design Capstone"
];

function requireModule(title: string) {
	const module = introToEnvironmentalScienceCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) {
		throw new Error(
			`Expected Intro to Environmental Science module ${title}.`
		);
	}
	return module;
}

function moduleText(title: string) {
	const module = requireModule(title);
	return [...module.curriculum, ...module.supplementalProjects]
		.map(item => `${item.title}\n${item.content}`)
		.join("\n");
}

function allItems() {
	return introToEnvironmentalScienceCourse.modules.flatMap(module => [
		...module.curriculum,
		...module.supplementalProjects
	]);
}

function courseText() {
	return introToEnvironmentalScienceCourse.modules
		.map(module => `${module.title}\n${moduleText(module.title)}`)
		.join("\n");
}

function resourceText() {
	return allItems()
		.flatMap(item => [
			item.projectLink,
			item.solutionLink,
			item.datasetLink,
			item.mediaLink
		])
		.filter(Boolean)
		.join("\n");
}

function markdownHeadingSlugs(markdown: string) {
	return new Set(
		[...markdown.matchAll(/^#{1,6}\s+(.+)$/gm)].map(([, heading]) =>
			heading
				.toLowerCase()
				.replace(/[`*_]/g, "")
				.replace(/[^\p{L}\p{N}\s-]/gu, "")
				.trim()
				.replace(/\s+/g, "-")
				.replace(/-+/g, "-")
		)
	);
}

describe("Intro to Environmental Science learner flow", () => {
	it("preserves the eight-stage core-biome sequence", () => {
		expect(
			introToEnvironmentalScienceCourse.modules.map(
				module => module.title
			)
		).toEqual(EXPECTED_SEQUENCE);
	});

	it("gives every stage pacing, milestones, and explicit learning paths", () => {
		for (const module of introToEnvironmentalScienceCourse.modules) {
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

	it("preserves the distinctive projects while making every card usable", () => {
		const projectTitles = introToEnvironmentalScienceCourse.modules.flatMap(
			module => module.supplementalProjects.map(item => item.title)
		);

		expect(projectTitles).toHaveLength(24);
		for (const title of [
			"Project: Biome Travel Guide",
			"Project: Food Journal",
			"Project: Climate Change Debate Response",
			"Project: Fossil Fuel Alternative",
			"Project: Your Biome in the Future",
			"Project: Transform Our Environment Proposal"
		]) {
			expect(projectTitles, title).toContain(title);
		}
		for (const item of allItems()) {
			expect(item.content.length, item.title).toBeGreaterThanOrEqual(650);
			expect(
				Boolean(
					item.datasetLink ??
					item.solutionLink ??
					item.mediaLink ??
					item.projectLink
				),
				item.title
			).toBe(true);
		}
	});

	it("uses fictional food-system evidence and protects personal information", () => {
		const fauna = moduleText("ES3 Fauna");
		const futures = moduleText("ES7 Earth's Past, Present, and Future");
		const allText = courseText();

		expect(fauna).toContain(
			"Every Food Journal or Diet Plan artifact uses only the fictional food-system table"
		);
		expect(fauna).toContain(
			"Learners do not disclose meals, allergies, medical conditions"
		);
		expect(fauna).toContain(
			"cannot establish nutrition, health, affordability"
		);
		expect(futures).toContain("Outdoor travel, photography, geolocation");
		expect(futures).toContain(
			"Exclude exact addresses, routes, schedules, faces"
		);
		expect(allText).not.toContain("Analyze a one-week food journal");
		expect(allText).not.toContain(
			"Compare a current or sample diet with a revised diet"
		);
		expect(allText).toContain(
			"The material inputs are carbon dioxide and water; light supplies energy rather than matter."
		);
	});

	it("provides the photosynthesis diagram with a complete text equivalent", () => {
		const flora = moduleText("ES2 Flora and Decomposers");
		const reference = requireModule(
			"ES2 Flora and Decomposers"
		).curriculum.find(
			item => item.title === "Photosynthesis Diagram Reference"
		);
		const diagram = fs.readFileSync(
			"public/course-assets/environmental-science/photosynthesis.svg",
			"utf8"
		);

		expect(flora).toContain(
			"/course-assets/environmental-science/photosynthesis.svg"
		);
		expect(flora).toContain("carbon dioxide enters from the air");
		expect(flora).toContain("oxygen is released");
		expect(reference?.mediaLink).toBeUndefined();
		expect(
			reference?.content.match(
				/!\[[^\]]*\]\(\/course-assets\/environmental-science\/photosynthesis\.svg\)/g
			)
		).toHaveLength(1);
		expect(flora).not.toMatch(
			/Pending media:|pending photosynthesis|convert energy into organic matter/i
		);
		expect(diagram).toContain('aria-labelledby="title description"');
		expect(diagram).toContain("Carbon dioxide and water supply matter.");
		expect(diagram).toContain("Light supplies energy.");
	});

	it("supplies every requested climate and pollution statement with a worked response", () => {
		const materials = fs.readFileSync(
			"public/course-assets/environmental-science/environmental-science-materials-pack.md",
			"utf8"
		);
		const answers = fs.readFileSync(
			"public/course-assets/environmental-science/environmental-science-rubrics-answer-key.md",
			"utf8"
		);

		for (const [prefix, count] of [
			["C", 6],
			["R", 3],
			["P", 10]
		] as const) {
			const pattern = new RegExp(
				`^- \\*\\*(${prefix}\\d+)(?::| —)`,
				"gm"
			);
			const expected = Array.from(
				{ length: count },
				(_, index) => `${prefix}${index + 1}`
			);
			expect(
				[...materials.matchAll(pattern)].map(match => match[1])
			).toEqual(expected);
			expect(
				[...answers.matchAll(pattern)].map(match => match[1])
			).toEqual(expected);
		}
		expect(materials).toContain(
			"5. A specified environmental or human impact follows."
		);
		expect(answers).toContain("a difference of 11");
		expect(answers).toContain("Unsupported release-to-risk inference");
	});

	it("separates energy flow, nutrient cycling, biodiversity, and population evidence", () => {
		const flora = moduleText("ES2 Flora and Decomposers");
		const fauna = moduleText("ES3 Fauna");

		expect(flora).toContain(
			"Energy therefore flows through the modeled system rather than cycling"
		);
		expect(flora).toContain("decomposers do not recycle heat");
		expect(flora).toContain(
			"Species richness, evenness, abundance, occupancy, biomass"
		);
		expect(flora).toContain(
			"Normalize the supplied predator observations by survey hour"
		);
		expect(fauna).toContain(
			"Population size, density, occupancy, encounter rate"
		);
		expect(fauna).toContain(
			"Carrying capacity represents a changing system relation"
		);
	});

	it("keeps weather, climate, attribution, and response claims distinct", () => {
		const climate = moduleText("ES4 Weather and Climate");

		expect(climate).toContain("First establish that an event occurred");
		expect(climate).toContain("Trend detection does not identify cause");
		expect(climate).toContain(
			"does not imply that every claim has two equally evidence-supported sides"
		);
		expect(climate).toContain("not a requirement to stage false balance");
		expect(resourceText()).toContain(
			"science.nasa.gov/climate-change/evidence"
		);
	});

	it("connects watersheds, oceans, carbon, and lifecycle energy comparisons", () => {
		const earthSystems = moduleText("ES5 Geology and Oceanography");

		expect(earthSystems).toContain(
			"Watersheds move water and material from atmosphere"
		);
		expect(earthSystems).toContain(
			"ocean pH. More acidic means a decrease in pH"
		);
		expect(earthSystems).toContain(
			"one megawatt-hour delivered to a specified region"
		);
		expect(earthSystems).toContain(
			"renewable or low-carbon does not mean impact-free"
		);
		expect(resourceText()).toContain("usgs.gov/water-science-school");
		expect(resourceText()).toContain("oceanacidification.noaa.gov");
		expect(resourceText()).toContain("eia.gov/energyexplained");
	});

	it("separates pollution measures and tests distributional effects", () => {
		const impacts = moduleText("ES6 Humans and the Environment");

		expect(impacts).toContain(
			"A reported release describes material reported by a covered facility"
		);
		expect(impacts).toContain(
			"Exposure concerns contact, dose concerns amount"
		);
		expect(impacts).toContain(
			"Do not collect learner addresses, identities, health information"
		);
		expect(impacts).toContain(
			"leading indicator, environmental outcome indicator, adverse-effect indicator"
		);
		expect(resourceText()).toContain("epa.gov/toxics-release-inventory");
		expect(resourceText()).toContain("epa.gov/enviroatlas");
	});

	it("ships supplied evidence, answer keys, and a monitorable capstone", () => {
		const capstone = moduleText("ES8 Environmental Design Capstone");
		const materials = fs.readFileSync(
			"public/course-assets/environmental-science/environmental-science-materials-pack.md",
			"utf8"
		);
		const answers = fs.readFileSync(
			"public/course-assets/environmental-science/environmental-science-rubrics-answer-key.md",
			"utf8"
		);

		expect(materials).toContain("## Core Biome Comparison Table");
		expect(materials).toContain("## Weather Climate and Attribution Data");
		expect(materials).toContain("## Pollution and Distribution Case");
		expect(materials).toContain("## Environmental Design Decision Matrix");
		expect(answers).toContain("## Common Evidence and Decision Rubric");
		expect(answers).toContain("## Capstone Decision and Monitoring Rubric");
		for (const link of resourceText()
			.split("\n")
			.filter(
				link =>
					link.startsWith("/course-assets/environmental-science/") &&
					/\.md(?:#|$)/.test(link)
			)) {
			const [pathname, fragment] = link.split("#");
			expect(fragment, link).toBeTruthy();
			const source = fs.readFileSync(`public${pathname}`, "utf8");
			expect(markdownHeadingSlugs(source), link).toContain(fragment);
		}
		expect(capstone).toContain(
			"Compare no action and at least two materially different responses"
		);
		expect(capstone).toContain(
			"leading indicator for implementation, an outcome indicator"
		);
		expect(capstone).toContain(
			"continuation, modification, expansion, pause, or rollback"
		);
		expect(
			introToEnvironmentalScienceCourse.developmentMetadata?.safetyPolicy.join(
				"\n"
			)
		).toContain("No personal diet, health, body");
	});
});
