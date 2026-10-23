import type { RawCourse } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";

const webDevelopmentFoundationsSourceCourse: RawCourse = {
	name: "Web Development Foundations",
	modules: [
		{
			title: "WDF0 Setup and Tooling",
			curriculum: [
				{
					title: "Normalize File-Based Local Development Early",
					content:
						"The course uses real project folders on disk rather than only browser playgrounds. The editor is important, but the core habit is learning to manage files, terminals, local servers, and project structure in a way that prepares the work for frameworks, back ends, hosting, and team collaboration."
				},
				{
					title: "Preferred IDEs and Core Extensions",
					content:
						"`WebStorm` and `VS Code` are both appropriate choices when the workflow has strong support for project navigation, linting, formatting, Git, and integrated terminals. In VS Code, `ESLint`, `Prettier`, and `EditorConfig` are useful early defaults, with `GitLens` or remote-development tools added only when they clarify the workflow rather than distract from it."
				},
				{
					title: "macOS and Windows Walkthroughs",
					content:
						"On macOS, install Node.js LTS, the chosen editor, and verify that Node, npm, and a local dev server all run before moving into frameworks or deployment. On Windows, add early practice with path handling, terminals, and environment variables so hosting and backend topics do not feel like a second course with different rules."
				},
				{
					title: "Course Workspace and Folder Structure",
					content:
						"Create a workspace with folders for `html-css`, `javascript`, `full-stack`, and `deployment` so static front-end work can evolve into server-backed projects without losing organization. This structure also makes it concrete that front-end code, server code, deployment notes, and operational files often belong in related but distinct places."
				},
				{
					title: "Early Module on Browser Devtools, Git, npm, and Project Structure",
					content:
						"Before deeper framework or hosting topics appear, browser devtools, Git/GitHub basics, npm, and project layout need to become recurring strands. Deployment and back-end material feel connected when inspection, version control, and package management are normal development habits from the beginning."
				},
				{
					title: "WDF0 Setup and Tooling: Core Project",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF0 Setup and Tooling",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-05-wdf0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-05-wdf0-setup-and-tooling/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Workflow Notebook: Setup and Tooling",
					content:
						"Keep a running notebook for setup and tooling that records the commands, editor setup, files changed, deployment assumptions, and debugging decisions made in that part of the course. Focus especially on editor setup, terminal usage, npm verification, and local server startup to build habits that carry from local work into real hosting and operations.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-05-wdf0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-05-wdf0-setup-and-tooling/solution"
				},
				{
					title: "Setup and Tooling Transfer Practice",
					aliases: ["Setup and Tooling supplemental 2"],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-01-wdf0-setup-and-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-01-wdf0-setup-and-tooling-supplemental-2/solution"
				},
				{
					title: "Setup and Tooling Extension Practice",
					aliases: ["Setup and Tooling supplemental 3"],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-02-wdf0-setup-and-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-02-wdf0-setup-and-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "WDF1 Positioning, Goals, and Suggested Course Family",
			curriculum: [
				{
					title: "JavaScript Path Into Web Development",
					aliases: [
						"Why the JavaScript Path Should Expand into Web Development"
					],
					content:
						"Position this course as the bridge from browser-focused JavaScript to full web-development fluency. The current JavaScript courses are still valuable for programming, DOM work, and browser APIs, and now those skills connect to project structure, back-end services, databases, deployment, hosting, and operations."
				},
				{
					title: "Main Goals of the Expanded Path",
					content:
						"The expanded path has four main goals: turn browser-focused JavaScript into full web-development fluency, add practical hosting and deployment knowledge, connect front end, back end, databases, and networking, and prepare for publishing real projects rather than only local demos. These goals keep each new unit connected to the rest of the stack."
				},
				{
					title: "Suggested Course Family and Placement",
					content:
						"The broader family includes `JavaScript Level 1`, `JavaScript Level 2`, `Web Development Foundations`, `Full-Stack Web Apps`, and optionally `Deployment and Cloud Hosting`. This is the first place where those later directions become visible and where front-end practice starts growing into publishing and operations work."
				},
				{
					title: "Entry Expectations from JavaScript Level 1 and 2",
					content:
						"This course assumes comfort reading and writing small-to-medium JavaScript programs, working with HTML and CSS, manipulating the DOM, responding to events, and reasoning about APIs and basic data models. It can briefly reinforce those ideas without making review the center of the course. The real transition is from `browser-only projects` into `file-based local development, Git, npm, dev servers, back-end services, databases, and deployment`. Strong JavaScript Level 2 preparation may make the early setup material move quickly, but workflow and environment habits remain part of the curriculum rather than optional side topics."
				},
				{
					title: "What This Course Is Not",
					content:
						"The course is not only about memorizing frameworks or copying tutorial steps. It is about learning repeatable workflows, strong project boundaries, debugging discipline, and enough operational understanding to explain how a site is built, served, configured, and observed after launch."
				},
				{
					title: "WDF1 Positioning, Goals, and Suggested Course Family: Core Project",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"WDF1 Positioning, Goals, and Suggested Course Family",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-06-wdf1-positioning-goals-and-suggested-course-family/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-06-wdf1-positioning-goals-and-suggested-course-family/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Workflow Notebook: Positioning and Goals",
					content:
						"Keep a running notebook for positioning and goals that records the commands, editor setup, files changed, deployment assumptions, and debugging decisions made in that part of the course. Focus especially on how each new topic connects back to publishing, hosting, or operations to build habits that carry from local work into real hosting and operations.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-06-wdf1-positioning-goals-and-suggested-course-family/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-06-wdf1-positioning-goals-and-suggested-course-family/solution"
				},
				{
					title: "Course Path Transfer Practice",
					aliases: [
						"Positioning, Goals, and Suggested Course Family supplemental 2"
					],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"WDF1 Positioning, Goals, and Suggested Course Family",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-03-wdf1-positioning-goals-and-suggested-course-family-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-03-wdf1-positioning-goals-and-suggested-course-family-supplemental-2/solution"
				},
				{
					title: "Course Path Extension Practice",
					aliases: [
						"Positioning, Goals, and Suggested Course Family supplemental 3"
					],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"WDF1 Positioning, Goals, and Suggested Course Family",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-04-wdf1-positioning-goals-and-suggested-course-family-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-04-wdf1-positioning-goals-and-suggested-course-family-supplemental-3/solution"
				}
			]
		},
		{
			title: "WDF2 Stage 1: Strengthen the Existing JavaScript Courses",
			curriculum: [
				{
					title: "Keep HTML, CSS, DOM, and APIs as the Base",
					content:
						"Browser fundamentals remain the technical base of the path: HTML, CSS, DOM work, and APIs. Those fundamentals now live inside real project folders so navigation, file structure, asset management, version control, and browser logic develop together."
				},
				{
					title: "Use More File-Based Local Projects, Not Only CodePen",
					content:
						"Shift toward local, file-based projects with deliberate naming, folders, and scripts. This matters because deployment, build tools, frameworks, and full-stack work all assume fluency with creating, editing, running, and organizing a project on disk."
				},
				{
					title: "Add Git and GitHub as Normal Workflow Tools",
					content:
						'Repository initialization, commit hygiene, branch awareness, and remote publishing belong inside normal development rather than after the code is "done." Git supports collaboration, but it also makes safe experimentation, rollback, and project history practical during longer builds.'
				},
				{
					title: "Make Browser Devtools a Recurring Strand",
					content:
						"Use devtools in every major JavaScript or browser module so debugging becomes routine. Console inspection, network tabs, layout inspection, storage inspection, and source maps become part of the normal development loop, especially before frameworks and back ends make the debugging surface larger."
				},
				{
					title: "WDF2 Stage 1: Strengthen the Existing JavaScript Courses: Core Project",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"WDF2 Stage 1: Strengthen the Existing JavaScript Courses",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-07-wdf2-stage-1-strengthen-the-existing-javascript-courses/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-07-wdf2-stage-1-strengthen-the-existing-javascript-courses/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Workflow Notebook: Strengthen the Existing JavaScript Courses",
					content:
						"Keep a running notebook for the existing JavaScript course bridge that records the commands, editor setup, files changed, deployment assumptions, and debugging decisions made in that part of the course. Focus especially on Git checkpoints, local project organization, and devtools usage to build habits that carry from local work into real hosting and operations.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-07-wdf2-stage-1-strengthen-the-existing-javascript-courses/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-07-wdf2-stage-1-strengthen-the-existing-javascript-courses/solution"
				},
				{
					title: "JavaScript Bridge Transfer Practice",
					aliases: [
						"Stage 1: Strengthen the Existing JavaScript Courses supplemental 2"
					],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"WDF2 Stage 1: Strengthen the Existing JavaScript Courses",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-05-wdf2-stage-1-strengthen-the-existing-javascript-courses-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-05-wdf2-stage-1-strengthen-the-existing-javascript-courses-supplemental-2/solution"
				},
				{
					title: "JavaScript Bridge Extension Practice",
					aliases: [
						"Stage 1: Strengthen the Existing JavaScript Courses supplemental 3"
					],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"WDF2 Stage 1: Strengthen the Existing JavaScript Courses",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-06-wdf2-stage-1-strengthen-the-existing-javascript-courses-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-06-wdf2-stage-1-strengthen-the-existing-javascript-courses-supplemental-3/solution"
				}
			]
		},
		{
			title: "WDF3 Stage 2: Web Development Foundations",
			curriculum: [
				{
					title: "Project Structure and Front-End Workspace Habits",
					content:
						"Separate HTML, CSS, JavaScript, assets, configuration, and build outputs so a project stays understandable as it grows. Naming conventions, folder boundaries, and deliberate entry points become practical engineering habits because hosting and build tooling depend on that structure later."
				},
				{
					title: "npm and Package Management",
					content:
						"npm is the mechanism for package installation, scripts, and local tooling rather than a magical prerequisite for frameworks. `package.json` records project behavior, dependencies and devDependencies serve different purposes, and scripts like `dev`, `build`, and `start` make common tasks repeatable."
				},
				{
					title: "Modules, Bundlers, and Local Dev Servers at a Gentle Level",
					content:
						"Explain JavaScript modules, bundlers, and local dev servers without overwhelming the lesson with toolchain internals. The important point is that modern web development often turns many source files into a smaller deployable build and that a local server is part of the workflow even for front-end-only projects."
				},
				{
					title: "Environment Variables, Forms, and Validation",
					content:
						"Environment variables are configuration boundaries, not secret magic strings. Pair them with forms and validation so user input and deployment configuration are treated early as data surfaces that need explicit handling, clear defaults, and careful debugging."
				},
				{
					title: "WDF3 Stage 2: Web Development Foundations: Core Project",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"WDF3 Stage 2: Web Development Foundations",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF1-Portfolio-Custom-Domain/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF1-Portfolio-Custom-Domain/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Portfolio Site with Custom Domain Preparation",
					content:
						"The portfolio lab turns a file-based front-end project into something ready for a local dev server, static build, and later custom-domain deployment. The work emphasizes npm scripts, asset organization, responsive layout, and a publishing checklist instead of treating the portfolio as a throwaway page.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF1-Portfolio-Custom-Domain/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF1-Portfolio-Custom-Domain/solution"
				},
				{
					title: "Web Foundations Transfer Practice",
					aliases: [
						"Stage 2: Web Development Foundations supplemental 2"
					],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"WDF3 Stage 2: Web Development Foundations",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-07-wdf3-stage-2-web-development-foundations-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-07-wdf3-stage-2-web-development-foundations-supplemental-2/solution"
				},
				{
					title: "Web Foundations Extension Practice",
					aliases: [
						"Stage 2: Web Development Foundations supplemental 3"
					],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"WDF3 Stage 2: Web Development Foundations",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-08-wdf3-stage-2-web-development-foundations-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-08-wdf3-stage-2-web-development-foundations-supplemental-3/solution"
				}
			]
		},
		{
			title: "WDF4 Stage 3: Front-End Applications",
			curriculum: [
				{
					title: "Modern UI Composition",
					content:
						"Move from small DOM exercises to reusable UI composition through views, components, states, and boundaries. Even before a specific framework becomes central, modern front-end code is organized around reusable parts that make complex interfaces easier to debug and extend."
				},
				{
					title: "Routing and Multi-View Thinking",
					content:
						"Client-side routing represents multiple screens or views in one application without reloading the entire page. Connect routing to information architecture, URL design, and the need for deliberate navigation structures rather than one growing script file."
				},
				{
					title: "State Management Basics and Async Data Loading",
					content:
						"Explain local state, shared state, and asynchronous data loading at a practical level. Start with where data lives, how it changes, and how to model loading, success, empty, and error states without confusing the user interface or the developer."
				},
				{
					title: "Accessibility and Responsive Design as Core Requirements",
					content:
						"Treat accessibility and responsive design as first-class constraints in front-end work rather than polish for the end. Practice semantic HTML, keyboard access, readable contrast, flexible layouts, and content priorities across screen sizes so app work is credible outside a demo environment."
				},
				{
					title: "WDF4 Stage 3: Front-End Applications: Core Project",
					content:
						"Build the required front-end application from a supplied local event fixture before connecting a server. Model ready, loading, connected, empty, error, and reconnecting states; render messages as safe text; cap the visible history; and verify keyboard, pointer, focus, status, narrow-width, and reduced-motion behavior. The preserved Socket.IO chat is a teaching skeleton and an optional revisit after WDF5 introduces server request, validation, and lifecycle boundaries.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF4-Realtime-Chat-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF4-Realtime-Chat-App/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Real-Time Chat or Notification App",
					content:
						"Revisit the real-time chat lab only after WDF5. Keep it on loopback with fictional names and messages, validate and cap nicknames and message text on both sides, bound connection and history growth, render text safely, expose disconnect and reconnect states, and record moderation and abuse-prevention limits. The source is a teaching skeleton, not a production chat service.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF4-Realtime-Chat-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF4-Realtime-Chat-App/solution"
				},
				{
					title: "Front-End Apps Transfer Practice",
					aliases: ["Stage 3: Front End Applications supplemental 2"],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF4 Stage 3: Front-End Applications",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-09-wdf4-stage-3-front-end-applications-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-09-wdf4-stage-3-front-end-applications-supplemental-2/solution"
				},
				{
					title: "Front-End Apps Extension Practice",
					aliases: ["Stage 3: Front End Applications supplemental 3"],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF4 Stage 3: Front-End Applications",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-10-wdf4-stage-3-front-end-applications-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-10-wdf4-stage-3-front-end-applications-supplemental-3/solution"
				}
			]
		},
		{
			title: "WDF5 Stage 4: Back-End Basics",
			curriculum: [
				{
					title: "Node.js Runtime and Server-Side JavaScript",
					content:
						"Node.js is the runtime that lets JavaScript move from the browser into server work, tooling, and automation. The same language now runs in a different environment with different APIs, different security boundaries, and different responsibilities for input handling and process lifecycle."
				},
				{
					title: "Express or Fastify as the API Surface",
					content:
						"Use Express or Fastify to show how server applications define routes, parse requests, return responses, and structure middleware or validation steps. The framework is not the end goal; the goal is modeling how a browser or front-end app talks to a server in a predictable, inspectable way."
				},
				{
					title: "REST APIs, Request Validation, and Error Shapes",
					content:
						'Simple RESTful patterns need to be paired immediately with request validation and explicit error handling. An API is more than a route that "works"; it is a contract that must handle missing fields, invalid payloads, malformed input, and repeatable response shapes.'
				},
				{
					title: "Auth Basics and Session vs Token Concepts",
					content:
						"Authentication starts conceptually by distinguishing identity, authorization, sessions, and tokens. A complete production auth system is not required here, but the material explains why login state, cookies, bearer tokens, and protected routes change the design of both front-end and back-end code."
				},
				{
					title: "WDF5 Stage 4: Back-End Basics: Core Project",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF5 Stage 4: Back-End Basics",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF3-Booking-Contact-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF3-Booking-Contact-App/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Booking or Contact App with Email Integration",
					content:
						"Use the booking/contact lab to make request validation, environment variables, and server-side delivery logic concrete. Handle fictional form input on the client, validate and cap it again on the server, return stable error shapes, and use a stream or test transport by default. SMTP credentials remain server-side and ignored, real delivery is not required, and the verification matrix includes malformed input, repeated requests, timeout, rate or abuse limits, delivery failure, redacted logs, and clean recovery.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF3-Booking-Contact-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF3-Booking-Contact-App/solution"
				},
				{
					title: "Back-End Basics Transfer Practice",
					aliases: ["Stage 4: Back End Basics supplemental 2"],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF5 Stage 4: Back-End Basics",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-11-wdf5-stage-4-back-end-basics-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-11-wdf5-stage-4-back-end-basics-supplemental-2/solution"
				},
				{
					title: "Back-End Basics Extension Practice",
					aliases: ["Stage 4: Back End Basics supplemental 3"],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF5 Stage 4: Back-End Basics",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-12-wdf5-stage-4-back-end-basics-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-12-wdf5-stage-4-back-end-basics-supplemental-3/solution"
				}
			]
		},
		{
			title: "WDF6 Stage 5: Databases and Data Models",
			curriculum: [
				{
					title: "MongoDB Basics and Data Modeling",
					content:
						"MongoDB is a practical entry point into document databases and data models. Learn what a collection and document are, how application code maps user-facing features onto stored data, and why schema thinking still matters even in a NoSQL environment."
				},
				{
					title: "Schemas, Validation, and CRUD",
					content:
						'Use a schema layer such as Mongoose to connect data modeling to validation and CRUD routes. The lesson is that storage is not just "put data somewhere"; it is defining what valid data looks like, how it is created, read, updated, and deleted, and how those constraints improve application reliability.'
				},
				{
					title: "Indexes at a High Level",
					content:
						"Handle indexes conceptually before diving into database internals. Indexes trade extra storage and write cost for faster queries, and data shape plus access patterns influence performance long before a project becomes large."
				},
				{
					title: "When to Choose SQL vs NoSQL",
					content:
						"Use a comparison framework instead of rigid rules. Structured relationships, transactional needs, and reporting often push toward SQL, while flexible document shapes and certain rapid prototypes can fit NoSQL well. The right choice depends on the product's data behavior and future needs."
				},
				{
					title: "WDF6 Stage 5: Databases and Data Models: Core Project",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF6 Stage 5: Databases and Data Models",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF2-Notes-App-with-MongoDB/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF2-Notes-App-with-MongoDB/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Blog or Notes App with MongoDB",
					content:
						"The notes app lab combines MongoDB basics, schemas, validation, and CRUD in a full-stack workflow. Use fictional notes and a supplied in-memory adapter first, then optionally switch to an isolated local MongoDB database. The finished explanation traces browser, API, validation, stable IDs, storage, index choice, duplicate and malformed records, unavailable-database behavior, deterministic reset, backup, and restore without requiring a cloud database or real personal notes.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF2-Notes-App-with-MongoDB/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF2-Notes-App-with-MongoDB/solution"
				},
				{
					title: "Database Models Transfer Practice",
					aliases: [
						"Stage 5: Databases and Data Models supplemental 2"
					],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF6 Stage 5: Databases and Data Models",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-13-wdf6-stage-5-databases-and-data-models-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-13-wdf6-stage-5-databases-and-data-models-supplemental-2/solution"
				},
				{
					title: "Database Models Extension Practice",
					aliases: [
						"Stage 5: Databases and Data Models supplemental 3"
					],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF6 Stage 5: Databases and Data Models",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-14-wdf6-stage-5-databases-and-data-models-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-14-wdf6-stage-5-databases-and-data-models-supplemental-3/solution"
				}
			]
		},
		{
			title: "WDF7 Stage 6: Hosting and Deployment",
			curriculum: [
				{
					title: "Domain Names, DNS, and Deployment Targets",
					content:
						'Domain names, DNS records, and deployment targets fit together so publishing feels concrete. A deployed project is not just "on the internet"; it has a hosting surface, a domain, DNS configuration, environment settings, and a verification story after each change.'
				},
				{
					title: "Static Hosting vs App Hosting",
					content:
						"Explain the difference between static hosting and application hosting in terms of build output, runtime needs, scalability, and operational complexity. This is where the course distinguishes why a front-end portfolio can live on a static platform while a server-backed app needs a runtime environment, logs, and often a database connection."
				},
				{
					title: "Reverse Proxies, Environment Configuration, Monitoring, and Logs",
					content:
						"Reverse proxies, environment configuration, monitoring, and logs are part of deployment rather than optional operations trivia. Deployment quality depends on observability, configuration boundaries, and the ability to distinguish front-end failures from API failures after the project leaves localhost."
				},
				{
					title: "Deployment as a Repeatable Process",
					content:
						"Make deployment repeatable through build scripts, environment-specific configuration, domain verification, and post-deploy checks. End this stage able to describe what they would test immediately after shipping a site or app and what evidence they would collect if something broke."
				},
				{
					title: "WDF7 Stage 6: Hosting and Deployment: Core Project",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF7 Stage 6: Hosting and Deployment",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF5-Separate-Deployment-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF5-Separate-Deployment-Lab/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Ship a Front End and Back End Separately",
					content:
						"Use the deployment lab to separate front-end and back-end hosting concerns on purpose. Complete the required route with local build artifacts and configuration review: map the API base URL, CORS origins, proxy trust, TLS termination, health and readiness, redacted logs, resource limits, backup, restore, smoke checks, and rollback. Public hosting, production DNS, and a custom domain are optional extensions on learner-owned services with fictional data.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF5-Separate-Deployment-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF5-Separate-Deployment-Lab/solution"
				},
				{
					title: "Hosting Deployment Transfer Practice",
					aliases: ["Stage 6: Hosting and Deployment supplemental 2"],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF7 Stage 6: Hosting and Deployment",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-15-wdf7-stage-6-hosting-and-deployment-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-15-wdf7-stage-6-hosting-and-deployment-supplemental-2/solution"
				},
				{
					title: "Hosting Deployment Extension Practice",
					aliases: ["Stage 6: Hosting and Deployment supplemental 3"],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF7 Stage 6: Hosting and Deployment",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-16-wdf7-stage-6-hosting-and-deployment-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-16-wdf7-stage-6-hosting-and-deployment-supplemental-3/solution"
				}
			]
		},
		{
			title: "WDF8 Hosting and Operations Topics to Add",
			curriculum: [
				{
					title: "Linux and Server Basics for Web Developers",
					content:
						"SSH, service processes, logs, environment files, and file locations keep deployment from stopping at a platform dashboard. Web developers need enough Linux and server structure to connect code to runtime files, service processes, log locations, and safe operational changes."
				},
				{
					title: "Cloud and Platform Ideas",
					content:
						"Front-end deployment platforms include Vercel or Netlify, while back-end targets include Render, Fly.io, Railway, or a VPS. Higher-level AWS ideas include EC2 for servers, S3 for static hosting, CloudFront conceptually, Route 53 for DNS, and security groups or IAM as controlled access surfaces rather than memorization-heavy topics."
				},
				{
					title: "Database Hosting and Recovery Basics",
					content:
						"MongoDB Atlas and local MongoDB are related but different development and hosted contexts. Backup and restore basics frame data hosting as reliability planning, not just a connection string."
				},
				{
					title: "Use Hosting Topics to Connect the Whole Stack",
					content:
						"Hosting topics unify earlier lessons by showing how front-end bundles, Node servers, databases, domains, environment variables, and logs all meet in production. A strong explanation names the likely deployment surface and operational responsibility for each layer of a small web product."
				},
				{
					title: "WDF8 Hosting and Operations Topics to Add: Core Project",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"WDF8 Hosting and Operations Topics to Add",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-08-wdf8-hosting-and-operations-topics-to-add/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-08-wdf8-hosting-and-operations-topics-to-add/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Workflow Notebook: Hosting and Operations Topics",
					content:
						"Keep a running notebook for hosting and operations topics that records the commands, editor setup, files changed, deployment assumptions, and debugging decisions made in that part of the course. Focus especially on platform choices, service ownership, log locations, and recovery planning to build habits that carry from local work into real hosting and operations.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-08-wdf8-hosting-and-operations-topics-to-add/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-08-wdf8-hosting-and-operations-topics-to-add/solution"
				},
				{
					title: "Hosting Ops Transfer Practice",
					aliases: [
						"Hosting and Operations Topics to Add supplemental 2"
					],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"WDF8 Hosting and Operations Topics to Add",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-17-wdf8-hosting-and-operations-topics-to-add-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-17-wdf8-hosting-and-operations-topics-to-add-supplemental-2/solution"
				},
				{
					title: "Hosting Ops Extension Practice",
					aliases: [
						"Hosting and Operations Topics to Add supplemental 3"
					],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"WDF8 Hosting and Operations Topics to Add",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-18-wdf8-hosting-and-operations-topics-to-add-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-18-wdf8-hosting-and-operations-topics-to-add-supplemental-3/solution"
				}
			]
		},
		{
			title: "WDF9 Good Practical Projects",
			curriculum: [
				{
					title: "Project: Portfolio Site with Custom Domain",
					content:
						"Build a portfolio site that is more than a front-end design exercise by preparing it for static hosting, domain configuration, and post-launch verification. This project is the cleanest place to connect layout, accessibility, asset organization, npm scripts, and real publishing.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF1-Portfolio-Custom-Domain/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF1-Portfolio-Custom-Domain/solution"
				},
				{
					title: "Project: Blog or Notes App with MongoDB",
					content:
						"Use a notes-style application to connect database modeling, CRUD routes, browser-side rendering, and validation. Leave the project able to describe both the user-facing behavior and the server/database flow underneath it.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF2-Notes-App-with-MongoDB/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF2-Notes-App-with-MongoDB/solution"
				},
				{
					title: "Project: Booking or Contact App with Email Integration",
					content:
						"Forms do not end at the browser: contact requests need validation, transport, environment-based configuration, and a secure boundary between public inputs and private server credentials.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF3-Booking-Contact-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF3-Booking-Contact-App/solution"
				},
				{
					title: "Project: Real-Time Chat or Notification App",
					content:
						"A real-time project connects long-lived connections, event-driven UI updates, and the operational reality that interactive systems still need logs, deployment planning, and debugging discipline.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF4-Realtime-Chat-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF4-Realtime-Chat-App/solution"
				},
				{
					title: "Project: Deployment Lab for Separate Front-End and Back-End Shipping",
					content:
						'A split deployment project ties hosting, DNS, reverse proxies, environment configuration, and monitoring together. The final explanation moves beyond "my app works locally" into "I can explain how the pieces are hosted, connected, and verified after release."',
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF5-Separate-Deployment-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF5-Separate-Deployment-Lab/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Workflow Notebook: Good Practical Projects",
					content:
						"Keep a running notebook for practical project work that records the commands, editor setup, files changed, deployment assumptions, and debugging decisions made in that part of the course. Focus especially on how each project reinforces hosting, debugging, and stack-wide reasoning to build habits that carry from local work into real hosting and operations.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF1-Portfolio-Custom-Domain/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF1-Portfolio-Custom-Domain/solution"
				},
				{
					title: "Practical Projects Transfer Practice",
					aliases: ["Good Practical Projects supplemental 2"],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF9 Good Practical Projects",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-19-wdf9-good-practical-projects-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-19-wdf9-good-practical-projects-supplemental-2/solution"
				},
				{
					title: "Practical Projects Extension Practice",
					aliases: ["Good Practical Projects supplemental 3"],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF9 Good Practical Projects",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-20-wdf9-good-practical-projects-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-20-wdf9-good-practical-projects-supplemental-3/solution"
				}
			]
		},
		{
			title: "WDF10 Suggested Advanced Strand",
			curriculum: [
				{
					title: "Logs and Uptime",
					content:
						"Add a follow-up strand focused on actual production operations, beginning with logs and uptime. Once a project is live, part of the job is making sure it stays reachable, emits useful signals, and can be diagnosed when users report problems."
				},
				{
					title: "TLS and Reverse Proxies",
					content:
						"TLS and reverse proxies are understood at the operational level: where HTTPS termination often happens, why certificates matter, and how a reverse proxy can stand between public traffic and an app process. This gives deployment architecture more meaning than a collection of copied config snippets."
				},
				{
					title: "Backups, Environment Rotation, and Performance Basics",
					content:
						"Backups, environment rotation, and performance basics are a natural next step after published full-stack work. Stable production systems are not only built; they are maintained, rotated, backed up, and observed over time."
				},
				{
					title: "Move from Deployment to Operations Thinking",
					content:
						"This advanced strand frames deployment as the start of operational responsibility, not the end of the project. Completion evidence needs an explanation of how to monitor, protect, and maintain a small production system after launch."
				},
				{
					title: "WDF10 Suggested Advanced Strand: Core Project",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF10 Suggested Advanced Strand",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-09-wdf10-suggested-advanced-strand/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-09-wdf10-suggested-advanced-strand/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Workflow Notebook: Suggested Advanced Strand",
					content:
						"Keep a running notebook for the advanced operations strand that records the commands, editor setup, files changed, deployment assumptions, and debugging decisions made in that part of the course. Focus especially on logs, uptime, certificate handling, backups, and environment rotation to build habits that carry from local work into real hosting and operations.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-09-wdf10-suggested-advanced-strand/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-09-wdf10-suggested-advanced-strand/solution"
				},
				{
					title: "Operations Strand Transfer Practice",
					aliases: ["Suggested Advanced Strand supplemental 2"],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF10 Suggested Advanced Strand",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-21-wdf10-suggested-advanced-strand-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-21-wdf10-suggested-advanced-strand-supplemental-2/solution"
				},
				{
					title: "Operations Strand Extension Practice",
					aliases: ["Suggested Advanced Strand supplemental 3"],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF10 Suggested Advanced Strand",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-22-wdf10-suggested-advanced-strand-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-22-wdf10-suggested-advanced-strand-supplemental-3/solution"
				}
			]
		},
		{
			title: "WDF11 Integration with Network Topics",
			curriculum: [
				{
					title: "Ports and Listening Services",
					content:
						"Cross-link this course with networking by treating ports and listening services as concrete operational facts. Browsers, APIs, databases, and reverse proxies all communicate through explicit ports, and many deployment bugs start with services not listening where the rest of the system expects them to be."
				},
				{
					title: "DNS and Domain Routing",
					content:
						"DNS and domain routing are the networking layer that makes published sites and APIs reachable. Connect hostname records to the hosting platform or server that answers them, then explain why DNS changes can affect deployment timing and rollback strategy."
				},
				{
					title: "TLS, HTTPS, and Trust Boundaries",
					content:
						"Use TLS and HTTPS to connect networking, security, and deployment. Secure transport matters for modern browsers, cookies, API access, and user trust, and the point where TLS terminates changes which system layer is responsible for certificates and decrypted traffic."
				},
				{
					title: "Firewalls, Security Groups, and localhost vs LAN vs Public Deployment",
					content:
						"`localhost`, LAN-accessible services, and public deployments expose different audiences and risk levels. Firewalls and security groups make that boundary explicit, and exposure level changes the security and operational assumptions of the app even when the code itself has not changed."
				},
				{
					title: "WDF11 Integration with Network Topics: Core Project",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF11 Integration with Network Topics",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-10-wdf11-integration-with-network-topics/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-10-wdf11-integration-with-network-topics/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Workflow Notebook: Integration with Network Topics",
					content:
						"Keep a running notebook for network-topic integration that records the commands, editor setup, files changed, deployment assumptions, and debugging decisions made in that part of the course. Focus especially on ports, DNS, HTTPS boundaries, and network exposure differences to build habits that carry from local work into real hosting and operations.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-10-wdf11-integration-with-network-topics/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-10-wdf11-integration-with-network-topics/solution"
				},
				{
					title: "Network Integration Transfer Practice",
					aliases: ["Integration with Network Topics supplemental 2"],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF11 Integration with Network Topics",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-23-wdf11-integration-with-network-topics-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-23-wdf11-integration-with-network-topics-supplemental-2/solution"
				},
				{
					title: "Network Integration Extension Practice",
					aliases: ["Integration with Network Topics supplemental 3"],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF11 Integration with Network Topics",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-24-wdf11-integration-with-network-topics-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-24-wdf11-integration-with-network-topics-supplemental-3/solution"
				}
			]
		},
		{
			title: "WDF12 Expansion Ideas and Next Steps",
			curriculum: [
				{
					title: "Docker and Containers",
					content:
						"Offer Docker and containers as a follow-on topic after project boundaries, servers, and deployment are clear. Containers make more sense once reproducible environments, service boundaries, and startup configuration have practical context."
				},
				{
					title: "CI/CD with GitHub Actions",
					content:
						"CI/CD is the automation layer that can lint, test, build, and deploy projects after the manual workflow is already clear. Visible pattern: CI/CD as a codified version of development and deployment discipline, not as a shortcut that replaces understanding."
				},
				{
					title: "Postgres as a SQL Companion Track",
					content:
						"Recommend Postgres as the natural SQL companion once data modeling and the SQL-vs-NoSQL decision are clear. This gives the broader web path a clean way to deepen relational thinking without undoing the value of earlier MongoDB work."
				},
				{
					title: "Object Storage and CDN Delivery",
					content:
						"Add S3-style object storage and CDN delivery as a forward-looking topic that connects assets, performance, caching, and global delivery. This makes clear that front-end files, uploaded media, and performance strategy often involve storage and delivery systems beyond the app server itself."
				},
				{
					title: "WDF12 Expansion Ideas and Next Steps: Core Project",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF12 Expansion Ideas and Next Steps",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-11-wdf12-expansion-ideas-and-next-steps/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-11-wdf12-expansion-ideas-and-next-steps/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Workflow Notebook: Expansion Ideas and Next Steps",
					content:
						"Keep a running notebook for expansion ideas and next steps that records the commands, editor setup, files changed, deployment assumptions, and debugging decisions made in that part of the course. Focus especially on which advanced path fits best after foundations and why to build habits that carry from local work into real hosting and operations.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-11-wdf12-expansion-ideas-and-next-steps/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-11-wdf12-expansion-ideas-and-next-steps/solution"
				},
				{
					title: "Next Steps Transfer Practice",
					aliases: ["Expansion Ideas and Next Steps supplemental 2"],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF12 Expansion Ideas and Next Steps",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-25-wdf12-expansion-ideas-and-next-steps-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-25-wdf12-expansion-ideas-and-next-steps-supplemental-2/solution"
				},
				{
					title: "Next Steps Extension Practice",
					aliases: ["Expansion Ideas and Next Steps supplemental 3"],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "WDF12 Expansion Ideas and Next Steps",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-26-wdf12-expansion-ideas-and-next-steps-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-26-wdf12-expansion-ideas-and-next-steps-supplemental-3/solution"
				}
			]
		},
		{
			title: "Full Stack Web Lab 14: Feature Slice Studio",
			aliases: ["Full Stack Web Lab 14: Implementation Lab"],
			curriculum: [
				{
					title: "Feature Slice Studio: Core Concepts",
					aliases: ["Full Stack Web Lab 14: Core Concepts"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 14: Feature Slice Studio",
						section: "concepts"
					})
				},
				{
					title: "Feature Slice Studio: Guided Example",
					aliases: ["Full Stack Web Lab 14: Guided Example"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 14: Feature Slice Studio",
						section: "example"
					})
				},
				{
					title: "Feature Slice Studio: Core Project",
					aliases: ["Full Stack Web Lab 14: Core Project"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 14: Feature Slice Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-01-full-stack-web-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-01-full-stack-web-lab-14/solution"
				},
				{
					title: "Feature Slice Studio: Review",
					aliases: ["Full Stack Web Lab 14: Review and Reflection"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 14: Feature Slice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Feature Slice Studio: Extension Challenge",
					aliases: ["Full Stack Web Lab 14: Extension Challenge"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 14: Feature Slice Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-01-full-stack-web-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-01-full-stack-web-lab-14/solution"
				},
				{
					title: "Feature Slice Transfer Practice",
					aliases: [
						"Full Stack Web Lab 14 Transfer Practice",
						"Full Stack Web Lab 14 supplemental 2: Implementation Lab"
					],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 14: Feature Slice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-27-applied-studio-14-full-stack-web-lab-14-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-27-applied-studio-14-full-stack-web-lab-14-supplemental-2/solution"
				},
				{
					title: "Feature Slice Extension Practice",
					aliases: [
						"Full Stack Web Lab 14 Extension Practice",
						"Full Stack Web Lab 14 supplemental 3: Implementation Lab"
					],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 14: Feature Slice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-28-applied-studio-14-full-stack-web-lab-14-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-28-applied-studio-14-full-stack-web-lab-14-supplemental-3/solution"
				}
			]
		},
		{
			title: "Full Stack Web Lab 15: API Integration Studio",
			aliases: ["Full Stack Web Lab 15: Implementation Lab"],
			curriculum: [
				{
					title: "API Integration Studio: Core Concepts",
					aliases: ["Full Stack Web Lab 15: Core Concepts"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 15: API Integration Studio",
						section: "concepts"
					})
				},
				{
					title: "API Integration Studio: Guided Example",
					aliases: ["Full Stack Web Lab 15: Guided Example"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 15: API Integration Studio",
						section: "example"
					})
				},
				{
					title: "API Integration Studio: Core Project",
					aliases: ["Full Stack Web Lab 15: Core Project"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 15: API Integration Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-02-full-stack-web-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-02-full-stack-web-lab-15/solution"
				},
				{
					title: "API Integration Studio: Review",
					aliases: ["Full Stack Web Lab 15: Review and Reflection"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 15: API Integration Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "API Integration Studio: Extension Challenge",
					aliases: ["Full Stack Web Lab 15: Extension Challenge"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 15: API Integration Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-02-full-stack-web-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-02-full-stack-web-lab-15/solution"
				},
				{
					title: "API Integration Transfer Practice",
					aliases: [
						"Full Stack Web Lab 15 Transfer Practice",
						"Full Stack Web Lab 15 supplemental 2: Implementation Lab"
					],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 15: API Integration Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-29-applied-studio-15-full-stack-web-lab-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-29-applied-studio-15-full-stack-web-lab-15-supplemental-2/solution"
				},
				{
					title: "API Integration Extension Practice",
					aliases: [
						"Full Stack Web Lab 15 Extension Practice",
						"Full Stack Web Lab 15 supplemental 3: Implementation Lab"
					],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 15: API Integration Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-30-applied-studio-15-full-stack-web-lab-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-30-applied-studio-15-full-stack-web-lab-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "Full Stack Web Lab 16: Data Persistence Studio",
			aliases: ["Full Stack Web Lab 16: Implementation Lab"],
			curriculum: [
				{
					title: "Data Persistence Studio: Core Concepts",
					aliases: ["Full Stack Web Lab 16: Core Concepts"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 16: Data Persistence Studio",
						section: "concepts"
					})
				},
				{
					title: "Data Persistence Studio: Guided Example",
					aliases: ["Full Stack Web Lab 16: Guided Example"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 16: Data Persistence Studio",
						section: "example"
					})
				},
				{
					title: "Data Persistence Studio: Core Project",
					aliases: ["Full Stack Web Lab 16: Core Project"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 16: Data Persistence Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-03-full-stack-web-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-03-full-stack-web-lab-16/solution"
				},
				{
					title: "Data Persistence Studio: Review",
					aliases: ["Full Stack Web Lab 16: Review and Reflection"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 16: Data Persistence Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Data Persistence Studio: Extension Challenge",
					aliases: ["Full Stack Web Lab 16: Extension Challenge"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 16: Data Persistence Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-03-full-stack-web-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-03-full-stack-web-lab-16/solution"
				},
				{
					title: "Data Persistence Transfer Practice",
					aliases: [
						"Full Stack Web Lab 16 Transfer Practice",
						"Full Stack Web Lab 16 supplemental 2: Implementation Lab"
					],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 16: Data Persistence Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-31-applied-studio-16-full-stack-web-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-31-applied-studio-16-full-stack-web-lab-16-supplemental-2/solution"
				},
				{
					title: "Data Persistence Extension Practice",
					aliases: [
						"Full Stack Web Lab 16 Extension Practice",
						"Full Stack Web Lab 16 supplemental 3: Implementation Lab"
					],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 16: Data Persistence Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-32-applied-studio-16-full-stack-web-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-32-applied-studio-16-full-stack-web-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "Full Stack Web Lab 17: Deployment Readiness Studio",
			aliases: ["Full Stack Web Lab 17: Implementation Lab"],
			curriculum: [
				{
					title: "Deployment Readiness Studio: Core Concepts",
					aliases: ["Full Stack Web Lab 17: Core Concepts"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 17: Deployment Readiness Studio",
						section: "concepts"
					})
				},
				{
					title: "Deployment Readiness Studio: Guided Example",
					aliases: ["Full Stack Web Lab 17: Guided Example"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 17: Deployment Readiness Studio",
						section: "example"
					})
				},
				{
					title: "Deployment Readiness Studio: Core Project",
					aliases: ["Full Stack Web Lab 17: Core Project"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 17: Deployment Readiness Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-04-full-stack-web-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-04-full-stack-web-lab-17/solution"
				},
				{
					title: "Deployment Readiness Studio: Review",
					aliases: ["Full Stack Web Lab 17: Review and Reflection"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 17: Deployment Readiness Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Deployment Readiness Studio: Extension Challenge",
					aliases: ["Full Stack Web Lab 17: Extension Challenge"],
					content: buildImplementationLabGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 17: Deployment Readiness Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-04-full-stack-web-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-04-full-stack-web-lab-17/solution"
				},
				{
					title: "Deployment Readiness Transfer Practice",
					aliases: [
						"Full Stack Web Lab 17 Transfer Practice",
						"Full Stack Web Lab 17 supplemental 2: Implementation Lab"
					],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 17: Deployment Readiness Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-33-applied-studio-17-full-stack-web-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-33-applied-studio-17-full-stack-web-lab-17-supplemental-2/solution"
				},
				{
					title: "Deployment Readiness Extension Practice",
					aliases: [
						"Full Stack Web Lab 17 Extension Practice",
						"Full Stack Web Lab 17 supplemental 3: Implementation Lab"
					],
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"Full Stack Web Lab 17: Deployment Readiness Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-34-applied-studio-17-full-stack-web-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-34-applied-studio-17-full-stack-web-lab-17-supplemental-3/solution"
				}
			]
		}
	]
};

const WEB_DEVELOPMENT_FOUNDATIONS_PRACTICE_PACK =
	"/course-assets/web-development-foundations/web-development-foundations-practice-pack.md";
const WEB_DEVELOPMENT_FOUNDATIONS_VERIFICATION_GUIDE =
	"/course-assets/web-development-foundations/web-development-foundations-verification-guide.md";

const WEB_DEVELOPMENT_FOUNDATIONS_SEQUENCE = [
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
] as const;

const WEB_DEVELOPMENT_FOUNDATIONS_APPENDICES = [
	"WDF8 Hosting and Operations Topics to Add",
	"WDF9 Good Practical Projects",
	"WDF10 Suggested Advanced Strand",
	"WDF11 Integration with Network Topics",
	"WDF12 Expansion Ideas and Next Steps"
] as const;

interface WebDevelopmentFoundationsModuleFlow {
	stage: string;
	estimatedTime: string;
	keyBlocks: [string, string, string, string, string, string];
	practiceSection: string;
	answerSection: string;
	route: string;
	standardsRoute: string;
	evidence: string;
	primaryReference: { label: string; url: string };
	additionalReferences?: { label: string; url: string }[];
}

const WEB_DEVELOPMENT_FOUNDATIONS_MODULE_FLOW: Record<
	(typeof WEB_DEVELOPMENT_FOUNDATIONS_SEQUENCE)[number],
	WebDevelopmentFoundationsModuleFlow
> = {
	"WDF0 Setup and Tooling": {
		stage: "Prove a reproducible local workspace before feature work",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"Node LTS",
			"project folder",
			"npm lockfile",
			"editor",
			"local server",
			"evidence log"
		],
		practiceSection: "toolchain-preflight-case",
		answerSection: "toolchain-preflight-key",
		route: "Install or select Node.js 24 LTS, open the supplied project folder, record the package and lockfile state, run only the documented scripts, and capture one successful and one failed startup.",
		standardsRoute:
			"Use the project-pinned package versions, ignored environment files, browser developer tools, and a local-only server. Do not treat a global package or editor extension as part of the application contract.",
		evidence:
			"The setup note records operating system, Node and npm versions, repository state, install and run commands, localhost URL, expected page, observed page, console and terminal state, and one recovery step.",
		primaryReference: {
			label: "Node.js release status",
			url: "https://nodejs.org/en/about/previous-releases"
		},
		additionalReferences: [
			{
				label: "npm package.json reference",
				url: "https://docs.npmjs.com/cli/v11/configuring-npm/package-json/"
			}
		]
	},
	"WDF1 Positioning, Goals, and Suggested Course Family": {
		stage: "Map browser knowledge onto the full request-to-release path",
		estimatedTime: "1–2 sessions · 45–60 minutes each",
		keyBlocks: [
			"browser",
			"server",
			"data",
			"network",
			"deployment",
			"operations"
		],
		practiceSection: "course-path-map-case",
		answerSection: "course-path-map-key",
		route: "Trace one fictional feature from a semantic control through browser state, an HTTP request, server validation, storage, response rendering, deployment configuration, and operational evidence. Mark prior knowledge and genuine new boundaries.",
		standardsRoute:
			"Use one architecture map and plain-language contracts instead of selecting a framework by popularity. Keep authentication, production operations, and public deployment visible as later boundaries rather than pretending they are already solved.",
		evidence:
			"The map names data ownership, trusted and untrusted inputs, secrets location, failure states, evidence at each layer, and the exact module that teaches each missing skill.",
		primaryReference: {
			label: "MDN how the web works",
			url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works"
		}
	},
	"WDF2 Stage 1: Strengthen the Existing JavaScript Courses": {
		stage: "Make local files, Git, npm, and developer tools routine",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"source files",
			"Git history",
			"npm scripts",
			"devtools",
			"network panel",
			"debug record"
		],
		practiceSection: "local-workflow-case",
		answerSection: "local-workflow-key",
		route: "Move a supplied browser feature into a named local project, initialize or inspect Git history, run the documented npm script, diagnose one HTML, CSS, JavaScript, and request failure, and commit the correction with a useful message.",
		standardsRoute:
			"Keep source, configuration, dependencies, generated output, and secrets visibly separate. Use browser and terminal evidence before changing code, and preserve a clean reset route.",
		evidence:
			"The workflow record includes file tree, package scripts, dependency role, Git diff, browser console, network result, one wrong hypothesis, correction, retest, and clean working state.",
		primaryReference: {
			label: "GitHub about Git",
			url: "https://docs.github.com/en/get-started/using-git/about-git"
		},
		additionalReferences: [
			{
				label: "npm scripts reference",
				url: "https://docs.npmjs.com/cli/v11/using-npm/scripts"
			}
		]
	},
	"WDF3 Stage 2: Web Development Foundations": {
		stage: "Build and verify an accessible front-end project",
		estimatedTime: "5–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"semantic structure",
			"module boundary",
			"responsive layout",
			"form validation",
			"build output",
			"static smoke check"
		],
		practiceSection: "portfolio-build-case",
		answerSection: "portfolio-build-key",
		route: "Use the portfolio scaffold to organize source and assets, add one purposeful module and validated form, produce a Vite build, and inspect the built result locally at narrow and desktop widths.",
		standardsRoute:
			"Use semantic HTML, native controls, labels, keyboard access, visible focus, safe text, no secret in client environment variables, and a source order that remains useful before visual layout.",
		evidence:
			"The packet includes the source tree, script and dependency explanation, build output, console state, form cases, keyboard path, focus, contrast, 200% zoom, narrow reflow, asset attribution, and static smoke result.",
		primaryReference: {
			label: "Vite getting started",
			url: "https://vite.dev/guide/"
		},
		additionalReferences: [
			{
				label: "MDN web accessibility",
				url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility"
			}
		]
	},
	"WDF4 Stage 3: Front-End Applications": {
		stage: "Model multi-view state before adding a live server",
		estimatedTime: "5–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"view model",
			"route",
			"event stream",
			"async state",
			"accessible status",
			"bounded history"
		],
		practiceSection: "front-end-state-case",
		answerSection: "front-end-state-key",
		route: "Build a multi-view notification interface from a supplied local event stream. Separate event normalization, state transition, route selection, and rendering; expose ready, loading, connected, empty, error, reconnecting, and reset states.",
		standardsRoute:
			"Use semantic navigation, safe text, labeled controls, keyboard and pointer parity, visible focus, live status that does not over-announce, reduced motion, and bounded history. Socket.IO is an optional later transport, not the source of the state model.",
		evidence:
			"The state and event table covers valid, malformed, duplicate, delayed, out-of-order, disconnect, reconnect, route change, history cap, keyboard, focus, narrow reflow, and reset cases.",
		primaryReference: {
			label: "WAI-ARIA Authoring Practices",
			url: "https://www.w3.org/WAI/ARIA/apg/"
		},
		additionalReferences: [
			{
				label: "MDN client-side web APIs",
				url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs"
			}
		]
	},
	"WDF5 Stage 4: Back-End Basics": {
		stage: "Create one bounded and testable HTTP service",
		estimatedTime: "6–7 sessions · 45–60 minutes each",
		keyBlocks: [
			"route contract",
			"validation",
			"error shape",
			"test transport",
			"resource limit",
			"shutdown"
		],
		practiceSection: "validated-api-case",
		answerSection: "validated-api-key",
		route: "Build the contact API on loopback with fictional input, explicit request and response contracts, server-side schema validation, stable errors, bounded bodies, a stream or test email transport, health behavior, and clean shutdown.",
		standardsRoute:
			"Use Node.js 24 LTS and the scaffolded Express 5 and Nodemailer 10 versions. Keep credentials server-side, validate again at the server, return no stack trace or raw provider error, and make real SMTP optional.",
		evidence:
			"The API matrix covers valid, missing, malformed, overlength, wrong content type, repeated, timeout, simulated delivery failure, redacted log, health, shutdown, and restart cases with expected status and body.",
		primaryReference: {
			label: "Express 5 migration guide",
			url: "https://expressjs.com/en/guide/migrating-5/"
		},
		additionalReferences: [
			{
				label: "Express error handling",
				url: "https://expressjs.com/en/guide/error-handling.html"
			}
		]
	},
	"WDF6 Stage 5: Databases and Data Models": {
		stage: "Add persistence without hiding the data contract",
		estimatedTime: "6–7 sessions · 45–60 minutes each",
		keyBlocks: [
			"document model",
			"stable ID",
			"schema validation",
			"CRUD",
			"index",
			"restore"
		],
		practiceSection: "persistence-boundary-case",
		answerSection: "persistence-boundary-key",
		route: "Define a versioned fictional note model and CRUD contract against a supplied in-memory adapter, then optionally switch the same service boundary to an isolated local MongoDB database. Tie each index to a named query.",
		standardsRoute:
			"Use Node.js 24 LTS with the scaffolded Mongoose 9 version, deterministic seed data, stable IDs, schema and route validation, bounded records, explicit not-found and conflict behavior, and no cloud database requirement.",
		evidence:
			"The persistence matrix covers seed, create, read, update, delete, duplicate, malformed, unknown ID, unavailable adapter, restart, migration or reset, backup, restore to a separate target, and integrity comparison.",
		primaryReference: {
			label: "Mongoose 9 migration guide",
			url: "https://mongoosejs.com/docs/migrating_to_9.html"
		},
		additionalReferences: [
			{
				label: "MongoDB data modeling",
				url: "https://www.mongodb.com/docs/manual/core/data-modeling-introduction/"
			}
		]
	},
	"WDF7 Stage 6: Hosting and Deployment": {
		stage: "Turn local success into a reversible deployment plan",
		estimatedTime: "5–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"build artifact",
			"configuration map",
			"proxy and CORS",
			"health and logs",
			"smoke check",
			"rollback"
		],
		practiceSection: "deployment-preflight-case",
		answerSection: "deployment-preflight-key",
		route: "Review the separate-deployment scaffold locally, map each process, artifact, environment value, origin, route, proxy hop, database dependency, log, health check, backup, and rollback before any optional publishing.",
		standardsRoute:
			"Treat TLS, proxy trust, CORS, secrets, least exposure, redacted logs, resource limits, health and readiness, restore, and rollback as release gates. Public hosting and DNS changes remain optional.",
		evidence:
			"The preflight includes architecture and configuration maps, local smoke results, wrong-origin and unavailable-API cases, log evidence, health and readiness, restart, backup and restore, rollback trigger, rollback steps, and post-rollback verification.",
		primaryReference: {
			label: "MDN CORS guide",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS"
		},
		additionalReferences: [
			{
				label: "Nginx proxy module",
				url: "https://nginx.org/en/docs/http/ngx_http_proxy_module.html"
			}
		]
	},
	"Full Stack Web Lab 14: Feature Slice Studio": {
		stage: "Deliver one thin end-to-end feature slice",
		estimatedTime: "5–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"user task",
			"browser state",
			"API contract",
			"data adapter",
			"vertical test",
			"limitation"
		],
		practiceSection: "feature-slice-capstone-case",
		answerSection: "feature-slice-capstone-key",
		route: "Choose one fictional user task and complete the smallest useful path from semantic control through browser state, validated route, local data adapter, response, rendered status, and reset before adding breadth.",
		standardsRoute:
			"Use one named contract at each boundary, preserve accessibility and local continuity, and defer authentication, live delivery, public deployment, and extra features unless they are required by the chosen task.",
		evidence:
			"The slice packet includes a task statement, non-goals, architecture trace, expected and observed happy path, invalid input, dependency failure, keyboard path, reset, and one limitation.",
		primaryReference: {
			label: "MDN HTTP overview",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"
		}
	},
	"Full Stack Web Lab 15: API Integration Studio": {
		stage: "Harden the browser-to-server contract",
		estimatedTime: "5–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"request schema",
			"response schema",
			"status code",
			"timeout",
			"negative test",
			"observability"
		],
		practiceSection: "api-integration-capstone-case",
		answerSection: "api-integration-capstone-key",
		route: "Expand the feature slice with a documented request and response schema, consistent status and error behavior, timeout and retry boundaries, one safe log event, and browser handling for every state.",
		standardsRoute:
			"Keep the service on loopback, cap body and collection size, validate before business logic, expose no stack or secret, and avoid automatic retries for state-changing requests.",
		evidence:
			"The contract table and tests cover valid, invalid, empty, malformed, oversized, wrong method, wrong content type, timeout, unavailable service, duplicate action, redacted log, recovery, and no uncaught browser or server error.",
		primaryReference: {
			label: "Express routing guide",
			url: "https://expressjs.com/en/guide/routing.html"
		}
	},
	"Full Stack Web Lab 16: Data Persistence Studio": {
		stage: "Prove persistence, integrity, and recovery",
		estimatedTime: "5–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"schema",
			"constraint",
			"query",
			"migration",
			"backup",
			"restore"
		],
		practiceSection: "data-persistence-capstone-case",
		answerSection: "data-persistence-capstone-key",
		route: "Replace or extend the local adapter with a documented persistence model, deterministic seed, one query-driven index, version or migration note, backup, restore to a separate target, and integrity comparison.",
		standardsRoute:
			"Use fictional bounded data, server-side validation, stable IDs, explicit not-found and conflict behavior, and a complete supplied-data route when local MongoDB is unavailable.",
		evidence:
			"The data packet includes model rationale, representative records, CRUD and query tests, malformed and duplicate cases, migration or reset, unavailable-store behavior, backup manifest, restored record comparison, and remaining consistency limits.",
		primaryReference: {
			label: "Mongoose validation guide",
			url: "https://mongoosejs.com/docs/validation.html"
		}
	},
	"Full Stack Web Lab 17: Deployment Readiness Studio": {
		stage: "Assemble and defend a release-and-recovery packet",
		estimatedTime: "7–9 sessions · 45–60 minutes each",
		keyBlocks: [
			"release manifest",
			"security boundary",
			"smoke matrix",
			"resource budget",
			"rollback",
			"demonstration"
		],
		practiceSection: "deployment-readiness-capstone-case",
		answerSection: "deployment-readiness-capstone-key",
		route: "Bring one local full-stack project through clean start, browser and API smoke checks, persistence verification, injected failure, diagnosis, correction, restart, restore, and rollback planning. Optional public deployment follows only after every local gate passes.",
		standardsRoute:
			"Record exact runtime and package versions, configuration and secrets boundaries, proxy and CORS assumptions, TLS plan, redacted logs, health and readiness, resource caps, backup, restore, rollback, privacy, attribution, and known limitations.",
		evidence:
			"The final packet contains release manifest, architecture, contracts, expected and observed matrix, accessibility evidence, clean console and logs, fault timeline, restore result, rollback trigger and check, resource budget, limitations, and a five-minute demonstration.",
		primaryReference: {
			label: "Node.js process reference",
			url: "https://nodejs.org/api/process.html"
		}
	}
};

function webDevelopmentFoundationsPracticeLink(section: string) {
	return `${WEB_DEVELOPMENT_FOUNDATIONS_PRACTICE_PACK}#${section}`;
}

function webDevelopmentFoundationsVerificationLink(section: string) {
	return `${WEB_DEVELOPMENT_FOUNDATIONS_VERIFICATION_GUIDE}#${section}`;
}

function renderWebDevelopmentFoundationsReferences(
	flow: WebDevelopmentFoundationsModuleFlow
) {
	return [
		`[${flow.primaryReference.label}](${flow.primaryReference.url})`,
		...(flow.additionalReferences ?? []).map(
			item => `[${item.label}](${item.url})`
		)
	].join(", ");
}

function webDevelopmentFoundationsSupplementalPath(title: string) {
	if (/extension|challenge/i.test(title)) return "challenge" as const;
	return "choice" as const;
}

function decorateWebDevelopmentFoundationsModule(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow =
		WEB_DEVELOPMENT_FOUNDATIONS_MODULE_FLOW[
			module.title as (typeof WEB_DEVELOPMENT_FOUNDATIONS_SEQUENCE)[number]
		];
	if (!flow) {
		throw new Error(
			`Missing Web Development Foundations flow: ${module.title}`
		);
	}

	const practiceLink = webDevelopmentFoundationsPracticeLink(
		flow.practiceSection
	);
	const verificationLink = webDevelopmentFoundationsVerificationLink(
		flow.answerSection
	);
	const references = renderWebDevelopmentFoundationsReferences(flow);

	return {
		...module,
		kind:
			module.title ===
			"WDF1 Positioning, Goals, and Suggested Course Family"
				? "transition"
				: "module",
		estimatedTime: flow.estimatedTime,
		keyBlocks: [...flow.keyBlocks],
		curriculum: module.curriculum.map((item, index) => ({
			...item,
			content:
				index === 0
					? `**Course flow:** ${flow.stage}. ${flow.route}

**Standards route:** ${flow.standardsRoute}

**Evidence gate:** ${flow.evidence}

**Local continuity:** Complete the [supplied foundations case](${practiceLink}) before comparing it with the [verification guide](${verificationLink}). Localhost, fixtures, test transports, local adapters, and supplied evidence remain the completion route when a database, SMTP provider, cloud account, domain, or public deployment is unavailable.

**Current references:** ${references}. Record Node and npm versions, package and lockfile state, browser and viewport, scaffold dependency versions, and every service, database, proxy, or host assumption that affects the result.

${item.content}`
					: item.content,
			learningPath:
				item.title ===
				"WDF4 Stage 3: Front-End Applications: Core Project"
					? ("choice" as const)
					: ("core" as const),
			...(item.projectLink
				? {
						datasetLink: item.datasetLink ?? practiceLink,
						mediaLink: item.mediaLink ?? flow.primaryReference.url
					}
				: {})
		})),
		supplementalProjects: module.supplementalProjects.map(item => ({
			...item,
			learningPath: webDevelopmentFoundationsSupplementalPath(item.title),
			...(item.projectLink
				? {
						datasetLink: item.datasetLink ?? practiceLink,
						mediaLink: item.mediaLink ?? flow.primaryReference.url
					}
				: {})
		}))
	};
}

function decorateWebDevelopmentFoundationsAppendix(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	return {
		...module,
		kind: "appendix",
		estimatedTime: "Optional · 2–4 sessions",
		keyBlocks: [
			"optional route",
			"prerequisite",
			"owned service",
			"risk boundary",
			"evidence",
			"next step"
		],
		curriculum: module.curriculum.map((item, index) => ({
			...item,
			content:
				index === 0
					? `**Optional appendix:** This material extends the required WDF0–WDF7 and Full Stack Web Lab 14–17 path. Select it only after the local capstone can be built, tested, persisted, diagnosed, and recovered. Public services, paid accounts, real credentials, and real user data are never required.

${item.content}`
					: item.content,
			learningPath: "choice" as const
		})),
		supplementalProjects: module.supplementalProjects.map(item => ({
			...item,
			learningPath: webDevelopmentFoundationsSupplementalPath(item.title)
		}))
	};
}

const webDevelopmentFoundationsModulesByTitle = new Map(
	webDevelopmentFoundationsSourceCourse.modules.map(module => [
		module.title,
		module
	])
);

const webDevelopmentFoundationsCoreModules =
	WEB_DEVELOPMENT_FOUNDATIONS_SEQUENCE.map(title => {
		const module = webDevelopmentFoundationsModulesByTitle.get(title);
		if (!module) {
			throw new Error(
				`Missing Web Development Foundations module: ${title}`
			);
		}
		return decorateWebDevelopmentFoundationsModule(module);
	});

const webDevelopmentFoundationsAppendices =
	WEB_DEVELOPMENT_FOUNDATIONS_APPENDICES.map(title => {
		const module = webDevelopmentFoundationsModulesByTitle.get(title);
		if (!module) {
			throw new Error(
				`Missing Web Development Foundations appendix: ${title}`
			);
		}
		return decorateWebDevelopmentFoundationsAppendix(module);
	});

export const webDevelopmentFoundationsCourse: RawCourse = {
	...webDevelopmentFoundationsSourceCourse,
	modules: [
		...webDevelopmentFoundationsCoreModules,
		...webDevelopmentFoundationsAppendices
	]
};
