import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { introToBiologyCourse } from "@/stores/courses/intro-to-biology";
import { loadRawCourse } from "@/stores/courses/index";
import { slugMarkdownHeading } from "@/modules/courseAssetPreview";
import { completeIntroBiologyActivity } from "./middleSchoolScienceReview";

const EXPECTED_SEQUENCE = [
	"BIO1 Human Body Systems",
	"BIO2 Nutrients and Macromolecules",
	"BIO3 Digestive Process",
	"BIO4 Digestion and Absorption",
	"BIO5 Energy Use and Storage",
	"BIO6 Regulation of Digestion",
	"BIO7 Elimination and Excretion",
	"BIO8 Digestive Odyssey Capstone"
];

const pack = fs.readFileSync(
	"public/course-assets/biology/intro-biology-materials-pack.md",
	"utf8"
);
const answers = fs.readFileSync(
	"public/course-assets/biology/intro-biology-rubrics-answer-key.md",
	"utf8"
);
const table = (heading: string) =>
	pack
		.split(heading)[1]
		.split(/^###? /m)[0]
		.split("\n")
		.filter(line => line.startsWith("|"))
		.slice(2)
		.map(line =>
			line
				.split("|")
				.slice(1, -1)
				.map(cell => cell.trim())
		);

describe("Intro to Biology complete supplied teaching and cases", () => {
	it("retains eight units and all68published items with teaching before36core tasks", async () => {
		const course = (await loadRawCourse("intro-to-biology"))!;
		expect(course.modules).toHaveLength(8);
		expect(course.modules.map(module => module.title)).toEqual(
			EXPECTED_SEQUENCE
		);
		expect(
			course.modules.flatMap(m => [
				...m.curriculum,
				...m.supplementalProjects
			])
		).toHaveLength(68);
		expect(
			course.modules
				.flatMap(m => m.curriculum)
				.filter(i => i.contentKind === "reading")
		).toHaveLength(8);
		expect(
			course.modules
				.flatMap(m => m.curriculum)
				.filter(i => i.contentKind === "assignment")
		).toHaveLength(36);
		expect(
			course.modules.flatMap(m => m.supplementalProjects)
		).toHaveLength(24);
		for (const module of course.modules) {
			expect(module.curriculum[0].content).toContain("## Worked");
			expect(
				module.curriculum[0].content.split(/\s+/).length
			).toBeGreaterThan(180);
			expect(
				module.curriculum.every(i => i.learningPath === "core")
			).toBe(true);
			expect(
				module.supplementalProjects.every(i =>
					["choice", "challenge"].includes(i.learningPath!)
				)
			).toBe(true);
		}
	});
	it("links every task to real input and response sections with one core check per task", () => {
		for (const [index, module] of introToBiologyCourse.modules.entries()) {
			for (const item of [
				...module.curriculum.slice(1),
				...module.supplementalProjects
			]) {
				expect(
					completeIntroBiologyActivity(
						"intro-to-biology",
						module,
						item
					),
					item.title
				).toBe(true);
				for (const link of [item.datasetLink!, item.solutionLink!]) {
					const [file, anchor] = link.split("#");
					const headings = [
						...fs
							.readFileSync("public" + file, "utf8")
							.matchAll(/^## (.+)$/gm)
					].map(m => slugMarkdownHeading(m[1]));
					expect(headings, link).toContain(anchor);
				}
			}
			const checks = answers
				.split("### BIO" + (index + 1) + " core checks")[1]
				.split("### Optional checks")[0];
			expect([...checks.matchAll(/^\d\. /gm)]).toHaveLength(
				module.curriculum.length - 1
			);
		}
	});
	it("supplies the guest graph and its limited matching rule", () => {
		const values = table("For the Dinner Mystery").map(row =>
			row.slice(1).map(Number)
		);
		expect(values).toEqual([
			[16, 2, 1],
			[1, 14, 2],
			[2, 1, 15],
			[6, 7, 5]
		]);
		expect(
			values.slice(0, 3).map(row => row.indexOf(Math.max(...row)))
		).toEqual([0, 1, 2]);
		expect(pack).toContain("For this puzzle only");
		expect(answers).toContain("unknown, not zero");
	});
	it("plots each worksheet value from zero with three distinct series and leaves the matches open", () => {
		const item = introToBiologyCourse.modules[1].curriculum.find(
			entry => entry.title === "Mission Dossier Graph"
		)!;
		const file = item.sourceMedia!.replacement;
		expect(item.content).toContain(`](${file})`);
		const svg = new DOMParser().parseFromString(
			fs.readFileSync("public" + file, "utf8"),
			"image/svg+xml"
		);
		const groups = Array.from(svg.querySelectorAll('g[id^="guest-"]'));
		const rows = table("For the Dinner Mystery");
		expect(groups).toHaveLength(rows.length);
		// Derive the zero line and unit spacing from the chart's labelled ticks.
		const ticks = Array.from(svg.querySelectorAll("line + text"));
		const gridY = (value: string) =>
			Number(
				ticks
					.find(tick => tick.textContent === value)!
					.previousElementSibling!.getAttribute("y1")
			);
		const zero = gridY("0");
		const unit = (zero - gridY("4")) / 4;
		expect(unit).toBeGreaterThan(0);
		for (const [i, group] of groups.entries()) {
			const [guest, ...values] = rows[i];
			expect(group.id).toBe(`guest-${guest.toLowerCase()}`);
			expect(
				Array.from(group.querySelectorAll("text"), el => el.textContent)
			).toEqual([...values, guest]);
			const bars = Array.from(group.querySelectorAll("rect"));
			expect(
				new Set(bars.map(bar => bar.getAttribute("fill"))).size
			).toBe(3);
			expect(
				bars.map(bar => Number(bar.getAttribute("height")) / unit)
			).toEqual(values.map(Number));
			for (const bar of bars) {
				expect(
					Number(bar.getAttribute("y")) +
						Number(bar.getAttribute("height"))
				).toBe(zero);
			}
		}
		expect(svg.documentElement.textContent).not.toMatch(
			/starch|protein|lipid|mixed|dish/i
		);
	});
	it("supplies separate pH and substrate evidence without inventing an exact optimum", () => {
		const rows = table("### Fictional E1 graph values");
		const first = rows.slice(0, 4).map(row => row.map(Number));
		expect(first).toEqual([
			[2, 1],
			[5, 6],
			[7, 10],
			[9, 3]
		]);
		expect(pack).toContain("an exact optimum between readings");
		expect(pack).toMatch(/\| 4 \| 9 \|[\s\S]*\| 8 \| 9 \|/);
		expect(answers).toContain("0, 4, 7, 9, 9");
	});
	it("states the volume assumption and an explicit counterexample for diffusion", () => {
		expect(pack).toContain("equal volumes");
		expect(18 / 9).toBeLessThan(4 / 1);
		expect(answers).toContain(
			"counts alone reverse the concentration ranking"
		);
		expect(pack).toContain("water, but not those solute particles");
		expect(answers).toContain(
			"A is simple diffusion; B facilitated diffusion; C ATP-coupled active transport; E osmosis"
		);
	});
	it("provides a text placement key for all ten system-map labels", () => {
		const regions = Object.fromEntries(
			table("### System and organ reference").map(
				([system, , region]) => [system, region]
			)
		);
		expect(regions).toEqual({
			skeletal: expect.stringContaining("thigh"),
			nervous: expect.stringContaining("skull"),
			integumentary: expect.stringContaining("body surface"),
			respiratory: expect.stringContaining("chest"),
			circulatory: expect.stringContaining("between the lungs"),
			digestive: expect.stringContaining("abdomen"),
			"excretory/urinary": expect.stringContaining(
				"either side of the spine"
			),
			endocrine: expect.stringContaining("behind the stomach"),
			immune: expect.stringContaining("armpits"),
			muscular: expect.stringContaining("upper arm")
		});
		const task = introToBiologyCourse.modules[0].curriculum.find(
			item => item.title === "Body Systems Reference A"
		);
		expect(task?.content).toContain("body outline or text map");
		expect(answers).toContain(
			"body region and function for each of the ten systems"
		);
	});

	it("connects the respiration stages to cell locations and distinguishes label units from model units", () => {
		expect(
			table("### Respiration route cards").map(row => row.slice(0, 2))
		).toEqual([
			["Glycolysis", "cytosol"],
			["Pyruvate oxidation", "mitochondrial matrix"],
			["Citric acid cycle (Krebs cycle)", "mitochondrial matrix"],
			[
				"Electron transport and ATP synthesis",
				"inner mitochondrial membrane"
			]
		]);
		const lesson = introToBiologyCourse.modules[4].curriculum[0].content;
		expect(lesson).toContain("1,000 small calories (cal)");
		expect(lesson).toContain(
			"Muscle glycogen supplies the muscle’s own work"
		);
		expect(pack).toContain("**5 Cal**");
		expect(answers).toContain("5 kcal or 5,000 small calories");
		expect(answers).toContain(
			"no conversion between its abstract units and Calories"
		);
	});

	it("requires two digestive-system interactions including regulation in the core capstone", () => {
		const task = introToBiologyCourse.modules[7].curriculum.find(item =>
			item.content.startsWith("Complete one required capstone")
		);
		for (const text of [
			task?.content,
			pack.split("## Digestive Odyssey Capstone Packet")[1],
			answers.split("### BIO8 core checks")[1]
		]) {
			expect(text).toMatch(/at least two (?:explained )?interactions/i);
			expect(text).toMatch(/regulat(?:es|e) digestion or energy storage/);
		}
	});
	it("supplies a balanced fictional energy allocation rather than a personal estimate", () => {
		const allocations = table("### Fictional three-hour allocation").map(
			row => Number(row[1])
		);
		expect(allocations).toEqual([45, 20, 15, 10, 10]);
		expect(allocations.reduce((sum, n) => sum + n, 0)).toBe(100);
		expect(answers).toContain("6 carbon, 12 hydrogen and 18 oxygen atoms");
		expect(pack).toContain(
			"neither calories nor measured human requirements"
		);
	});
	it("supplies the complete feedback curve and a clearly fictional observational abstract", () => {
		const rows = table("### Case A: Post-Meal Glucose Model").map(row =>
			row.map(Number)
		);
		expect(rows).toEqual([
			[0, 100],
			[30, 160],
			[60, 140],
			[120, 110],
			[180, 100]
		]);
		expect(pack).toContain(
			"fictional teaching abstract, not a published-study summary"
		);
		expect(pack).toContain("12 in each group");
		expect(pack).toContain("Hormone and immune activity were not measured");
		expect(answers).toContain("difference of 3 relative units");
	});
	it("supplies kidney material accounts and an alien with stated and unknown anatomy", () => {
		const rows = table("### Kidney boundary ledger");
		expect(
			rows.map(row => Number(row[1]) - Number(row[2]) + Number(row[3]))
		).toEqual([5, 0, 3]);
		expect(rows.map(row => Number(row[4]))).toEqual([5, 0, 3]);
		expect(100 - 90).toBe(10);
		expect(pack).toContain(
			"Already small nutrient molecules enter through a surface"
		);
		expect(pack).toContain("earlier life stages are unspecified");
	});
	it("keeps the salad conclusion bounded and the optional capstone a saved continuation", () => {
		expect(pack).toContain(
			"No ingredient-specific exposure test is supplied"
		);
		expect(answers).toContain(
			"do not uniquely identify the cause-bearing ingredient"
		);
		const capstone =
			introToBiologyCourse.modules[7].supplementalProjects[0];
		expect(capstone.content).toContain(
			"Continue the saved required capstone"
		);
		expect(capstone.learningPath).toBe("choice");
		expect(introToBiologyCourse.modules[0].curriculum[0].content).toContain(
			"final core project can use the notes"
		);
	});
	it("retains pacing, milestones and distinctive optional source project purposes", () => {
		for (const module of introToBiologyCourse.modules) {
			expect(module.estimatedTime).toMatch(/session/);
			expect(module.keyBlocks!.length).toBeGreaterThanOrEqual(6);
		}
		const titles = introToBiologyCourse.modules.flatMap(m =>
			m.supplementalProjects.map(i => i.title)
		);
		for (const title of [
			"Project: Human Body Systems Map",
			"Project: Dinner Mystery",
			"Project: Salad Clue Report",
			"Project: Cell Factory Diagram",
			"Project: Alien Venn Diagram",
			"Project: Digestive Odyssey Exhibit"
		])
			expect(titles).toContain(title);
	});
	it("retains accessible, private and introductory case-study boundaries", () => {
		const metadata = introToBiologyCourse.developmentMetadata!;
		expect(metadata.safetyPolicy.join(" ")).toContain(
			"No personal diet, symptoms, diagnoses"
		);
		expect(metadata.safetyPolicy.join(" ")).toContain(
			"No required food handling"
		);
		expect(metadata.courseBoundaries.join(" ")).toContain(
			"rather than a complete biology survey"
		);
		const text = introToBiologyCourse.modules
			.flatMap(m => m.curriculum)
			.map(i => i.content)
			.join(" ");
		expect(text).toContain("text description");
		expect(text).toContain("Accessible media alternative");
	});
	it("teaches the mechanism distinctions and exposes direct primary references", () => {
		const text = introToBiologyCourse.modules
			.map(m => m.curriculum[0].content)
			.join(" ");
		expect(text).toMatch(/Bile[\s\S]{0,150}not an enzyme/);
		expect(text).toContain(
			"random crossings continue while average net transfer is zero"
		);
		expect(text).toContain("organelles");
		expect(text).toContain(
			"niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work"
		);
		expect(text).toContain(
			"openstax.org/books/biology-2e/pages/5-2-passive-transport"
		);
	});
	it("rejects a truncated prompt, missing reading, wrong course or unrelated case link", () => {
		const module = introToBiologyCourse.modules[0],
			item = module.curriculum[1];
		expect(
			completeIntroBiologyActivity("intro-to-biology", module, {
				...item,
				content: item.content.slice(0, 60)
			})
		).toBe(false);
		expect(
			completeIntroBiologyActivity(
				"intro-to-biology",
				{ ...module, curriculum: module.curriculum.slice(1) },
				item
			)
		).toBe(false);
		expect(
			completeIntroBiologyActivity("another-course", module, item)
		).toBe(false);
		expect(
			completeIntroBiologyActivity("intro-to-biology", module, {
				...item,
				content: item.content.replace("[Case inputs]", "[Other page]")
			})
		).toBe(false);
	});
});
