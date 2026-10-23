import fs from "node:fs";
import path from "node:path";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { loadRawCourse } from "@/stores/courses/index";
import { introToSwiftAppDevelopmentCourse } from "@/stores/courses/intro-to-swift-app-development";

const EXPECTED_SEQUENCE = [
	"SW1 Mac Setup and First Launch",
	"SW2 Xcode Project Anatomy",
	"SW3 SwiftUI Views, Layout, and Modifiers",
	"SW4 Swift Basics in App Context",
	"SW5 Functions, Structs, and Enums",
	"SW6 App Structure and Lifecycle",
	"SW7 State and Data Flow",
	"SW8 Media, Maps, and Permission-Aware Features",
	"SW9 Navigation and Multi-Screen Apps",
	"SW10 Lists, Forms, and CRUD",
	"SW11 Persistence with SwiftData",
	"SW12 Networking and Data Loading",
	"SW13 Debugging and Swift Testing",
	"SW14 App Design and Accessibility",
	"SW15 Simulator and Device Validation",
	"SW16 Apple Development and Distribution Map",
	"SW17 Signing, Teams, and Bundle IDs",
	"SW18 App Store Connect and TestFlight",
	"SW19 Capstone Build and User Testing",
	"SW20 Final Publishing Walkthrough",
	"SWX Shapes and Legacy Reference Boundaries"
];

const LEGACY_SEQUENCE = [
	"SAD2 Mac Setup and Project Tooling",
	"SAD7 Xcode Project Anatomy",
	"SAD8 SwiftUI Mental Model",
	"SAD9 Swift Basics in App Context",
	"SAD10 Functions, Structs, and Enums",
	"SAD6 What an App Is Structurally",
	"SAD11 State and Data Flow",
	"SAD14 Media, Maps, and Device Features",
	"SAD12 Navigation and Multi-Screen Apps",
	"SAD13 Lists, Forms, and CRUD Patterns",
	"SAD16 Persistence",
	"SAD15 Networking and Data Loading",
	"SAD17 Debugging and Testing",
	"SAD18 App Design and Accessibility",
	"SAD4 Running on Simulator and Device",
	"SAD1 Apple Developer Ecosystem Overview",
	"SAD3 Certificates, Signing, and Bundle IDs",
	"SAD5 App Store Connect and TestFlight Workflow",
	"SAD20 Capstone App",
	"SAD19 Final Publishing Walkthrough",
	"SADX Enrichment and Reference Boundaries"
];

const PRACTICE_SECTIONS = [
	"mac-setup-and-first-launch-case",
	"xcode-project-anatomy-case",
	"swiftui-views-layout-and-modifiers-case",
	"swift-basics-in-app-context-case",
	"functions-structs-and-enums-case",
	"app-structure-and-lifecycle-case",
	"state-and-data-flow-case",
	"media-maps-and-permissions-case",
	"navigation-and-multi-screen-case",
	"lists-forms-and-crud-case",
	"swiftdata-persistence-case",
	"networking-and-data-loading-case",
	"debugging-and-swift-testing-case",
	"design-and-accessibility-case",
	"simulator-and-device-validation-case",
	"apple-development-and-distribution-map-case",
	"signing-teams-and-bundle-ids-case",
	"app-store-connect-and-testflight-case",
	"capstone-build-and-user-testing-case",
	"final-publishing-walkthrough-case",
	"shapes-and-legacy-reference-case"
];

const ANSWER_SECTIONS = PRACTICE_SECTIONS.map(section =>
	section.replace(/-case$/u, "-key")
);

function allItems() {
	return introToSwiftAppDevelopmentCourse.modules.flatMap(module => [
		...module.curriculum,
		...module.supplementalProjects
	]);
}

function courseText() {
	return introToSwiftAppDevelopmentCourse.modules
		.flatMap(module => [
			module.title,
			...module.curriculum.map(item => `${item.title}\n${item.content}`),
			...module.supplementalProjects.map(
				item => `${item.title}\n${item.content}`
			)
		])
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

describe("Intro to Swift App Development learner flow", () => {
	it("reorders the complete course into build, extend, verify, and ship arcs", () => {
		expect(
			introToSwiftAppDevelopmentCourse.modules.map(module => module.title)
		).toEqual(EXPECTED_SEQUENCE);
		expect(introToSwiftAppDevelopmentCourse.modules).toHaveLength(21);
		expect(
			introToSwiftAppDevelopmentCourse.modules.flatMap(
				module => module.curriculum
			)
		).toHaveLength(98);
		expect(
			introToSwiftAppDevelopmentCourse.modules.flatMap(
				module => module.supplementalProjects
			)
		).toHaveLength(63);

		for (const [
			index,
			module
		] of introToSwiftAppDevelopmentCourse.modules.entries()) {
			expect(module.aliases, module.title).toContain(
				LEGACY_SEQUENCE[index]
			);
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(module.keyBlocks, module.title).toHaveLength(6);
		}
		expect(introToSwiftAppDevelopmentCourse.modules.at(-1)?.kind).toBe(
			"appendix"
		);
	});

	it("starts learners in Xcode and SwiftUI before account and publishing operations", () => {
		const titles = introToSwiftAppDevelopmentCourse.modules.map(
			module => module.title
		);

		expect(
			titles.indexOf("SW3 SwiftUI Views, Layout, and Modifiers")
		).toBeLessThan(
			titles.indexOf("SW16 Apple Development and Distribution Map")
		);
		expect(titles.indexOf("SW4 Swift Basics in App Context")).toBeLessThan(
			titles.indexOf("SW17 Signing, Teams, and Bundle IDs")
		);
		expect(
			titles.indexOf("SW19 Capstone Build and User Testing")
		).toBeLessThan(titles.indexOf("SW20 Final Publishing Walkthrough"));
		expect(
			titles.slice(0, 7).every(title => /^SW[1-7]\b/u.test(title))
		).toBe(true);
	});

	it("preserves the seven canonical app projects and their source links", () => {
		const text = JSON.stringify(introToSwiftAppDevelopmentCourse);

		for (const [title, folder] of [
			["Project: Welcome Profile App", "SAD1-Welcome-Profile-App"],
			["Project: Media Gallery App", "SAD2-Media-Gallery-App"],
			["Project: Multi-Tab Hobby App", "SAD3-Multi-Tab-Hobby-App"],
			["Project: Map Places App", "SAD4-Map-Places-App"],
			["Project: Simple Tracker App", "SAD5-Simple-Tracker-App"],
			["Project: API-Powered Reference App", "SAD6-API-Reference-App"],
			[
				"Project: Publish-Ready Capstone App",
				"SAD7-Publish-Ready-Capstone"
			]
		]) {
			expect(text, title).toContain(title);
			expect(text, folder).toContain(
				`https://github.com/instruction-material/Swift/tree/main/${folder}`
			);
		}
	});

	it("provides substantial project reading or linked practice for every activity", () => {
		const items = allItems();
		const titles = items.map(item => item.title);

		expect(
			Math.min(...items.map(item => item.content.length))
		).toBeGreaterThan(1_500);
		expect(new Set(titles).size).toBe(titles.length);
		expect(titles).not.toContain("Diagnostic Checkpoint");
		expect(titles).toContain("SW7 State and Data Flow: Readiness Check");

		for (const item of items) {
			if (item.title === "Project: Welcome Profile App") {
				for (const section of [
					"## Open one complete source role",
					"## Read the app from its entry point",
					"## Follow the data into both screens",
					"## Work through modifier order",
					"## Core project",
					"## Read the reference after an attempt",
					"## Distinct follow-up work"
				])
					expect(item.content).toContain(section);
			} else {
				expect(item.content, item.title).toContain("**Course position:**");
				expect(item.content, item.title).toContain("**Build focus:**");
				expect(item.content, item.title).toContain(
					"**Verification gate:**"
				);
				expect(item.content, item.title).toContain(
					"**Toolchain and access boundary:**"
				);
				expect(item.content, item.title).toContain("**Local continuity:**");
			}
			expect(item.projectLink, item.title).toMatch(/^https:\/\//u);
			expect(item.solutionLink, item.title).toBeTruthy();
			expect(item.datasetLink, item.title).toMatch(
				/^\/course-assets\/swift\/intro-swift-practice-pack\.md#/u
			);
			expect(item.mediaLink, item.title).toMatch(/^https:\/\//u);
		}
	});

	it("teaches modern state, persistence, testing, and API availability explicitly", () => {
		const text = courseText();

		expect(text).toContain(
			"Use @State for transient view-owned data, pass a Binding to one editor"
		);
		expect(text).toContain(
			"Observation integration begins with iOS 17-era platform availability"
		);
		expect(text).toContain(
			"@StateObject and ObservableObject remain a compatibility route"
		);
		expect(text).toContain(
			"Move the tracker model into SwiftData for an iOS 17-or-later route"
		);
		expect(text).toContain(
			"Swift Testing is used in a test target, not the shipping app target"
		);
		expect(text).toContain("HTTP and decoding failures are distinct");
	});

	it("keeps paid accounts, devices, permissions, and personal data out of the core", () => {
		const text = `${courseText()}\n${JSON.stringify(
			introToSwiftAppDevelopmentCourse.developmentMetadata
		)}`;

		expect(text).toContain(
			"paid developer membership is not required for this module"
		);
		expect(text).toContain(
			"No learner is required to own or connect an iPhone"
		);
		expect(text).toContain("Core coding and simulator work remain free");
		expect(text).toContain(
			"No classroom task requires personal photos, contacts, precise location"
		);
		expect(text).toContain(
			"Certificates, private keys, provisioning files, passwords, recovery codes, and team invitations are never submitted or shared"
		);
		expect(text).toContain(
			"Live App Store Connect, TestFlight, signing, and submission actions are optional"
		);
	});

	it("integrates accessibility and failure-state evidence before release", () => {
		const text = `${courseText()}\n${JSON.stringify(
			introToSwiftAppDevelopmentCourse.developmentMetadata
		)}`;

		expect(text).toContain("Core flow works at a supplied large text size");
		expect(text).toContain("state is not color-only");
		expect(text).toContain("The local fixture always works");
		expect(text).toContain("ordinary, empty, and failure-state checks");
		expect(text).toContain(
			"unresolved blockers produce a no-submit decision"
		);
	});

	it("provides all local practice and verification anchors", () => {
		const practice = fs.readFileSync(
			path.resolve(
				"public/course-assets/swift/intro-swift-practice-pack.md"
			),
			"utf8"
		);
		const answers = fs.readFileSync(
			path.resolve(
				"public/course-assets/swift/intro-swift-verification-guide.md"
			),
			"utf8"
		);
		const practiceHeadings = markdownHeadingSlugs(practice);
		const answerHeadings = markdownHeadingSlugs(answers);

		for (const section of PRACTICE_SECTIONS)
			expect(practiceHeadings, section).toContain(section);
		for (const section of ANSWER_SECTIONS)
			expect(answerHeadings, section).toContain(section);

		for (const item of allItems()) {
			expect(practiceHeadings, item.title).toContain(
				item.datasetLink?.split("#")[1]
			);
			if (item.title === "Project: Welcome Profile App") {
				expect(item.content).toContain("expected result, observed result");
				expect(item.content).toContain("two simulator sizes");
			} else {
				expect(item.content, item.title).toContain(
					"/course-assets/swift/intro-swift-verification-guide.md#"
				);
			}
		}

		expect(practice).toContain("Canonical project spine");
		expect(practice).toContain("Supplied JSON fixture");
		expect(answers).toContain("Twenty-four-point capstone rubric");
	});

	it("uses first-party references for the version-sensitive course boundaries", () => {
		const text = JSON.stringify(introToSwiftAppDevelopmentCourse);

		for (const link of [
			"https://developer.apple.com/xcode/system-requirements/",
			"https://developer.apple.com/tutorials/develop-in-swift/hello-swiftui",
			"https://developer.apple.com/documentation/swiftui/model-data",
			"https://developer.apple.com/documentation/swiftdata/preserving-your-apps-model-data-across-launches",
			"https://developer.apple.com/documentation/testing",
			"https://developer.apple.com/design/human-interface-guidelines/accessibility/",
			"https://developer.apple.com/support/compare-memberships/",
			"https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview",
			"https://developer.apple.com/app-store/review/guidelines/"
		]) {
			expect(text, link).toContain(link);
		}
	});

	it("ships development metadata matching the rebuilt contract", () => {
		const metadata = introToSwiftAppDevelopmentCourse.developmentMetadata;

		expect(metadata).toBeDefined();
		expect(metadata?.sourcePolicy).toContain(
			"seven canonical instruction-material/Swift app projects"
		);
		expect(metadata?.assessmentCadence).toHaveLength(5);
		expect(metadata?.toolchain).toContain(
			"Simulator-first core route; no personally owned iPhone or paid Developer Program membership is assumed."
		);
		expect(metadata?.capstoneExpectations).toHaveLength(6);
		expect(metadata?.recommendedNextWork).toHaveLength(3);
	});

	it("survives catalog loading with the active sequence and legacy aliases", async () => {
		const loaded = await loadRawCourse("intro-to-swift-app-development");
		expect(loaded).not.toBeNull();
		expect(
			loaded!.modules
				.slice(0, EXPECTED_SEQUENCE.length)
				.map(module => module.title)
		).toEqual(EXPECTED_SEQUENCE);
		expect(loaded!.modules.map(module => module.title)).toEqual(
			expect.arrayContaining([
				"Standards Map",
				"Course Roadmap",
				"Project Practice Guide",
				"Intro to Swift App Development: Toolchain and Version Assumptions"
			])
		);

		for (const [index, module] of loaded!.modules
			.slice(0, EXPECTED_SEQUENCE.length)
			.entries()) {
			expect(module.aliases, module.title).toContain(
				LEGACY_SEQUENCE[index]
			);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Course position:**"
			);
		}

		expect(JSON.stringify(loaded)).toContain(
			"/course-assets/swift/intro-swift-practice-pack.md#"
		);
		expect(JSON.stringify(loaded)).toContain(
			"/course-assets/swift/intro-swift-verification-guide.md#"
		);
	});

	it("recognizes saved IDs from the original module and lesson titles", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById(
			"intro-to-swift-app-development"
		);
		const module = course?.modules.find(
			candidate => candidate.title === "SW1 Mac Setup and First Launch"
		);
		expect(module?.aliases).toContain(
			"intro-to-swift-app-development-sad2-mac-setup-and-project-tooling"
		);
		expect(
			module?.curriculum.find(
				item =>
					item.title === "Machine Requirements and Platform Reality"
			)?.aliases
		).toContain(
			"intro-to-swift-app-development-sad2-mac-setup-and-project-tooling-curriculum-machine-requirements-and-platform-reality"
		);
		expect(
			module?.supplementalProjects.find(item =>
				item.title.includes("Readiness Check")
			)?.aliases
		).toContain(
			"intro-to-swift-app-development-sad2-mac-setup-and-project-tooling-supplemental-diagnostic-checkpoint"
		);
		const publishingModule = course?.modules.find(
			candidate =>
				candidate.title ===
				"SW16 Apple Development and Distribution Map"
		);
		expect(
			publishingModule?.supplementalProjects.find(
				item =>
					item.title === "Distribution Pipeline Reference Walkthrough"
			)?.aliases
		).toContain(
			"intro-to-swift-app-development-sad1-apple-developer-ecosystem-overview-supplemental-mod5pro3"
		);
	});

	it("avoids the old inverted-order and generic-output regressions", () => {
		const visibleText = introToSwiftAppDevelopmentCourse.modules
			.flatMap(module => [
				module.title,
				...module.curriculum.flatMap(item => [
					item.title,
					item.content
				]),
				...module.supplementalProjects.flatMap(item => [
					item.title,
					item.content
				])
			])
			.join("\n");
		const titles = allItems().map(item => item.title);

		expect(visibleText).not.toMatch(/\bshould\b/iu);
		expect(visibleText).not.toMatch(/\bMini Lab\b/iu);
		expect(visibleText).not.toMatch(/\bsupplemental [23]\b/iu);
		expect(titles).not.toContain("Diagnostic Checkpoint");
		expect(
			introToSwiftAppDevelopmentCourse.modules[0]?.title
		).not.toContain("Apple Developer Ecosystem");
		expect(
			introToSwiftAppDevelopmentCourse.modules[4]?.title
		).not.toContain("App Store Connect");
	});
});
