import type {
	PythonIdeMode,
	PythonIdeProjectTemplate
} from "@/modules/pythonIde";

export interface IdeStarter {
	id: string;
	label: string;
	mode: PythonIdeMode;
	template: PythonIdeProjectTemplate;
	category: string;
}
export const ideStarters: IdeStarter[] = [
	{
		id: "swift:blank",
		label: "SwiftUI App Source",
		mode: "swift",
		template: "blank",
		category: "Templates"
	},
	{
		id: "web:blank",
		label: "HTML, CSS and JavaScript",
		mode: "web",
		template: "blank",
		category: "Templates"
	},
	{
		id: "rust:course",
		label: "Rust Cargo Project",
		mode: "rust",
		template: "course",
		category: "Templates"
	},
	{
		id: "assembly:course",
		label: "Assembly and C Caller",
		mode: "assembly",
		template: "course",
		category: "Templates"
	},
	{
		id: "c:course",
		label: "C17 Console Source",
		mode: "c",
		template: "course",
		category: "Templates"
	},
	{
		id: "cpp:course",
		label: "C++ Console Source",
		mode: "cpp",
		template: "course",
		category: "Templates"
	},
	{
		id: "turtle:circle-art",
		label: "Color Circle Art",
		mode: "turtle",
		template: "circle-art",
		category: "Classroom"
	},
	{
		id: "turtle:picasso",
		label: "Picasso Keyboard Painter",
		mode: "turtle",
		template: "picasso",
		category: "Classroom"
	},
	{
		id: "turtle:triangle-motion",
		label: "Triangle Motion Starter",
		mode: "turtle",
		template: "triangle-motion",
		category: "Classroom"
	},
	{
		id: "turtle:neon-trail",
		label: "Neon Trail Painter",
		mode: "turtle",
		template: "neon-trail",
		category: "Classroom"
	},
	{
		id: "turtle:firework-festival",
		label: "Firework Festival",
		mode: "turtle",
		template: "firework-festival",
		category: "Classroom"
	},
	{
		id: "turtle:spiral-galaxy",
		label: "Spiral Galaxy",
		mode: "turtle",
		template: "spiral-galaxy",
		category: "Classroom"
	},
	{
		id: "turtle:turtle-race",
		label: "Turtle Race Day",
		mode: "turtle",
		template: "turtle-race",
		category: "Classroom"
	},
	{
		id: "turtle:flower-garden",
		label: "Flower Garden Clicker",
		mode: "turtle",
		template: "flower-garden",
		category: "Classroom"
	},
	{
		id: "turtle:maze-explorer",
		label: "Maze Explorer",
		mode: "turtle",
		template: "maze-explorer",
		category: "Classroom"
	},
	{
		id: "turtle:classroom-project",
		label: "Classroom Turtle Studio",
		mode: "turtle",
		template: "classroom-project",
		category: "Classroom"
	},
	{
		id: "turtle:outline",
		label: "Python Level 1 Outline",
		mode: "turtle",
		template: "outline",
		category: "Templates"
	},
	{
		id: "pgzero:outline",
		label: "PyGame Zero Outline",
		mode: "pgzero",
		template: "outline",
		category: "Templates"
	},
	{
		id: "java:outline",
		label: "Java Outline",
		mode: "java",
		template: "outline",
		category: "Templates"
	},
	{
		id: "java:bluej",
		label: "BlueJ Java Project",
		mode: "java",
		template: "bluej",
		category: "Templates"
	},
	{
		id: "karel:outline",
		label: "Karel Java Outline",
		mode: "karel",
		template: "outline",
		category: "Templates"
	},
	{
		id: "python:demo",
		label: "Demo Python",
		mode: "python",
		template: "demo",
		category: "Demos"
	},
	{
		id: "data:demo",
		label: "Demo Data / AI",
		mode: "data",
		template: "demo",
		category: "Demos"
	},
	{
		id: "turtle:demo",
		label: "Demo Python Turtle",
		mode: "turtle",
		template: "demo",
		category: "Demos"
	},
	{
		id: "pgzero:demo",
		label: "Demo PyGame Zero",
		mode: "pgzero",
		template: "demo",
		category: "Demos"
	},
	{
		id: "java:demo",
		label: "Demo Java",
		mode: "java",
		template: "demo",
		category: "Demos"
	},
	{
		id: "karel:demo",
		label: "Demo Karel Java",
		mode: "karel",
		template: "demo",
		category: "Demos"
	}
];
