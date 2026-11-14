export interface CoursePathwayMap {
	id: string;
	title: string;
	category: "coding" | "math" | "science" | "language" | "life";
	kind: "sequence" | "choices";
	summary: string;
	readiness: string;
	stages: { title: string; courseIds: string[] }[];
}

export const coursePathwayMaps: CoursePathwayMap[] = [
	{
		id: "scratch-early-cs",
		title: "Scratch",
		category: "coding",
		kind: "sequence",
		summary: "Create stories and games with visual code.",
		readiness: "Start here with no coding experience.",
		stages: [
			{
				title: "Events and motion",
				courseIds: [
					"scratch-level-1",
					"scratch-level-1-classroom",
					"scratch-level-1-bootcamp"
				]
			},
			{
				title: "Bigger games and stories",
				courseIds: ["scratch-level-2"]
			}
		]
	},
	{
		id: "python-programming",
		title: "Python",
		category: "coding",
		kind: "sequence",
		summary: "Move from drawings and first programs to structured tools.",
		readiness:
			"Level 1 starts from scratch. After structured projects, continue in Python or bridge into Java and C++.",
		stages: [
			{
				title: "First programs",
				courseIds: ["python-level-1", "python-level-1-classroom"]
			},
			{
				title: "Structured projects",
				courseIds: ["python-level-2", "python-level-2-classroom"]
			},
			{
				title: "Choose your next step",
				courseIds: ["python-level-3", "python-to-java-and-cpp-bridge"]
			}
		]
	},
	{
		id: "java-pathway",
		title: "Java",
		category: "coding",
		kind: "sequence",
		summary: "Start with robot worlds, then build with objects.",
		readiness: "No Java experience needed for Level 1.",
		stages: [
			{ title: "Visual foundations", courseIds: ["java-level-1"] },
			{ title: "Classes and objects", courseIds: ["java-level-2"] },
			{ title: "Advanced object design", courseIds: ["java-level-3"] }
		]
	},
	{
		id: "web-javascript",
		title: "JavaScript and the web",
		category: "coding",
		kind: "sequence",
		summary: "Make interactive browser projects and build websites.",
		readiness:
			"Begin with small JavaScript programs; web development builds on HTML, CSS and the DOM.",
		stages: [
			{
				title: "Interactive programs",
				courseIds: ["javascript-level-1-javascript-superstar"]
			},
			{
				title: "Larger projects",
				courseIds: ["javascript-level-2-javascript-master"]
			},
			{
				title: "Build for the web",
				courseIds: ["web-development-foundations"]
			}
		]
	},
	{
		id: "game-development",
		title: "Game development",
		category: "coding",
		kind: "choices",
		summary: "Build a game loop, add controls and playtest.",
		readiness:
			"PyGame uses Python functions, loops and lists. Unity introduces C# and its editor.",
		stages: [
			{
				title: "Python games",
				courseIds: ["pygames", "pygames-classroom"]
			},
			{ title: "Unity and C#", courseIds: ["unity-game-development"] }
		]
	},
	{
		id: "data-ai-ml",
		title: "Data, AI and machine learning",
		category: "coding",
		kind: "choices",
		summary: "Explore data, solve search problems or evaluate models.",
		readiness:
			"Python basics and comfort with algebra and graphs help. Data science prepares you for machine learning.",
		stages: [
			{ title: "Explore data", courseIds: ["data-science-in-python"] },
			{ title: "Search and game AI", courseIds: ["ai-level-1"] },
			{
				title: "Train and evaluate models",
				courseIds: ["machine-learning"]
			}
		]
	},
	{
		id: "cpp-and-algorithms",
		title: "C++ and algorithms",
		category: "coding",
		kind: "sequence",
		summary:
			"Build typed programs, understand memory and solve algorithmic problems.",
		readiness:
			"Start with general programming readiness; later courses expect functions, classes and containers.",
		stages: [
			{ title: "Foundations", courseIds: ["c-level-1"] },
			{ title: "Program design", courseIds: ["cpp-level-2"] },
			{ title: "Larger tools", courseIds: ["cpp-level-3"] },
			{
				title: "Data structures",
				courseIds: ["data-structures-and-algorithms-in-cpp"]
			}
		]
	},
	{
		id: "systems-infrastructure",
		title: "Systems and infrastructure",
		category: "coding",
		kind: "choices",
		summary: "Understand the machinery underneath your programs.",
		readiness:
			"Bring command-line experience and typed programming basics. Choose the area you want to explore.",
		stages: [
			{
				title: "Programs and machines",
				courseIds: ["c-systems-engineering", "assembly"]
			},
			{
				title: "Operating systems and networks",
				courseIds: ["linux-systems", "network-systems"]
			},
			{
				title: "Safer systems code",
				courseIds: ["rust-systems-security"]
			}
		]
	},
	{
		id: "swift-mobile",
		title: "Swift and mobile apps",
		category: "coding",
		kind: "choices",
		summary: "Turn an app idea into screens, state and navigation.",
		readiness:
			"General programming readiness and a local IDE. No prior Swift required.",
		stages: [
			{
				title: "Build an app",
				courseIds: ["intro-to-swift-app-development"]
			}
		]
	},
	{
		id: "ap-csa",
		title: "AP Computer Science A",
		category: "coding",
		kind: "choices",
		summary: "Practice Java reasoning, written solutions and exam skills.",
		readiness:
			"Prior programming helps; the course teaches AP-scoped Java.",
		stages: [
			{
				title: "Java and exam practice",
				courseIds: ["ap-computer-science-a"]
			}
		]
	},
	{
		id: "usaco",
		title: "Competitive programming",
		category: "coding",
		kind: "sequence",
		summary: "Build a problem-solving toolkit for USACO.",
		readiness:
			"Comfort with loops, arrays, strings, maps and sets before Bronze.",
		stages: [
			{
				title: "Bronze",
				courseIds: ["usaco-bronze", "usaco-bronze-on-demand"]
			},
			{ title: "Silver", courseIds: ["usaco-silver"] },
			{ title: "Gold", courseIds: ["usaco-gold"] }
		]
	},
	{
		id: "design-patterns",
		title: "Design patterns",
		category: "coding",
		kind: "choices",
		summary:
			"Refactor working code and give objects clearer responsibilities.",
		readiness:
			"For students already comfortable with classes. Choose your language.",
		stages: [
			{
				title: "Java",
				courseIds: [
					"design-patterns-in-java",
					"design-patterns-in-java-part-2"
				]
			},
			{ title: "C++", courseIds: ["design-patterns-in-cpp"] },
			{ title: "Python", courseIds: ["pythonic-design-patterns"] }
		]
	},
	{
		id: "security",
		title: "Security",
		category: "coding",
		kind: "choices",
		summary:
			"Investigate risks and practice defensive fixes in safe local labs.",
		readiness:
			"Command-line, networking or systems experience appropriate to the chosen course.",
		stages: [
			{ title: "Network defenses", courseIds: ["network-security"] },
			{
				title: "Low-level security",
				courseIds: ["low-level-security", "low-level-security-part-2"]
			}
		]
	},
	{
		id: "algebra",
		title: "Math",
		category: "math",
		kind: "sequence",
		summary:
			"Connect numbers, equations and graphs, from elementary math to calculus.",
		readiness:
			"Start at the stage that matches your current coursework and skills.",
		stages: [
			{
				title: "Number foundations",
				courseIds: [
					"early-elementary-a-math",
					"early-elementary-b-math",
					"late-elementary-a-math",
					"late-elementary-b-math"
				]
			},
			{
				title: "Pre-algebra",
				courseIds: ["pre-algebra-a", "pre-algebra-b"]
			},
			{
				title: "Algebra and geometry",
				courseIds: [
					"algebra-1a",
					"algebra-1b",
					"geometry-a",
					"geometry-b",
					"algebra-2a",
					"algebra-2b"
				]
			},
			{
				title: "Pre-calculus",
				courseIds: ["pre-calculus-a", "pre-calculus-b"]
			},
			{ title: "Calculus", courseIds: ["ap-calculus"] }
		]
	},
	{
		id: "science",
		title: "Science",
		category: "science",
		kind: "choices",
		summary:
			"Use diagrams, data and simulations to explain the natural world.",
		readiness:
			"Choose a foundation or a subject that fits your schoolwork. No physical lab required.",
		stages: [
			{
				title: "Foundations",
				courseIds: [
					"elementary-science",
					"middle-school-integrated-science"
				]
			},
			{
				title: "Environment",
				courseIds: ["intro-to-environmental-science"]
			},
			{
				title: "Chemistry and physics",
				courseIds: [
					"intro-to-chemistry",
					"intro-to-physics",
					"physics-level-2"
				]
			}
		]
	},
	{
		id: "english-literacy",
		title: "Grammar and public speaking",
		category: "language",
		kind: "choices",
		summary: "Build clear sentences and effective presentations.",
		readiness:
			"Choose sentence-level work or practice speaking to an audience.",
		stages: [
			{
				title: "Grammar and mechanics",
				courseIds: ["middle-school-c-grammar"]
			},
			{
				title: "Public speaking",
				courseIds: ["introduction-to-public-speaking"]
			}
		]
	},
	{
		id: "finance-entrepreneurship",
		title: "Finance and entrepreneurship",
		category: "life",
		kind: "choices",
		summary:
			"Explore everyday money decisions and develop a business idea.",
		readiness: "Comfort with percentages, tables and explaining tradeoffs.",
		stages: [
			{
				title: "Everyday money",
				courseIds: ["smart-money-personal-finance"]
			},
			{
				title: "Investing concepts",
				courseIds: ["money-minded-investing"]
			},
			{ title: "Business ideas", courseIds: ["entrepreneurship-101"] }
		]
	}
];
