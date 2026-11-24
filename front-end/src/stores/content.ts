// src/stores/content.ts
import { acceptHMRUpdate, defineStore } from "pinia";

export interface SubjectGroup {
	title: string;
	description: string;
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
			title: "Programming Foundations",
			description:
				"Build games and small programs while learning how code works.",
			subjects: [
				"Scratch",
				"Python",
				"Java",
				"JavaScript",
				"C and C++",
				"AP Computer Science A"
			]
		},
		{
			title: "Advanced CS & Systems",
			description:
				"Work through challenging problems and understand the systems behind your code.",
			subjects: [
				"USACO and Algorithms",
				"Data Structures",
				"Design Patterns",
				"Linux and Networking",
				"Systems Security",
				"Assembly"
			]
		},
		{
			title: "Web, Apps & Data",
			description:
				"Create websites and apps, or use code to explore data.",
			subjects: [
				"HTML, CSS, and TypeScript",
				"Web Development Foundations",
				"Swift App Development",
				"Data Science",
				"AI and Machine Learning"
			]
		},
		{
			title: "Math, Science & Spanish",
			description:
				"Make sense of course concepts and apply them to problems and practice.",
			subjects: [
				"Algebra 1 and Algebra 2",
				"Physics",
				"Chemistry",
				"Spanish"
			]
		}
	]);

	const highlights = ref<Highlight[]>([
		{
			title: "Bring the Assignment",
			copy: "Many sessions start with homework, a lab, a bug, or a repo link so class time goes straight to the work that matters."
		},
		{
			title: "Use a Course Path When Needed",
			copy: "If there is no active assignment, sessions can follow a structured course with linked projects and supplemental practice."
		},
		{
			title: "Leave With Written Next Steps",
			copy: "After class, students get short notes that record what was solved, what still needs work, and what to do next."
		},
		{
			title: "Simple Booking and Payment",
			copy: "Your instructor provides scheduling and payment details for your program."
		}
	]);

	const allSubjects = computed<string[]>(() =>
		subjectGroups.value.flatMap(g => g.subjects)
	);

	const faqs = ref<FAQ[]>([
		{
			question: "Who are sessions best for?",
			answer: "They work best for students who already have active coursework, a project, a bug to fix, or a clear skill goal."
		},
		{
			question: "What should we send before the first class?",
			answer: "Any assignment prompt, repo link, screenshot, or short note about the current goal helps class start faster."
		},
		{
			question: "Do sessions follow schoolwork or a course track?",
			answer: "Either. We can work directly from current coursework or use a structured course path when a student needs longer-term progression."
		},
		{
			question: "Are sessions one-on-one?",
			answer: "One learner works directly with an instructor for the full session."
		},
		{
			question: "What if we need to reschedule?",
			answer: "Email as soon as you can and we can move the session to another time."
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
