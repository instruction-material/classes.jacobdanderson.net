import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import LazyMarkdownContent from "@/components/LazyMarkdownContent.vue";
import {
	loadCourseAssetSection,
	resetCourseAssetPreviewCache,
	slugMarkdownHeading
} from "@/modules/courseAssetPreview";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { geometryBCourse } from "@/stores/courses/geometry-b";

interface PublishedGeometry {
	sha256: string;
	identities: { moduleId: string; id: string; section: string }[];
	modules: {
		id: string;
		kind: string;
		curriculum: { id: string; title: string; aliases: string[] }[];
	}[];
}

it.each([
	["a", "learner"],
	["a", "instructor"],
	["b", "learner"],
	["b", "instructor"]
])(
	"preserves Geometry %s progress and usable reading/practice separation for the %s",
	async (track, role) => {
		setActivePinia(createPinia());
		resetCourseAssetPreviewCache();
		const courseId = "geometry-" + track;
		const published = JSON.parse(
			readFileSync(
				resolve(
					process.cwd(),
					"../test/fixtures/" + courseId + "-published-progress.json"
				),
				"utf8"
			)
		) as PublishedGeometry;
		const app = useAppStore();
		if (role === "instructor")
			app.setCurrentTutor({
				_id: "geometry-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: [courseId],
				editTutors: false,
				saveEdit: "Save"
			});
		else
			app.setCurrentUser({
				_id: "geometry-learner",
				name: "Learner",
				email: "learner@example.invalid",
				age: 16,
				state: "GA",
				courseAccess: [courseId],
				editUsers: false,
				saveEdit: "Save"
			});
		const course = (await useCoursesStore().loadCourseById(courseId))!;
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
		expect(published.identities).toHaveLength(track === "a" ? 25 : 30);
		expect(actual).toHaveLength(track === "a" ? 38 : 39);
		for (const previous of published.identities)
			expect(
				actual.find(item => item.id === previous.id),
				previous.id
			).toEqual(previous);
		const previousIds = new Set(published.identities.map(item => item.id));
		expect(
			actual
				.filter(item => !previousIds.has(item.id))
				.every(item => item.section === "core")
		).toBe(true);
		for (const module of published.modules) {
			const current = course.modules.find(item => item.id === module.id)!;
			for (const previous of module.curriculum) {
				const item = current.curriculum.find(
					candidate => candidate.id === previous.id
				)!;
				expect(item.title).toBe(previous.title);
				expect(item.aliases ?? []).toEqual(
					expect.arrayContaining(previous.aliases)
				);
			}
		}
		const coreModules = course.modules.filter(
			module => module.kind !== "appendix"
		);
		const readings = coreModules
			.flatMap(module => module.curriculum)
			.filter(isLessonLearningItem);
		expect(readings).toHaveLength(track === "a" ? 5 : 10);
		for (const reading of readings.filter(
			item => !item.title.endsWith("Capstone Synthesis")
		)) {
			expect(reading.content).toContain("**Methods and definitions:**");
			expect(reading.content).toContain("**Worked example:**");
		}
		const practices = coreModules
			.flatMap(module => module.curriculum)
			.filter(item =>
				item.content.includes("[Check answers and reasoning]")
			);
		expect(practices).toHaveLength(track === "a" ? 16 : 12);
		const anchors = new Set<string>();
		for (const practice of practices) {
			expect(isLessonLearningItem(practice), practice.title).toBe(false);
			expect(practice.learningPath, practice.title).toBe("core");
			const set =
				practice.content.split("**Mixed set:**")[1] ??
				practice.content.split("**Problems:**")[1];
			const questions = set.match(/^\d+\. .+/gm) ?? [];
			expect(questions.length, practice.title).toBeGreaterThanOrEqual(3);
			const href = practice.content.match(
				/\[Check answers and reasoning\]\(([^)]+)\)/
			)?.[1];
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
								resolve(process.cwd(), "public" + url),
								"utf8"
							)
					}) as Response
			);
			expect(
				section.content.match(/^## /gm),
				practice.title
			).toHaveLength(1);
			expect(
				section.content.match(/^\d+\. .+/gm),
				practice.title
			).toHaveLength(questions.length);
			expect(anchors.has(section.hash), practice.title).toBe(false);
			anchors.add(section.hash);
		}
		expect(anchors.size).toBe(track === "a" ? 16 : 12);
		const capstones = coreModules
			.flatMap(module => module.curriculum)
			.filter(item => item.title.startsWith("Capstone:"));
		expect(capstones).toHaveLength(1);
		expect(capstones[0].learningPath).toBe("core");
		expect(isLessonLearningItem(capstones[0])).toBe(false);
	}
);

it("renders the pyramid calculation with its multiplication signs", async () => {
	const reading = geometryBCourse.modules
		.flatMap(module => module.curriculum)
		.find(item => item.title === "GEOB9 Polyhedra, Prisms, and Pyramids")!;
	const wrapper = mount(LazyMarkdownContent, {
		props: { content: reading.content }
	});
	await vi.waitFor(() => {
		expect(wrapper.text()).toContain("Volume is 36×4/3=48 cubic units.");
	});
	expect(wrapper.text()).toContain("(24×5)/2=60 square units");
	wrapper.unmount();
});

it("renders the solid self-check calculations without collapsing multiplication", async () => {
	resetCourseAssetPreviewCache();
	for (const [heading, calculations] of [
		[
			"GEOB9 Prisms, Pyramids and Surface Area",
			["Surface area is 2(2×3+2×4+3×4)=52 square units."]
		],
		[
			"Transformations and Solids Review",
			[
				"Volume is 24×5=120; surface area is 2×24+24×5=168.",
				"Volume is 64×3/3=64; surface area is 64+(32×5)/2=144.",
				"Volume is pi×25×12/3=100pi"
			]
		]
	] as const) {
		const section = await loadCourseAssetSection(
			"/course-assets/geometry-b/practice-checks-v1.md#" +
				slugMarkdownHeading(heading),
			"Self-check",
			async url =>
				({
					ok: true,
					text: async () =>
						readFileSync(
							resolve(process.cwd(), "public" + url),
							"utf8"
						)
				}) as Response
		);
		const wrapper = mount(LazyMarkdownContent, {
			props: { content: section.content }
		});
		await vi.waitFor(() => {
			expect(wrapper.text()).toContain(calculations[0]);
		});
		for (const calculation of calculations)
			expect(wrapper.text()).toContain(calculation);
		wrapper.unmount();
	}
});
