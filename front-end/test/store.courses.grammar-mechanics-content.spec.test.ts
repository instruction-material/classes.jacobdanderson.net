import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import published from "../../test/fixtures/catalog-published-identities.json";
import restored from "../../test/fixtures/grammar-mechanics-restored-identities.json";
import LazyMarkdownContent from "@/components/LazyMarkdownContent.vue";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { grammarMechanicsActivities } from "@/stores/courses/grammarMechanicsActivities";
import { grammarMechanicsCourse } from "@/stores/courses/source-library-courses";

it.each(["learner", "instructor"])(
	"provides grammar inputs, distinct tasks and optional project choices for %s",
	async role => {
		const id = "middle-school-c-grammar";
		setActivePinia(createPinia());
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "grammar-tutor",
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
		const all = course.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
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
		const projects = grammarMechanicsCourse.modules
			.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			])
			.filter(item => item.content.startsWith("**Project goal:**"));
		const missingProjects = projects.filter(
			project => !all.some(item => item.title === project.title)
		);
		if (process.env.COURSE_GRAMMAR_PROOF_DIR) {
			mkdirSync(process.env.COURSE_GRAMMAR_PROOF_DIR, {
				recursive: true
			});
			writeFileSync(
				join(
					process.env.COURSE_GRAMMAR_PROOF_DIR,
					`${id}-${role}.json`
				),
				JSON.stringify(
					{
						id,
						role,
						identities,
						missingProjects: missingProjects.map(
							item => item.title
						),
						modules: course.modules
					},
					null,
					2
				) + "\n"
			);
		}
		expect(missingProjects.map(item => item.title)).toEqual([]);
		expect(all.filter(item => item.contentKind === "reading")).toHaveLength(
			20
		);
		expect(identities).toHaveLength(published[id].items + restored.length);
		for (const added of restored)
			expect(identities.filter(item => item.id === added.id)).toEqual([
				added
			]);
		const originalIdentities = identities.filter(
			item => !restored.some(added => added.id === item.id)
		);
		expect(
			createHash("sha256")
				.update(JSON.stringify(originalIdentities))
				.digest("hex")
		).toBe(published[id].sha256);
		for (const project of projects) {
			const current = all.find(item => item.title === project.title)!;
			expect(current.learningPath, current.title).toBe(
				project.learningPath
			);
			expect(isLessonLearningItem(current), current.title).toBe(false);
		}
		const text = all.map(item => item.content).join("\n");
		expect(text).toContain("Original practice passage: Snow Day");
		expect(text).toContain("Singular they");
		expect(text).not.toContain(
			"keeps singular antecedents with singular pronouns"
		);
		const types = course.modules
			.find(module => module.title === "MSC16 Sentence Types")!
			.curriculum.find(item => item.contentKind === "reading")!;
		const wrapper = mount(LazyMarkdownContent, {
			props: { content: types.content }
		});
		try {
			await vi.waitFor(() =>
				expect(wrapper.findAll("tbody tr")).toHaveLength(4)
			);
			expect(wrapper.text()).toContain("Compound-complex");
			expect(wrapper.text()).toContain("two independent clauses");
		} finally {
			wrapper.unmount();
		}
		const breaks = course.modules
			.find(module => module.title === "MSC12 Pauses & Breaks")!
			.curriculum.find(item => item.contentKind === "reading")!;
		const punctuation = mount(LazyMarkdownContent, {
			props: { content: breaks.content }
		});
		try {
			await vi.waitFor(() =>
				expect(punctuation.text()).toContain(
					"key\u2014the spare from last winter\u2014in her coat"
				)
			);
			expect(punctuation.text()).not.toContain("&#8212;");
		} finally {
			punctuation.unmount();
		}
	}
);

it.each(["learner", "instructor"])(
    "keeps all40supplemental grammar tasks complete and in their own subject for %s",
    async role => {
        setActivePinia(createPinia());
        if (role === "instructor") useAppStore().setCurrentTutor({
            _id: "grammar-final-tutor", name: "Tutor", email: "tutor@example.invalid",
            age: 30, state: "GA", usersOfTutorLength: 0,
            coursePermissions: ["middle-school-c-grammar"], editTutors: false, saveEdit: "Save"
        });
        const course = (await useCoursesStore().loadCourseById("middle-school-c-grammar"))!;
        const tasks = course.modules.flatMap(module => module.supplementalProjects.filter(
            item => item.title.startsWith("Practice Map:") || item.title.startsWith("Extension Review:")
        ));
        expect(tasks).toHaveLength(40);
        for (const module of course.modules) {
            const authored = grammarMechanicsActivities[module.title];
            for (const item of module.supplementalProjects) {
                if (item.title.startsWith("Practice Map:")) expect(item.content, item.title).toBe(authored.practice);
                if (item.title.startsWith("Extension Review:")) expect(item.content, item.title).toBe(authored.extension);
            }
        }
        const bodies = new Set(tasks.map(item => item.content));
        expect(bodies.size).toBe(40);
        for (const item of tasks) {
            expect(item.content, item.title).not.toMatch(/speech outline|givens, constraints|first solution or draft/);
            expect(item.contentKind, item.title).toBe("assignment");
            expect(isLessonLearningItem(item), item.title).toBe(false);
            expect(item.content.length, item.title).toBeGreaterThan(170);
        }
    }
);
