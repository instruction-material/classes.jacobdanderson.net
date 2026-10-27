import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import {
	loadCourseAssetSection,
	resetCourseAssetPreviewCache
} from "@/modules/courseAssetPreview";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const published = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/ap-calculus-published-progress.json"
		),
		"utf8"
	)
) as {
	sha256: string;
	identities: { moduleId: string; id: string; section: string }[];
	readings: {
		code: string;
		moduleId: string;
		id: string;
		title: string;
		aliases: string[];
	}[];
};

it.each(["learner", "instructor"])(
	"keeps AP progress and exposes concrete practice and required portfolios for the %s",
	async role => {
		setActivePinia(createPinia());
		resetCourseAssetPreviewCache();
		const app = useAppStore();
		if (role === "instructor")
			app.setCurrentTutor({
				_id: "calculus-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: ["ap-calculus"],
				editTutors: false,
				saveEdit: "Save"
			});
		else
			app.setCurrentUser({
				_id: "calculus-learner",
				name: "Learner",
				email: "learner@example.invalid",
				age: 16,
				state: "GA",
				courseAccess: ["ap-calculus"],
				editUsers: false,
				saveEdit: "Save"
			});
		const course = (await useCoursesStore().loadCourseById("ap-calculus"))!;
		const actual = course.modules.flatMap(module => [
			...module.curriculum.map(item => ({
				moduleId: module.id,
				id: item.id,
				section: "core"
			})),
			...module.supplementalProjects.map(item => ({
				moduleId: module.id,
				id: item.id,
				section: "optional"
			}))
		]);
		expect(
			createHash("sha256")
				.update(JSON.stringify(published.identities))
				.digest("hex")
		).toBe(published.sha256);
		expect(published.identities).toHaveLength(86);
		for (const previous of published.identities)
			expect(
				actual.find(item => item.id === previous.id),
				previous.id
			).toEqual(previous);
		expect(actual).toHaveLength(116);
		const oldIds = new Set(published.identities.map(item => item.id));
		const added = actual.filter(item => !oldIds.has(item.id));
		expect(added).toHaveLength(30);
		expect(added.every(item => item.section === "core")).toBe(true);
		const anchors = new Set<string>();
		for (const previous of published.readings) {
			const module = course.modules.find(
				item => item.id === previous.moduleId
			)!;
			const reading = module.curriculum.find(
				item => item.id === previous.id
			)!;
			expect(reading.title).toBe(previous.title);
			expect(reading.aliases).toEqual(
				expect.arrayContaining(previous.aliases)
			);
			expect(isLessonLearningItem(reading), module.title).toBe(true);
			expect(reading.content).toContain("**Worked example:**");
			expect(reading.content).toContain("**Methods and definitions:**");
			expect(reading.content).not.toContain("**Module Problem Set**");
			const practice = module.curriculum.find(item =>
				item.title.startsWith("Practice:")
			)!;
			expect(practice, module.title).toBeDefined();
			expect(isLessonLearningItem(practice), module.title).toBe(false);
			expect(practice.learningPath).toBe("core");
			expect(practice.content).toMatch(/\n1\. .+/);
			expect(practice.content).toMatch(/\n4\. .+/);
			if (
				["APC15", "APC17", "APC18", "APC19", "APC21"].includes(
					previous.code
				)
			)
				expect(practice.content).toContain(
					"AB route: problems 1–4. BC route: all problems."
				);
			expect(
				module.supplementalProjects.map(item => item.learningPath)
			).toEqual(["choice", "challenge"]);
			const portfolios = module.curriculum.filter(item =>
				item.title.startsWith("Project:")
			);
			expect(portfolios).toHaveLength(
				["APC22", "APC27"].includes(previous.code) ? 1 : 0
			);
			for (const item of [practice, ...portfolios]) {
				expect(isLessonLearningItem(item), item.title).toBe(false);
				expect(item.learningPath).toBe("core");
				const href = item.content.match(
					/\[Check answers and reasoning\]\(([^)]+)\)/
				)?.[1];
				expect(href, item.title).toBeDefined();
				const viewer = new URL(href!, "https://example.invalid");
				expect(viewer.pathname).toBe("/course-resource");
				const section = await loadCourseAssetSection(
					viewer.searchParams.get("asset")!,
					"Self-check",
					async url =>
						({
							ok: true,
							text: async () =>
								readFileSync(
									resolve(process.cwd(), `public${url}`),
									"utf8"
								)
						}) as Response
				);
				expect(
					section.content.match(/^## /gm),
					item.title
				).toHaveLength(1);
				expect(section.content, item.title).toMatch(/\n1\. .+/);
				expect(section.content, item.title).toMatch(/\n4\. .+/);
				if (item.title.startsWith("Project:")) {
					expect(item.content).toContain("**Mixed set:**");
					expect(item.content).toMatch(/\n6\. .+/);
					expect(section.content).toContain("**Portfolio review:**");
				}
				anchors.add(section.hash);
			}
		}
		expect(anchors.size).toBe(30);
		const series = course.modules.find(module =>
			module.title.startsWith("APC25 ")
		)!;
		const extension = series.supplementalProjects.find(
			item => item.learningPath === "challenge"
		)!;
		expect(extension.content).toContain("**Optional root test:**");
		expect(
			series.curriculum.map(item => item.content).join("\n")
		).not.toContain("root test");
		const rootHref = extension.content.match(
			/\[Check answers and reasoning\]\(([^)]+)\)/
		)?.[1];
		const rootViewer = new URL(rootHref!, "https://example.invalid");
		const rootSection = await loadCourseAssetSection(
			rootViewer.searchParams.get("asset")!,
			"Root test",
			async url =>
				({
					ok: true,
					text: async () =>
						readFileSync(
							resolve(process.cwd(), `public${url}`),
							"utf8"
						)
				}) as Response
		);
		expect(rootSection.title).toBe("APC25 Root Test Extension");
		expect(rootSection.content.match(/^## /gm)).toHaveLength(1);
		anchors.add(rootSection.hash);
		expect(anchors.size).toBe(31);
		const output = process.env.AP_CALCULUS_ROLE_PROOF_DIR;
		if (output) {
			mkdirSync(output, { recursive: true });
			writeFileSync(
				resolve(output, `ap-calculus-${role}.json`),
				JSON.stringify({ role, course }, null, 2) + "\n"
			);
		}
	}
);
