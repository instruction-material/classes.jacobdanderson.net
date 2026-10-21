import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { webDevelopmentFoundationsCourse } from "@/stores/courses/web-development-foundations";

const EXPECTED_CORE_SEQUENCE = [
	"WDF0 Setup and Tooling",
	"WDF1 Positioning, Goals, and Suggested Course Family",
	"WDF2 Stage 1: Strengthen the Existing JavaScript Courses",
	"WDF3 Stage 2: Web Development Foundations",
	"WDF4 Stage 3: Front-End Applications",
	"WDF5 Stage 4: Back-End Basics",
	"WDF6 Stage 5: Databases and Data Models",
	"WDF7 Stage 6: Hosting and Deployment",
	"Full Stack Web Lab 14: Feature Slice Studio",
	"Full Stack Web Lab 15: API Integration Studio",
	"Full Stack Web Lab 16: Data Persistence Studio",
	"Full Stack Web Lab 17: Deployment Readiness Studio"
];

const EXPECTED_APPENDICES = [
	"WDF8 Hosting and Operations Topics to Add",
	"WDF9 Good Practical Projects",
	"WDF10 Suggested Advanced Strand",
	"WDF11 Integration with Network Topics",
	"WDF12 Expansion Ideas and Next Steps"
];

const EXPECTED_NORMALIZED_CORE_SEQUENCE = EXPECTED_CORE_SEQUENCE.map(title => {
	if (title === "WDF1 Positioning, Goals, and Suggested Course Family")
		return "WDF1 Browser, Server, and Data Boundaries";
	if (title === "WDF2 Stage 1: Strengthen the Existing JavaScript Courses")
		return "WDF2 Files, Git, and Browser Debugging";
	if (title === "WDF3 Stage 2: Web Development Foundations")
		return "WDF3 Accessible Portfolio, Modules, and Forms";
	if (title === "WDF4 Stage 3: Front-End Applications")
		return "WDF4 Notification Views and Asynchronous State";
	return title.replace(/^Full Stack/u, "Full-Stack");
});

const PRACTICE_SECTIONS = [
	"toolchain-preflight-case",
	"course-path-map-case",
	"local-workflow-case",
	"portfolio-build-case",
	"front-end-state-case",
	"validated-api-case",
	"persistence-boundary-case",
	"deployment-preflight-case",
	"feature-slice-capstone-case",
	"api-integration-capstone-case",
	"data-persistence-capstone-case",
	"deployment-readiness-capstone-case"
];

const ANSWER_SECTIONS = PRACTICE_SECTIONS.map(section =>
	section.replace(/-case$/u, "-key")
);

async function requireWebDevelopmentFoundationsCourse() {
	const course = await loadRawCourse("web-development-foundations");
	expect(course).not.toBeNull();
	return course!;
}

function courseItems(
	module: (typeof webDevelopmentFoundationsCourse.modules)[number]
) {
	return [...module.curriculum, ...module.supplementalProjects];
}

function markdownHeadingSlugs(markdown: string) {
	return new Set(
		[...markdown.matchAll(/^#{1,6}\s+(.+)$/gmu)].map(([, heading]) =>
			heading
				.toLowerCase()
				.replace(/[`*_]/gu, "")
				.replace(/[^\p{L}\p{N}\s-]/gu, "")
				.trim()
				.replace(/\s+/gu, "-")
				.replace(/-+/gu, "-")
		)
	);
}

function assetText(filename: string) {
	return fs.readFileSync(
		path.resolve(
			__dirname,
			`../public/course-assets/web-development-foundations/${filename}`
		),
		"utf8"
	);
}

describe("Web Development Foundations learner flow", () => {
	it("places the required full-stack progression before optional operations material", async () => {
		expect(
			webDevelopmentFoundationsCourse.modules
				.filter(module => module.kind !== "appendix")
				.map(module => module.title)
		).toEqual(EXPECTED_CORE_SEQUENCE);

		const loaded = await requireWebDevelopmentFoundationsCourse();
		expect(
			loaded.modules
				.filter(module => module.kind !== "appendix")
				.map(module => module.title)
		).toEqual(EXPECTED_NORMALIZED_CORE_SEQUENCE);
		const loadedAppendixTitles = loaded.modules
			.filter(module => module.kind === "appendix")
			.map(module => module.title);
		expect(
			loadedAppendixTitles.slice(0, EXPECTED_APPENDICES.length)
		).toEqual(EXPECTED_APPENDICES);
		expect(loaded.modules[1]?.kind).toBe("transition");
		expect(loadedAppendixTitles).toContain(
			"Web Development Foundations: Toolchain and Version Assumptions"
		);
	});

	it("adds timing, reasoning structure, local continuity, and current references", () => {
		for (const module of webDevelopmentFoundationsCourse.modules.filter(
			candidate => candidate.kind !== "appendix"
		)) {
			expect(module.estimatedTime, module.title).toMatch(/session/u);
			expect(module.keyBlocks, module.title).toHaveLength(6);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Course flow:**"
			);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Standards route:**"
			);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Evidence gate:**"
			);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Local continuity:**"
			);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Current references:**"
			);
		}
	});

	it("keeps real-time transport optional until server boundaries are taught", () => {
		const frontEndModule = webDevelopmentFoundationsCourse.modules.find(
			module => module.title === "WDF4 Stage 3: Front-End Applications"
		);
		expect(frontEndModule).toBeDefined();

		const chatItems = courseItems(frontEndModule!).filter(item =>
			item.projectLink?.includes("WDF4-Realtime-Chat-App")
		);
		expect(chatItems.length).toBeGreaterThan(0);
		for (const item of chatItems) {
			expect(item.learningPath, item.title).toBe("choice");
			expect(item.datasetLink, item.title).toContain(
				"#front-end-state-case"
			);
		}

		const text = JSON.stringify(frontEndModule);
		expect(text).toContain("supplied local event stream");
		expect(text).toContain("optional revisit after WDF5");
		expect(text).toContain("not a production chat service");
	});

	it("keeps every required project source-linked and locally verifiable", () => {
		const projectItems = webDevelopmentFoundationsCourse.modules
			.filter(module => module.kind !== "appendix")
			.flatMap(courseItems)
			.filter(item => item.projectLink);

		expect(projectItems.length).toBeGreaterThanOrEqual(40);
		for (const item of projectItems) {
			expect(item.projectLink, item.title).toContain(
				"github.com/instruction-material/Web-Development-Foundations"
			);
			expect(item.projectLink, item.title).toContain("/starter");
			expect(item.solutionLink, item.title).toContain("/solution");
			expect(item.solutionLink, item.title).not.toBe(item.projectLink);
			expect(item.datasetLink, item.title).toMatch(
				/^\/course-assets\/web-development-foundations\/web-development-foundations-practice-pack\.md#/u
			);
			expect(item.mediaLink, item.title).toMatch(/^https:\/\//u);
		}
	});

	it("keeps every practice and verification anchor valid", () => {
		const practiceSlugs = markdownHeadingSlugs(
			assetText("web-development-foundations-practice-pack.md")
		);
		const answerSlugs = markdownHeadingSlugs(
			assetText("web-development-foundations-verification-guide.md")
		);

		for (const section of PRACTICE_SECTIONS) {
			expect(practiceSlugs, section).toContain(section);
		}
		for (const section of ANSWER_SECTIONS) {
			expect(answerSlugs, section).toContain(section);
		}

		for (const module of webDevelopmentFoundationsCourse.modules.filter(
			candidate => candidate.kind !== "appendix"
		)) {
			const content = module.curriculum[0].content;
			const practiceMatch = content.match(
				/\/course-assets\/web-development-foundations\/web-development-foundations-practice-pack\.md#([a-z0-9-]+)/u
			);
			const answerMatch = content.match(
				/\/course-assets\/web-development-foundations\/web-development-foundations-verification-guide\.md#([a-z0-9-]+)/u
			);

			expect(practiceMatch, module.title).not.toBeNull();
			expect(answerMatch, module.title).not.toBeNull();
			expect(practiceSlugs, module.title).toContain(practiceMatch?.[1]);
			expect(answerSlugs, module.title).toContain(answerMatch?.[1]);
		}
	});

	it("uses current scaffold assumptions and honest source-depth metadata", async () => {
		const metadata = (await requireWebDevelopmentFoundationsCourse())
			.developmentMetadata;

		expect(metadata?.toolchain.join(" ")).toContain("Node.js 24 LTS");
		expect(metadata?.toolchain.join(" ")).toContain(
			"Vite 8, Express 5, Mongoose 9, Zod 4, Nodemailer 10, and Socket.IO 4"
		);
		expect(metadata?.sourcePolicy).toContain(
			"substantive teaching skeletons"
		);
		expect(metadata?.sourcePolicy).toContain(
			"generic click-to-add-list wrappers"
		);
		expect(metadata?.sourcePolicy).toContain(
			"None of the linked projects is represented as production-ready"
		);
	});

	it("makes local, fictional, reversible work the completion route", async () => {
		const text = JSON.stringify(
			await requireWebDevelopmentFoundationsCourse()
		);

		expect(text).toContain(
			"Use only fictional names, messages, notes, bookings, contact details"
		);
		expect(text).toContain("Keep required services on loopback");
		expect(text).toContain("JSON-only Nodemailer transport sends no email");
		expect(text).toContain(
			"The default memory adapter runs without a database."
		);
		expect(text).toContain("The optional MongoDB adapter");
		expect(text).toContain(
			"Any optional publishing uses a learner-owned environment"
		);
		expect(text).toContain(
			"no project claims production-ready identity, authorization, moderation"
		);
	});

	it("retains substantive source projects and the four named capstone studios", () => {
		const text = JSON.stringify(webDevelopmentFoundationsCourse);

		for (const sourceProject of [
			"WDF1-Portfolio-Custom-Domain",
			"WDF2-Notes-App-with-MongoDB",
			"WDF3-Booking-Contact-App",
			"WDF4-Realtime-Chat-App",
			"WDF5-Separate-Deployment-Lab"
		]) {
			expect(text).toContain(sourceProject);
		}
		for (const labTitle of EXPECTED_CORE_SEQUENCE.slice(-4)) {
			expect(text).toContain(labTitle);
		}
	});
});
