import { acceptHMRUpdate, defineStore } from "pinia";

export interface SubjectGroup {
	title: string;
	subjects: string[];
}

export interface Highlight {
	title: string;
	copy: string;
}

export interface FAQ {
	question: string;
	answer: string;
}

export const useContentStore = defineStore("content", () => {
	const subjectGroups = ref<SubjectGroup[]>([
		{
			title: "Programming & Computer Science",
			subjects: [
				"Python",
				"Scratch",
				"C++",
				"C",
				"Java",
				"Intro to AI and Machine Learning"
			]
		},
		{
			title: "Web Development",
			subjects: [
				"HTML",
				"CSS",
				"JavaScript",
				"TypeScript",
				"Responsive Design"
			]
		},
		{
			title: "STEM & Language",
			subjects: ["Math", "Physics", "Spanish"]
		}
	]);

	const highlights = ref<Highlight[]>([
		{
			title: "Project-Driven Learning",
			copy: "Each course is organized around concrete builds, guided practice, and review checkpoints instead of isolated drills."
		},
		{
			title: "Clear Progression Paths",
			copy: "Students can start with foundations, build confidence through increasingly complex projects, and branch into adjacent topics when ready."
		},
		{
			title: "Flexible Use Cases",
			copy: "The material works for tutoring, classrooms, clubs, guided self-study, or parents supporting learners at home."
		},
		{
			title: "Student-Friendly Structure",
			copy: "Lessons break larger ideas into small steps, making it easier to revisit topics, fill gaps, and practice at a manageable pace."
		},
		{
			title: "Reusable Course Assets",
			copy: "Many modules include starter materials, project prompts, and external references that can be reused across cohorts."
		}
	]);

	const allSubjects = computed<string[]>(() =>
		subjectGroups.value.flatMap(g => g.subjects)
	);

	const faqs = ref<FAQ[]>([
		{
			question: "Do students need prior experience?",
			answer: "Not always. Many courses start from fundamentals. Review the course descriptions, scan the first module, and begin at the level that feels challenging but still approachable."
		},
		{
			question: "Can learners skip ahead?",
			answer: "Yes, if the prerequisites are already solid. The course library is designed so students can inspect later modules and move into a higher level once the earlier concepts feel routine."
		},
		{
			question: "How should groups or classes use the material?",
			answer: "Treat the course outlines as a shared roadmap. Instructors can model new ideas, assign selected projects, and adapt pacing so learners have time to practice and compare solutions."
		}
	]);

	return {
		subjectGroups,
		highlights,
		allSubjects,
		faqs
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(
		acceptHMRUpdate(useContentStore as any, import.meta.hot)
	);
}
