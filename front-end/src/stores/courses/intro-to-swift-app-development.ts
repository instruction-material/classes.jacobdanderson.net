import type { RawCourse, RawCourseModuleItem } from "./types";
import swiftCapstoneReading from "@/assets/course-guides/swift-capstone.md?raw";
import swiftGalleryReading from "@/assets/course-guides/swift-gallery.md?raw";
import swiftHobbyReading from "@/assets/course-guides/swift-hobby.md?raw";
import swiftLessonCardsReading from "@/assets/course-guides/swift-lesson-cards.md?raw";
import swiftMapReading from "@/assets/course-guides/swift-map.md?raw";
import swiftNetworkingReading from "@/assets/course-guides/swift-networking.md?raw";
import swiftProfileInterestsReading from "@/assets/course-guides/swift-profile-interests.md?raw";
import swiftDataTrackerReading from "@/assets/course-guides/swift-swiftdata.md?raw";
import swiftTrackerReading from "@/assets/course-guides/swift-tracker.md?raw";
import swiftWelcomeReading from "@/assets/course-guides/swift-welcome-profile.md?raw";
import {
	swiftCapstoneRoot,
	swiftCourseResource,
	swiftDataTrackerRoot,
	swiftGalleryRoot,
	swiftHobbyRoot,
	swiftLessonCardsRoot,
	swiftMapRoot,
	swiftNetworkingRoot,
	swiftProfileInterestsRoot,
	swiftTrackerRoot
} from "@/modules/swiftProjectResources";
import { buildProjectGuidance } from "./projectGuidance";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";
import swiftPriorTitles from "./swift-title-progress-history.json";

const swiftCanonicalWorkspaces = [
	{
		pack: "SAD2-Media-Gallery-App",
		root: swiftGalleryRoot,
		reading: swiftGalleryReading
	},
	{
		pack: "SAD3-Multi-Tab-Hobby-App",
		root: swiftHobbyRoot,
		reading: swiftHobbyReading
	},
	{
		pack: "SAD4-Map-Places-App",
		root: swiftMapRoot,
		reading: swiftMapReading
	},
	{
		pack: "SAD7-Publish-Ready-Capstone",
		root: swiftCapstoneRoot,
		reading: swiftCapstoneReading
	}
];

const introToSwiftAppDevelopmentSourceCourse: RawCourse = {
	name: "Intro to Swift App Development",
	modules: [
		{
			title: "SAD1 Apple Developer Ecosystem Overview",
			curriculum: [
				{
					title: "The Apple Development Pipeline",
					preserveInstructions: true,
					contentKind: "reading",
					content: `Xcode turns a project into a build for a chosen destination. A simulator run lets its author try the app on a Mac. A signed device build can run on an authorized iPhone. For distribution, the team archives a device build, uploads it to App Store Connect, and waits for processing. TestFlight makes an eligible build available to a beta group. App Review evaluates a submission for the store. Each step changes the signing requirements, metadata expectations, and audience that can access the build.

## Worked example

Trail Notes opens on the simulator. A classmate asks for an invitation link. The simulator result proves the local build launched. The team still needs an eligible uploaded build and a tester group before an invitation can reach that classmate.

## Check

Name the earliest point where another person could test a distributed build and the separate decision that controls public availability.`
				},
				{
					title: "Apple Platforms at a High Level",
					preserveInstructions: true,
					contentKind: "reading",
					content: `The same Swift model can represent a note on a phone, tablet, watch, or Mac. The screen, input method, and available APIs depend on the selected platform. An iPhone row can open a detail screen by touch. An iPad layout can show the list beside the detail. A watch might show only the next note; a Mac could expose the list to keyboard navigation.

For Trail Notes, choose one iPhone simulator as the first destination. Sketch what changes on a watch and identify which model field can remain identical. A phone run supplies evidence for that destination. Testing another platform requires its own target and checks.`
				},
				{
					title: "Practical Walkthrough: Local Build vs TestFlight vs App Store",
					preserveInstructions: true,
					contentKind: "reading",
					content: `Follow version 1.0, build 7 of Trail Notes. First, run the main task in Xcode and record the destination and result. Next, suppose the release team archives and uploads build 7. Processing makes that build available for eligible uses in App Store Connect. Adding it to an internal TestFlight group gives that group a beta to try. For a store submission, the team selects the build on the version record, completes its metadata, and submits it for review.

Draw one box for each handoff. Put the artifact inside the box and its audience underneath. An uploaded build with no tester group and no store submission has reached neither audience.`
				},
				{
					title: "Reflection Question: Where Does Publishing Friction Come From?",
					preserveInstructions: true,
					contentKind: "reading",
					content: `Build 7 compiles, but the team cannot invite its beta group. Consider three observations separately: the archive fails to sign, processing has not finished, or the signed-in account cannot manage the group. For each, identify who can investigate, what evidence they can inspect, and the next action. Only the first observation points directly to the archive's signing configuration.

Write one sentence explaining why changing the app's SwiftUI layout would leave all three obstacles unresolved.`
				},
				{
					title: "SAD1 Apple Developer Ecosystem Overview: Core Project",
					preserveInstructions: true,
					contentKind: "assignment",
					ideImport: false,
					content: `Make a distribution map for Trail Notes. Start with the simulator result “build 7 opened the note list.” Use the four stages in the case to show the next artifact, audience, and access requirement at each stage. Circle the last step you actually observed. Label subsequent steps as planned. A complete map explains how a classmate could receive a beta and how a public customer could later obtain the app.

**Completion checks:** Two people can follow the map from the same archive to different audiences. Mark the build identifier at each handoff and point to the first place external beta review can affect the route.`
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					preserveInstructions: true,
					contentKind: "assignment",
					ideImport: false,
					content: `A teammate reports “version 1.0 is available” after seeing build 7 in App Store Connect. Write two questions that distinguish a processed upload, a beta assigned to a group, and a released store version. For each answer, name one record that would confirm the audience.

**Completion checks:** A convincing answer asks which build was processed and who can install it. Use an assigned testing group to support a beta claim and store availability for the chosen region to support a public claim.`
				},
				{
					title: "Mod5Pro3",
					preserveInstructions: true,
					contentKind: "assignment",
					ideImport: false,
					content: `Trace build 7 backward. An external tester sees the beta in TestFlight. Identify the group and eligible build that made access possible, then trace the build to its upload and archive. Mark which of these records could establish a public store release. Explain what additional record the public-release claim would need.

**Completion checks:** Start with the tester's observed installation and work back one handoff at a time. Identify the earliest claim the evidence supports. Mark public availability as unknown until the store record supplies that evidence.`
				},
				{
					title: "Apple Developer Ecosystem Overview Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD1 Apple Developer Ecosystem Overview",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-01-sad1-apple-developer-ecosystem-overview-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-01-sad1-apple-developer-ecosystem-overview-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD2 Mac Setup and Project Tooling",
			curriculum: [
				{
					title: "Machine Requirements and Platform Reality",
					content:
						"Real iOS building, simulator use, signing, archiving, and App Store publishing require macOS and Xcode. Windows can support note-taking or light Swift syntax exploration, but it is not a complete replacement for the practical parts of the course. Establish this workflow boundary early so the project setup remains viable later."
				},
				{
					title: "Practical Walkthrough: Installing Xcode and Simulators",
					content:
						"Confirm macOS compatibility, install Xcode, open it once for first-run components, and review storage expectations for simulator downloads and updates. Explain why Xcode updates can affect simulator availability, build settings, and course pacing."
				},
				{
					title: "Practical Walkthrough: Apple ID Sign-In and Folder Organization",
					content:
						"Sign in with an Apple ID in Xcode and explain when a paid Apple Developer membership is required. Create a clean app-development folder structure for projects, screenshots, app icons, metadata drafts, and notes so the workflow starts with manageable organization."
				},
				{
					title: "First Blank SwiftUI App Studio",
					content:
						"Create a new iOS App project in Xcode, run it in the preview canvas and simulator, and confirm that scheme selection, destination choice, and project naming make sense. This lab is about environmental confidence, not visual polish."
				},
				{
					title: "SAD2 Mac Setup and Project Tooling: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD2 Mac Setup and Project Tooling",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod1Pro1"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: explain why a Mac is required for practical iOS shipping work and create a new project without getting lost in Xcode's initial templates. Prompt: identify where screenshots, exported builds, and app notes belong before real app work begins.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod1Pro1"
				},
				{
					title: "Mac Setup and Project Tooling Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD2 Mac Setup and Project Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-02-sad2-mac-setup-and-project-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-02-sad2-mac-setup-and-project-tooling-supplemental-2/solution"
				},
				{
					title: "Mac Setup and Project Tooling Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD2 Mac Setup and Project Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-03-sad2-mac-setup-and-project-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-03-sad2-mac-setup-and-project-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD3 Certificates, Signing, and Bundle IDs",
			curriculum: [
				{
					title: "What Code Signing Actually Means",
					preserveInstructions: true,
					contentKind: "reading",
					content: `A signature binds an app's contents to a signing identity. A certificate identifies the signer, and signing uses the corresponding private key. The bundle identifier identifies the app. A provisioning profile links an allowed app identity, signing certificate, and authorized capabilities for a particular distribution route. A development profile can also restrict the devices that can install the build.

## Worked example

The target is net.example.tracker, but the profile describes net.example.gallery. Even with a valid signing identity, the app identity and profile disagree. Compare the target's bundle identifier and team with the profile selected for that configuration.

## Check

Explain why changing a screen title leaves this mismatch in place. Use fictional identifiers for the exercise.`
				},
				{
					title: "Practical Walkthrough: Team Selection and Bundle IDs",
					preserveInstructions: true,
					contentKind: "reading",
					content: `In Xcode, select the app target and its Signing & Capabilities settings. Read the selected team, bundle identifier, and signing mode for the configuration being built. Compare those values with the app identity the team intends to ship. Automatic signing can manage compatible signing assets when the account has the necessary access.

In the case, Team Oak owns net.example.tracker and Team Pine owns a separate demo. The release configuration selects Pine. Record the intended team and target before proposing a change. Switching the release configuration to Oak requires an authorized team member. Changing an established app identifier merely to satisfy the demo profile would change which app the build identifies.`
				},
				{
					title: "Troubleshooting Lab: Why Provisioning Problems Happen",
					preserveInstructions: true,
					contentKind: "reading",
					content: `Separate the first signing error from the later build failures it triggers. If the error names an identifier mismatch, compare app and profile identifiers. If it names a missing entitlement, compare the target's requested capability, its registered App ID, and the profile. If the account lacks a required role, route that operation to the team member with permission.

Apply this sequence to case 4. A simulator launch succeeded, and the archive failed. Those facts narrow the investigation to the archive path, but they do not identify the failing setting. Request the first signing error and the release target's configuration before proposing a repair.`
				},
				{
					title: "Reflection Question: Which Part of Signing Is Conceptual vs Configurational?",
					preserveInstructions: true,
					contentKind: "reading",
					content:
						"A certificate identifies a signer; a bundle identifier identifies an app. A profile authorizes a combination of settings. Suppose the team renews a certificate but the release configuration still selects a profile for a different app. Which relationship changed, and which mismatch remains? Support the answer with the tracker and gallery identifiers in the case. Explain which values a teammate can compare without receiving a private key."
				},
				{
					title: "SAD3 Certificates, Signing, and Bundle IDs: Core Project",
					preserveInstructions: true,
					contentKind: "assignment",
					ideImport: false,
					content: `Prepare a signing diagnosis for case 1. Record the target, intended team, app identifier, selected profile identifier, and the exact disagreement. State one narrow correction and how a fresh archive of the same target would test it. Then read case 4. List the missing evidence that prevents you from assigning it the same cause.

**Completion checks:** Your diagnosis names both conflicting identifiers and treats the first archive error as missing evidence in case 4. Work from the supplied records. Certificates, private keys, provisioning files, passwords, recovery codes, and team invitations are never submitted or shared.`
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					preserveInstructions: true,
					contentKind: "assignment",
					ideImport: false,
					content: `A simulator build launches. An archive for the same target reports that its profile lacks a requested capability. Identify the evidence supplied by each result. List the three capability records to compare and explain when the team would need a newly generated profile.

**Completion checks:** Mark the simulator result and archive error as separate observations. State which change would restore alignment among the app's requested entitlements, the registered capabilities and the profile, and what one new archive can demonstrate.`
				},
				{
					title: "Certificates, Signing, and Bundle IDs Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle:
							"SAD3 Certificates, Signing, and Bundle IDs",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-04-sad3-certificates-signing-and-bundle-ids-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-04-sad3-certificates-signing-and-bundle-ids-supplemental-2/solution"
				},
				{
					title: "Certificates, Signing, and Bundle IDs Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle:
							"SAD3 Certificates, Signing, and Bundle IDs",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-05-sad3-certificates-signing-and-bundle-ids-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-05-sad3-certificates-signing-and-bundle-ids-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD4 Running on Simulator and Device",
			curriculum: [
				{
					title: "Simulator vs Real Device",
					content:
						"Explain the strengths and limits of the iOS Simulator and why certain checks still need a real iPhone. This module compares rapid UI iteration, hardware features, permissions, and performance realism."
				},
				{
					title: "Practical Walkthrough: Build and Run Destinations",
					content:
						"Choose simulator destinations, connect a real device, trust the developer path, and verify that the correct scheme is selected. Differentiate between an app that compiles, an app that launches, and an app that behaves correctly."
				},
				{
					title: "Practical Walkthrough: Logs, Console Output, and Crash Clues",
					content:
						"Console logs, build output, and run-on-device messages provide the first useful failure signals. Capture the earliest useful signal before chasing symptoms so setup problems stay diagnosable."
				},
				{
					title: "First Launch Troubleshooting Studio",
					content:
						"Take a blank or simple starter app, run it on simulator, then on device if available, and document what changed between the two paths. Record one issue they encountered or might realistically encounter and how they would investigate it."
				},
				{
					title: "SAD4 Running on Simulator and Device: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD4 Running on Simulator and Device",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod1Pro3"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: switch destinations intentionally, recognize the difference between simulator-only confidence and real-device confidence, and find the basic logging surfaces in Xcode. Prompt: identify what to inspect first if a build compiles but never launches on a phone.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod1Pro3"
				},
				{
					title: "Running on Simulator and Device Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD4 Running on Simulator and Device",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-06-sad4-running-on-simulator-and-device-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-06-sad4-running-on-simulator-and-device-supplemental-2/solution"
				},
				{
					title: "Running on Simulator and Device Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD4 Running on Simulator and Device",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-07-sad4-running-on-simulator-and-device-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-07-sad4-running-on-simulator-and-device-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD5 App Store Connect and TestFlight Workflow",
			curriculum: [
				{
					title: "Metadata, Builds, and Reviewer Context",
					preserveInstructions: true,
					contentKind: "reading",
					content: `An app record identifies the product. Its version record describes a planned release. An uploaded build contains the executable code, and its build number distinguishes attempts at the same version. Test information tells a beta group which flow to try and how to report a problem.

## Worked example

Version 1.0, build 7 asks testers to create a tracker entry, edit it, and recover from an empty list. Feedback that names build 6 belongs to a different executable until the team reproduces it on build 7. Keep the version, build, steps, observed result, and destination together.

## Check

Write a one-line beta instruction that makes the recovery step observable. Identify which record changes when the next upload fixes a bug but keeps version 1.0.`
				},
				{
					title: "Practical Walkthrough: Internal vs External Testing",
					preserveInstructions: true,
					contentKind: "reading",
					content: `The QA Team is an internal group of eligible App Store Connect users with access to the app. Classroom Review represents external testers. A team can assign an eligible processed build to its internal group. External distribution requires test information and the applicable TestFlight review before testers can receive that build.

Draw the two paths for build 7. Put a gate on the external path for review. Use fictional tester labels. A passing internal check supplies useful feedback, but it does not record the external group's review or invitation.`
				},
				{
					title: "Practical Walkthrough: Version Numbers, Build Numbers, and Assets",
					preserveInstructions: true,
					contentKind: "reading",
					content: `The release record pairs a user-facing version, 1.0, with build 7. A correction can arrive as 1.0 (8). Before asking testers to retest a report, confirm which build their group has and which build appears in the report. Screenshots and beta instructions must describe the selected build's actual screens.

Suppose build 8 renames Add topic to New topic. Revise one test step and one screenshot caption. Keep the old report tied to build 7 and add a fresh result for build 8 so a later reader can reconstruct what changed.`
				},
				{
					title: "Reflection Question: What Makes an App Feel Release-Ready?",
					preserveInstructions: true,
					contentKind: "reading",
					content:
						"QA can add a tracker item, but new testers cannot find the empty-list recovery action. Classify the evidence: the feature works once found, the discovery step fails for those testers, and there is still no retest showing that a change helped. Write one revision to the interface or instructions and one measurable retest. Name the build and the tester group that will supply the result."
				},
				{
					title: "SAD5 App Store Connect and TestFlight Workflow: Core Project",
					preserveInstructions: true,
					contentKind: "assignment",
					ideImport: false,
					content: `Build a timeline for version 1.0 (7) using the supplied release record. Place upload, processing, any required compliance response, internal assignment, external test information, external review, and invitation in their required relationships. Separate tasks that can be prepared early from gates that must finish before testers receive the build. Identify which group could test first and what evidence would show that Classroom Review actually received access.

**Completion checks:** The timeline identifies a build, group and gate for each testing path. Someone reading it can tell a processed build from an assigned build and an invitation from a confirmed installation.`
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					preserveInstructions: true,
					contentKind: "assignment",
					ideImport: false,
					content: `The internal QA Team has reported a defect on build 7. The external group's invitation is still pending. Write the build identifier to put on the defect and the group status to check before sending instructions. For a corrected build 8, identify which earlier result needs a fresh test and why.

**Completion checks:** Include version 1.0 and the build number on each observation. A tester's successful recovery on build 8 can close that reproduction on build 8. An outstanding external invitation remains a separate question.`
				},
				{
					title: "App Store Connect and TestFlight Workflow Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle:
							"SAD5 App Store Connect and TestFlight Workflow",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-08-sad5-app-store-connect-and-testflight-workflow-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-08-sad5-app-store-connect-and-testflight-workflow-supplemental-2/solution"
				},
				{
					title: "App Store Connect and TestFlight Workflow Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle:
							"SAD5 App Store Connect and TestFlight Workflow",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-09-sad5-app-store-connect-and-testflight-workflow-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-09-sad5-app-store-connect-and-testflight-workflow-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD6 What an App Is Structurally",
			curriculum: [
				{
					title: "Entry Point, Lifecycle, Scenes, and Views",
					content:
						"Explain what an app is structurally before diving deeper into Swift syntax. Cover the app entry point, scenes, views, navigation, assets, and data flow so each later topic fits inside a coherent architecture."
				},
				{
					title: "Navigation, Assets, and Data as App Systems",
					content:
						"Compare what belongs in view code, what belongs in assets, and what belongs in the app's data model. Treat navigation and data flow as structural systems rather than decorative extras."
				},
				{
					title: "Worked Example Set: Reading a Tiny App Blueprint",
					content:
						"Take a small app and identify where the app launches, which views it owns, how navigation branches, and where user-facing data is stored or derived. Treat this as architecture reading, not just code reading."
				},
				{
					title: "Reflection Question: Stable App Structure",
					content:
						"Compare core structure with surface-level UI and explain which decisions stay stable and which remain easy to revise. This builds architectural judgment before the app grows past a few screens."
				},
				{
					title: "SAD6 What an App Is Structurally: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD6 What an App Is Structurally",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod2Pro2"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: label the app entry point, scene, view hierarchy, navigation model, and data model responsibilities in a small example. The structure is explainable without relying on memorized code fragments.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod2Pro2"
				},
				{
					title: "What an App Is Structurally Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD6 What an App Is Structurally",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-10-sad6-what-an-app-is-structurally-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-10-sad6-what-an-app-is-structurally-supplemental-2/solution"
				},
				{
					title: "What an App Is Structurally Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD6 What an App Is Structurally",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-11-sad6-what-an-app-is-structurally-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-11-sad6-what-an-app-is-structurally-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD7 Xcode Project Anatomy",
			curriculum: [
				{
					title: "Navigating an Xcode Project",
					content:
						"Review the project navigator, targets, schemes, asset catalogs, preview canvas, and configuration files at a practical level. The purpose is not memorizing every panel but knowing where common app-development work actually lives."
				},
				{
					title: "Practical Walkthrough: Templates, Targets, and Schemes",
					content:
						"Create a new project and explain the role of the selected template, target, and scheme. Connect scheme choice to build destinations and target settings to bundle identity and app capabilities."
				},
				{
					title: "Practical Walkthrough: Asset Catalogs and Preview Canvas",
					content:
						"Images, icons, and colors belong in dedicated asset containers, and the preview canvas supports fast SwiftUI iteration. Dedicated asset containers keep resources discoverable and maintainable instead of scattering file imports across views."
				},
				{
					title: "Reflection Question: Which Xcode Areas Do You Need Every Day?",
					content:
						"Identify which Xcode panes matter for everyday app work and which ones are more occasional configuration tools. This helps reduce cognitive overload when the interface feels large."
				},
				{
					title: "SAD7 Xcode Project Anatomy: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD7 Xcode Project Anatomy",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod3Pro1"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: locate the file navigator, target settings, assets, and previews fast enough to support normal app iteration. A helpful checkpoint identifies where to change the bundle ID or add a new image.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod3Pro1"
				},
				{
					title: "Xcode Project Anatomy Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD7 Xcode Project Anatomy",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-12-sad7-xcode-project-anatomy-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-12-sad7-xcode-project-anatomy-supplemental-2/solution"
				},
				{
					title: "Xcode Project Anatomy Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD7 Xcode Project Anatomy",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-13-sad7-xcode-project-anatomy-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-13-sad7-xcode-project-anatomy-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD8 SwiftUI Mental Model",
			curriculum: [
				{
					title: "Declarative UI and View Trees",
					content:
						"SwiftUI is a declarative system where views describe UI state rather than imperatively drawing one widget at a time. `body`, view trees, modifiers, and layout containers show what SwiftUI is trying to optimize for."
				},
				{
					title: "Worked Example Set: Text, Stacks, and Modifiers",
					content:
						"Build up a small screen from `Text`, `VStack`, `HStack`, overlays, spacing, and background shapes. Small changes in modifier order affect layout and styling, which is one of the earliest conceptual friction points in SwiftUI."
				},
				{
					title: "Project: Welcome Profile App",
					content:
						"Build a welcome/profile app that turns a simple static screen into a real SwiftUI starter project. The project introduces reading a view tree, customizing hierarchy, and practicing navigation between a landing screen and a detail screen.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD1-Welcome-Profile-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD1-Welcome-Profile-App/solution"
				},
				{
					title: "Reflection Question: Why Does Modifier Order Matter?",
					content:
						"Explain one example where changing modifier order changes the result. Focus on layout or styling consequences, not just the claim that SwiftUI is sensitive."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: explain SwiftUI as a declarative system and identify the major branches of a small view tree without help. Prompt: describe what happens first when a `Text` view also has padding, background, and corner radius modifiers.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD1-Welcome-Profile-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD1-Welcome-Profile-App/solution"
				},
				{
					title: "SwiftUI Mental Model Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD8 SwiftUI Mental Model",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-14-sad8-swiftui-mental-model-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-14-sad8-swiftui-mental-model-supplemental-2/solution"
				},
				{
					title: "SwiftUI Mental Model Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD8 SwiftUI Mental Model",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-15-sad8-swiftui-mental-model-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-15-sad8-swiftui-mental-model-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD9 Swift Basics in App Context",
			curriculum: [
				{
					title: "Variables, Constants, and Types",
					preserveInstructions: true,
					contentKind: "reading",
					content: `A profile has a name and a count of completed lessons. Swift infers \`String\` from a quoted name and \`Int\` from a whole number. Use \`let\` for a binding that keeps its value and \`var\` for a count that changes when a lesson finishes.

\`\`\`swift
let name = "Avery"
var completed = 3
let previous = completed
completed += 1
print(name, previous, completed)
\`\`\`

Predict the two counts before running the example. It prints \`Avery 3 4\`. Assigning the integer to \`previous\` copied its value at that moment. Changing \`completed\` later leaves that copy at 3. A declaration such as \`let tagline: String? = nil\` needs an explicit type because absence alone gives Swift no element type to infer.`
				},
				{
					title: "Worked Example Set: Modeling App Content with Basic Types",
					preserveInstructions: true,
					contentKind: "reading",
					content: `An array keeps the menu in display order. A dictionary looks up a subtitle by name. The lookup returns a \`String?\` because a menu item can exist without a subtitle. The nil-coalescing operator \`??\` supplies text for that case.

\`\`\`swift
let menu = ["Profile", "Favorites", "Settings"]
let subtitles = ["Profile": "About me", "Settings": "Preferences"]
for item in menu {
    let subtitle = subtitles[item] ?? "No description"
    print("\\(item): \\(subtitle)")
}
\`\`\`

The first row is \`Profile: About me\`, the second is \`Favorites: No description\`, and the third is \`Settings: Preferences\`. The missing key still produces a row because the loop iterates over the menu. Predict the second row after adding \`"Favorites": "Saved items"\` to the dictionary.`
				},
				{
					title: "Practice Lab: Turning Raw Data into View Content",
					preserveInstructions: true,
					content: `In a SwiftUI app, replace the generated ContentView with this view. An array's \`isEmpty\` property chooses the branch. ForEach creates one text row per name. The supplied names are unique, so each name can identify its own row.

\`\`\`swift
import SwiftUI

struct ContentView: View {
    let interests: [String] = ["Drawing", "Robotics"]
    var body: some View {
        VStack {
            if interests.isEmpty {
                Text("No interests yet")
            } else {
                ForEach(interests, id: \\.self) { name in
                    Text(name)
                }
            }
        }
    }
}
\`\`\`

Predict the screen, then run it in a preview or simulator. The two names appear in array order. Replace the array literal with \`[]\` and verify that the single empty-state message replaces both rows. Add a third name, sort the displayed values with \`interests.sorted()\`, and explain why the stored order stays the same.`
				},
				{
					title: "Reflection Question: Which Swift Basics Show Up Most Often in Apps?",
					preserveInstructions: true,
					content: `A profile screen shows a name, a count of saved items, and an optional biography. The count starts at zero and changes when a user taps Save. Explain which values can use \`let\`, which value needs a changing owner, and what the screen displays when the biography is missing.

Check the reasoning against two traces. Before the first tap, zero is a known count. After one tap, it is one. A missing biography is still absent in both states. Describe how using zero or an empty string to mean every kind of absence could make a correct count or an intentionally empty biography ambiguous.`
				},
				{
					title: "SAD9 Swift Basics in App Context: Core Project",
					content: swiftProfileInterestsReading,
					preserveInstructions: true,
					ideImport: true,
					projectLink: `${swiftProfileInterestsRoot}/starter`,
					solutionLink: `${swiftProfileInterestsRoot}/solution`
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Switch between Avery and Rae. Explain how the view distinguishes a missing tagline, an empty interest list and a search with no matches. Show that clearing the query restores the original names.",
					ideImport: true,
					projectLink: `${swiftProfileInterestsRoot}/starter`,
					solutionLink: `${swiftProfileInterestsRoot}/solution`
				},
				{
					title: "Swift Basics in App Context Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD9 Swift Basics in App Context",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-16-sad9-swift-basics-in-app-context-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-16-sad9-swift-basics-in-app-context-supplemental-2/solution"
				},
				{
					title: "Swift Basics in App Context Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD9 Swift Basics in App Context",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-17-sad9-swift-basics-in-app-context-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-17-sad9-swift-basics-in-app-context-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD10 Functions, Structs, and Enums",
			curriculum: [
				{
					title: "Functions and Parameter Labels",
					preserveInstructions: true,
					contentKind: "reading",
					content: `A pure function can turn a count into the same label everywhere it appears. In the declaration below, \`for\` is the argument label used by the caller. Inside the function, \`count\` names the integer. The arrow introduces the return type.

\`\`\`swift
func lessonLabel(for count: Int) -> String {
    if count == 1 { return "1 lesson" }
    return "\\(count) lessons"
}
print(lessonLabel(for: 0))
print(lessonLabel(for: 1))
print(lessonLabel(for: 2))
\`\`\`

The calls print \`0 lessons\`, \`1 lesson\`, and \`2 lessons\`. Each call returns text without changing the count or touching a view. Predict what would happen to the singular label if the condition were \`count <= 1\`, then check the zero case.`
				},
				{
					title: "Structs as App Data and Views",
					preserveInstructions: true,
					contentKind: "reading",
					content: `A model struct holds the data for a lesson. A view struct describes how to display that data. Passing a model into a row gives the row a value to read. A stable ID lets a list recognize the same lesson after its title changes.

\`\`\`swift
import SwiftUI

struct Lesson: Identifiable {
    let id: Int
    var title: String
}

struct LessonRow: View {
    let lesson: Lesson
    var body: some View { Text(lesson.title) }
}
\`\`\`

In the body of an existing view, use \`LessonRow(lesson: Lesson(id: 7, title: "Map a trail"))\`. It displays \`Map a trail\`. For an edit form, copy the model into a variable named \`draft\` and change the draft's title. The original still has its old title. Saving requires passing the edited value back to the collection that owns the lesson.`
				},
				{
					title: "Enums for App State",
					preserveInstructions: true,
					contentKind: "reading",
					content: `A download can be waiting, loading, or ready with a number of entries. An enum lets only one case be active at a time. An associated value stores information that belongs to that particular case.

\`\`\`swift
enum DownloadState {
    case waiting
    case loading
    case ready(entries: Int)
}

func message(for state: DownloadState) -> String {
    switch state {
    case .waiting: return "Choose a source"
    case .loading: return "Loading"
    case .ready(let count): return count == 0 ? "No entries" : "Entries: \\(count)"
    }
}
for state: DownloadState in [.waiting, .loading, .ready(entries: 0), .ready(entries: 2)] {
    print(message(for: state))
}
\`\`\`

The messages are \`Choose a source\`, \`Loading\`, \`No entries\`, and \`Entries: 2\`. Loading and ready-with-zero need different messages because only one has received a result. Add a \`failed\` case and let the compiler identify the switch that needs a recovery message.`
				},
				{
					title: "Reflection Question: Why Are Structs So Important in SwiftUI?",
					preserveInstructions: true,
					content: `An editor opens a copy of a lesson. It changes the title, then the user chooses Cancel. Predict both printed lines before running the example.

\`\`\`swift
struct Lesson {
    let id: Int
    var title: String
}
let saved = Lesson(id: 7, title: "Map a trail")
var draft = saved
draft.title = "Map a river"
print(saved.id, saved.title)
print(draft.id, draft.title)
\`\`\`

The output is \`7 Map a trail\` followed by \`7 Map a river\`. The ID still identifies the same lesson while the two values hold different titles. Explain how a view can discard its draft on Cancel, and what it would send back to the owner on Save. Which title would a row displaying the saved value show before Save?`
				},
				{
					title: "SAD10 Functions, Structs, and Enums: Core Project",
					content: swiftLessonCardsReading,
					preserveInstructions: true,
					ideImport: true,
					projectLink: `${swiftLessonCardsRoot}/starter`,
					solutionLink: `${swiftLessonCardsRoot}/solution`
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Trace lesson 7 from Planned through 50% and 100% to dated completion. Identify the state carried by each enum case and explain how the ID survives each change.",
					ideImport: true,
					projectLink: `${swiftLessonCardsRoot}/starter`,
					solutionLink: `${swiftLessonCardsRoot}/solution`
				},
				{
					title: "Functions, Structs, and Enums Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD10 Functions, Structs, and Enums",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-18-sad10-functions-structs-and-enums-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-18-sad10-functions-structs-and-enums-supplemental-2/solution"
				},
				{
					title: "Functions, Structs, and Enums Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD10 Functions, Structs, and Enums",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-19-sad10-functions-structs-and-enums-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-19-sad10-functions-structs-and-enums-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD11 State and Data Flow",
			curriculum: [
				{
					title: "`@State`, `@Binding`, and Observable Data",
					content:
						"`@State`, `@Binding`, `@StateObject`, and the broader observation model answer the question: who owns this data and who is allowed to change it? Focus on ownership first so the wrappers feel motivated instead of magical."
				},
				{
					title: "Worked Example Set: Local State vs Shared State",
					content:
						"Compare local toggle state, editable form state, and a small shared store so each pattern has a clear ownership boundary. Use examples that show how state bugs happen when ownership is vague or duplicated."
				},
				{
					title: "Practice Lab: Favorite Toggle and Editable Notes",
					content:
						"Build one small interaction that is purely local and one shared across multiple views. Explain why the two interactions do not deserve the same state approach."
				},
				{
					title: "Reflection Question: What Does It Mean to Own State?",
					content:
						"Define state ownership in plain language and connect it to the app bugs they are most likely to create at this stage. Clear reasoning here pays off heavily in later CRUD and networking modules."
				},
				{
					title: "SAD11 State and Data Flow: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD11 State and Data Flow",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod4Pro2"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: point to the single owner of a value and explain why a child view might need a binding rather than its own duplicate state. Prompt: predict what happens if two views each keep their own unsynchronized copy of the same setting.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod4Pro2"
				},
				{
					title: "State and Data Flow Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD11 State and Data Flow",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-20-sad11-state-and-data-flow-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-20-sad11-state-and-data-flow-supplemental-2/solution"
				},
				{
					title: "State and Data Flow Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD11 State and Data Flow",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-21-sad11-state-and-data-flow-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-21-sad11-state-and-data-flow-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD12 Navigation and Multi-Screen Apps",
			curriculum: [
				{
					title: "Navigation Stacks, Tabs, and Sheets",
					content:
						"The major beginner app navigation patterns are stack navigation, tab navigation, and sheet presentation. Each pattern has a different fit, and each changes how data moves across screen boundaries."
				},
				{
					title: "Worked Example Set: Passing Data Between Screens",
					content:
						"Build small examples where a list leads to a detail page, a tab owns a subsection of the app, and a sheet presents supporting content. Keep the focus on keeping navigation intentional rather than piling screens on top of each other."
				},
				{
					title: "Project: Multi-Tab Hobby App",
					content:
						"Build a hobby app with multiple tabs, a home dashboard, a simple schedule, and a favorites or saved-items area. This project provides a realistic app shell and requires clear decisions about shared state, routing, and what belongs on each top-level screen.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD3-Multi-Tab-Hobby-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD3-Multi-Tab-Hobby-App/solution"
				},
				{
					title: "Reflection Question: What Deserves a Tab vs a Drill-Down Screen?",
					content:
						"Defend which parts of an app deserve top-level destinations and which are reached only from context. This improves product thinking as well as navigation structure."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: explain the role of a `NavigationStack`, a `TabView`, and a sheet without using them interchangeably. Prompt: 'Why are favorites a tab in one app but a detail section in another?'",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD3-Multi-Tab-Hobby-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD3-Multi-Tab-Hobby-App/solution"
				},
				{
					title: "Navigation and Multi Screen Apps Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD12 Navigation and Multi-Screen Apps",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-22-sad12-navigation-and-multi-screen-apps-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-22-sad12-navigation-and-multi-screen-apps-supplemental-2/solution"
				},
				{
					title: "Navigation and Multi Screen Apps Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD12 Navigation and Multi-Screen Apps",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-23-sad12-navigation-and-multi-screen-apps-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-23-sad12-navigation-and-multi-screen-apps-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD13 Lists, Forms, and CRUD Patterns",
			curriculum: [
				{
					title: "Editable Lists and Forms",
					content:
						"Lists and forms are the backbone of many practical apps. Add, edit, delete, and completion-style workflows turn a static SwiftUI demo into a real data-driven product."
				},
				{
					title: "Worked Example Set: Add, Toggle, and Delete",
					content:
						"Work small examples for creating new items from form inputs, toggling item state, and deleting rows cleanly. Explain why clean data mutation matters just as much as polished layout."
				},
				{
					title: "Project: Simple Tracker App",
					content:
						"Build a simple tracker app with a creation flow, a list of items, completion toggles, and deletion support. This project is the main foundation for the later persistence module, so Keep the code organized enough to evolve rather than rewrite.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD5-Simple-Tracker-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD5-Simple-Tracker-App/solution"
				},
				{
					title: "Reflection Question: What Makes CRUD Feel Predictable?",
					content:
						"Explain which interactions in a tracker app need immediate feedback and which ones need more guardrails or confirmation. This connects interface design to data integrity."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: add an item, mutate one property on an existing item, and delete a row without introducing unclear ownership or stale UI. Prompt: describe how the list changes after an add form succeeds.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD5-Simple-Tracker-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD5-Simple-Tracker-App/solution"
				},
				{
					title: "Lists, Forms, and CRUD Patterns Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD13 Lists, Forms, and CRUD Patterns",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-24-sad13-lists-forms-and-crud-patterns-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-24-sad13-lists-forms-and-crud-patterns-supplemental-2/solution"
				},
				{
					title: "Lists, Forms, and CRUD Patterns Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD13 Lists, Forms, and CRUD Patterns",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-25-sad13-lists-forms-and-crud-patterns-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-25-sad13-lists-forms-and-crud-patterns-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD14 Media, Maps, and Device Features",
			curriculum: [
				{
					title: "Images, Icons, Maps, and Permissions",
					content:
						"Richer app features can use media and maps while keeping permissions and device integration at a practical high level. Assets, SF Symbols, images, and hardware-linked features all add responsibility as well as capability."
				},
				{
					title: "Project: Media Gallery App",
					content:
						"Build a gallery app that uses structured media data, a grid or scrolling presentation, and a richer detail view. This project is about repeated layout, clear data modeling, and making a browsing interface feel intentional.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD2-Media-Gallery-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD2-Media-Gallery-App/solution"
				},
				{
					title: "Project: Map Places App",
					content:
						"Build a places app that combines a list of locations with a map view and simple place metadata. The project introduces map-centered UI, selection-driven detail, and the basic shape of a location feature before deeper production concerns.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD4-Map-Places-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD4-Map-Places-App/solution"
				},
				{
					title: "Reflection Question: When Does a Feature Need Permission Planning?",
					content:
						"Explain which device-linked features feel simple in a demo but require more thoughtful permission messaging or privacy planning in a real app. The point is to connect feature excitement to product responsibility."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: describe when an app uses bundled assets versus remote media, and how a list selection influences a map-centered view. Prompt: 'What has to happen in the app before a location permission request makes sense?'",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD2-Media-Gallery-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD2-Media-Gallery-App/solution"
				},
				{
					title: "Media, Maps, and Device Features Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD14 Media, Maps, and Device Features",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-26-sad14-media-maps-and-device-features-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-26-sad14-media-maps-and-device-features-supplemental-2/solution"
				},
				{
					title: "Media, Maps, and Device Features Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD14 Media, Maps, and Device Features",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-27-sad14-media-maps-and-device-features-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-27-sad14-media-maps-and-device-features-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD15 Networking and Data Loading",
			curriculum: [
				{
					title: "APIs, JSON, and Async Loading",
					content:
						"Networking is a structured workflow: request data, decode JSON, represent loading state, represent error state, and render success cleanly. Most app-networking bugs are state and architecture problems as much as syntax problems."
				},
				{
					title: "Worked Example Set: Loading, Loaded, and Failed UI States",
					content:
						"Compare empty, loading, loaded, and failed states for the same feature to avoid treating the success view as the whole feature. Explain why async/await improves clarity but does not remove the need for explicit state modeling."
				},
				{
					title: "Project: API-Powered Reference App",
					content:
						"Build a simple reference app backed by a public JSON endpoint. Decode entries, show a loading indicator, handle failure gracefully, and add at least a small search or filtering experience so the result feels like an app, not just a fetch demo.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD6-API-Reference-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD6-API-Reference-App/solution"
				},
				{
					title: "Reflection Question: Why Is the Loading State Part of the Product?",
					content:
						"Explain why the user experience of waiting, retrying, or failing to load is part of the app's design quality, not just an engineering detail. This helps prevent the common beginner habit of only building the default interaction."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: explain the full path from URL to decoded model to visible list row, and name the UI states the feature must represent. Prompt: 'What does the app show before the first response arrives?'",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD6-API-Reference-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD6-API-Reference-App/solution"
				},
				{
					title: "Networking and Data Loading Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD15 Networking and Data Loading",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-28-sad15-networking-and-data-loading-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-28-sad15-networking-and-data-loading-supplemental-2/solution"
				},
				{
					title: "Networking and Data Loading Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD15 Networking and Data Loading",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-29-sad15-networking-and-data-loading-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-29-sad15-networking-and-data-loading-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD16 Persistence",
			curriculum: [
				{
					title: "Local Data That Survives Relaunch",
					content:
						"`UserDefaults`, file storage, and local persistence come before larger systems like SwiftData or Core Data. Persistence changes product expectations: a tracker that forgets everything is not the same product as one that remembers."
				},
				{
					title: "Worked Example Set: Save, Load, and Default Data",
					content:
						"Compare the first-launch state, a saved returning state, and a fallback or reset path. Use these examples to show why persistence logic needs just as much structure as the visible list UI."
				},
				{
					title: "Project Pass: Persist the Simple Tracker App",
					content:
						"Return to the tracker app and add local persistence so items survive app relaunches. Connect a lightweight store, encode/decode the list data, and keep the add/toggle/delete flows working after persistence is introduced.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD5-Simple-Tracker-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD5-Simple-Tracker-App/solution"
				},
				{
					title: "Reflection Question: What Changes Once Data Lasts?",
					content:
						"Explain how persistence changes testing, debugging, and user expectations. A strong response identifies at least one new edge case that only appears after data survives between launches."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: explain where persistent data is loaded, when it is saved, and what happens if stored data is missing or malformed. Prompt: compare a first launch with a tenth launch.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD5-Simple-Tracker-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD5-Simple-Tracker-App/solution"
				},
				{
					title: "Persistence Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD16 Persistence",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-30-sad16-persistence-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-30-sad16-persistence-supplemental-2/solution"
				},
				{
					title: "Persistence Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD16 Persistence",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-31-sad16-persistence-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-31-sad16-persistence-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD17 Debugging and Testing",
			curriculum: [
				{
					title: "Debugging as Observation",
					content:
						"Debugging is a disciplined observation process rather than trial-and-error clicking. Review console logs, breakpoints, previews, and the role of small reproducible cases in SwiftUI app work."
				},
				{
					title: "Worked Example Set: UI Bug vs Data Bug vs Build Bug",
					content:
						"Compare a broken layout, a bad state update, and a configuration/build issue so problem classification comes before attempted fixes. This helps keep debugging efficient and calm."
				},
				{
					title: "Practical Walkthrough: Previews and Basic Test Concepts",
					content:
						"Use previews for fast UI checks and introduce simple unit and UI test ideas conceptually. Testing is about confidence and regression prevention, even when the project is not ready for a large suite yet."
				},
				{
					title: "Reflection Question: Which Signal Do You Trust First?",
					content:
						"Name which debugging signals they trust most in different situations: preview behavior, runtime logs, breakpoint inspection, or user reproduction steps. This builds troubleshooting judgment instead of rote habits."
				},
				{
					title: "SAD17 Debugging and Testing: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD17 Debugging and Testing",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod4Pro3"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: choose a debugging tool that matches the kind of failure and explain the difference between a preview issue and a runtime issue. Prompt: 'If the layout looks wrong but the data is correct, where do you inspect first?'",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod4Pro3"
				},
				{
					title: "Debugging and Testing Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD17 Debugging and Testing",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-32-sad17-debugging-and-testing-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-32-sad17-debugging-and-testing-supplemental-2/solution"
				},
				{
					title: "Debugging and Testing Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD17 Debugging and Testing",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-33-sad17-debugging-and-testing-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-33-sad17-debugging-and-testing-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD18 App Design and Accessibility",
			curriculum: [
				{
					title: "Readability, Spacing, and Touch Targets",
					content:
						"Design quality is part of app quality rather than an optional finishing layer. Typography, spacing, visual hierarchy, touch target sizing, dark-mode resilience, and accessible structure all affect whether the app is usable."
				},
				{
					title: "Worked Example Set: Polishing a Rough Screen",
					content:
						"Take a rough SwiftUI screen and improve hierarchy, spacing, labeling, and contrast deliberately. Many 'ugly app' problems are really clarity problems."
				},
				{
					title: "Practice Lab: Accessibility Labels and Content Review",
					content:
						"Add accessibility labels to interactive controls and review whether the screen still makes sense with large text and clear spoken descriptions. Accessibility belongs in the baseline design habit instead of being treated as a late compliance task."
				},
				{
					title: "Reflection Question: What Makes an App Feel Intentionally Designed?",
					content:
						"Identify the difference between a screen that merely functions and a screen that feels deliberate, readable, and respectful of the user. A strong response references both aesthetics and accessibility."
				},
				{
					title: "SAD18 App Design and Accessibility: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD18 App Design and Accessibility",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod5Pro1"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: identify at least three design or accessibility problems in a rough screen and suggest concrete fixes. Prompt: 'Would this still work well with large dynamic type?'",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod5Pro1"
				},
				{
					title: "App Design and Accessibility Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD18 App Design and Accessibility",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-34-sad18-app-design-and-accessibility-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-34-sad18-app-design-and-accessibility-supplemental-2/solution"
				},
				{
					title: "App Design and Accessibility Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD18 App Design and Accessibility",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-35-sad18-app-design-and-accessibility-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-35-sad18-app-design-and-accessibility-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD19 Final Publishing Walkthrough",
			curriculum: [
				{
					title: "Archive, Upload, and Release Checklists",
					preserveInstructions: true,
					contentKind: "reading",
					content: `An archive preserves one built version of the app. Uploading it starts processing for distribution. On the store version record, the team selects the processed build, completes the listing and review information, then prepares its submission. Adding a version to a draft submission and sending that submission to App Review are distinct actions.

## Worked example

Trail Notes 1.0 (8) is selected. Its screenshot still shows a feature removed from build 8. A successful upload leaves the mismatch intact. Capture the corrected screen from build 8 and update the listing before the authorized submitter sends the draft.

## Check

What can the team verify immediately from the archive, and what requires inspecting the store record? Give one example of each.`
				},
				{
					title: "Practical Walkthrough: Build Metadata and Preflight Review",
					preserveInstructions: true,
					contentKind: "reading",
					content: `Put the selected version and build number at the top of the review sheet. Read the description and screenshots against that build. Trace the advertised task on the candidate, confirm the reviewer can reach sample data, and verify the support and privacy links. Record any missing evidence with an owner.

In the supplied case an SDK sends diagnostics, while the listing claims no data collection. Inspect the SDK configuration and actual data behavior, then reconcile the disclosure using Apple's privacy definitions. A marketing description alone cannot settle whether a particular data type is collected. [Apple privacy guidance](https://developer.apple.com/app-store/app-privacy-details/)`
				},
				{
					title: "Practical Walkthrough: TestFlight and Submission Basics",
					preserveInstructions: true,
					contentKind: "reading",
					content: `A TestFlight group can try a beta and send feedback. The store submission selects a version and build for App Review. Passing a beta test answers a question about that tested flow. Sending the store submission also requires accurate metadata and review information for the chosen build.

For build 8, write down the last beta result and the store issues still open. In a real team an authorized submitter checks the selected build, adds the version to a draft, checks the draft contents, and submits it. For this exercise, deliver a written decision and leave the release simulated.`
				},
				{
					title: "Reflection Question: What Still Needs to Be True After the App 'Works'?",
					preserveInstructions: true,
					contentKind: "reading",
					content:
						"Build 8 opens and its main task passes, but its screenshots, privacy statements, and reviewer instructions each disagree with the candidate. Which issue could prevent a reviewer from reproducing the main task? Which issue could misinform a customer before download? Which requires evidence from an included dependency? Explain what would count as resolution for each claim and identify one check to repeat if the executable changes."
				},
				{
					title: "SAD19 Final Publishing Walkthrough: Core Project",
					preserveInstructions: true,
					contentKind: "assignment",
					ideImport: false,
					content: `Audit the supplied build 8 packet. Make one row for each mismatch and record the affected artifact, evidence, correction, owner, and condition for closure. Decide whether to submit now. Then assume only the screenshot was corrected. Reassess the decision and name what still blocks it. Use the answer guide after recording both decisions.

**Completion checks:** Keep the two decisions side by side. Someone reading the second one can see which row closed, why other rows remain open, and whether each correction changes listing text or the build itself.`
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					preserveInstructions: true,
					contentKind: "assignment",
					ideImport: false,
					content: `An operator has added version 1.0 (8) to a draft review submission. The description is accurate, but the SDK diagnostic disclosure remains unresolved. State the current submission status, the evidence needed to resolve the disclosure, and who can make the final submission decision. Explain why fixing the screenshot alone cannot close this issue.

**Completion checks:** Distinguish the draft from a submission sent to App Review. Name the person or team responsible for checking the SDK and the authorized account role responsible for submitting the reconciled version.`
				},
				{
					title: "Final Publishing Walkthrough Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD19 Final Publishing Walkthrough",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-36-sad19-final-publishing-walkthrough-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-36-sad19-final-publishing-walkthrough-supplemental-2/solution"
				},
				{
					title: "Final Publishing Walkthrough Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD19 Final Publishing Walkthrough",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-37-sad19-final-publishing-walkthrough-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-37-sad19-final-publishing-walkthrough-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD20 Capstone App",
			curriculum: [
				{
					title: "Scope a Capstone Like a Real App",
					content:
						"Frame the capstone as a coherent app that can realistically be tested and presented, not as a dumping ground for every feature learned in the course. The project definition includes scope, audience, primary user flow, and the minimum set of features that make the app worth testing."
				},
				{
					title: "Build Phase: Implement, Test, and Polish",
					content:
						"Build the capstone in small passes: core navigation and data first, then persistence or networking if needed, then polish, accessibility, and release-readiness checks. Use the final project to revisit architecture, debugging, and quality tradeoffs in one place."
				},
				{
					title: "Project: Publish-Ready Capstone App",
					content:
						"Use the capstone starter as a shipping-minded shell for a final app that includes intentional navigation, polished core screens, accessibility review, and store/testing preparation notes. The final explanation covers not only what the app does, but how it would be prepared for TestFlight or the App Store.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD7-Publish-Ready-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD7-Publish-Ready-Capstone/solution"
				},
				{
					title: "Reflection Question: What Did You Learn About Shipping, Not Just Coding?",
					content:
						"Explain which parts of the course most changed the approach to building for Apple platforms. A strong response mentions at least one setup, architecture, testing, accessibility, or publishing lesson in addition to SwiftUI code."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: defend the capstone scope, explain navigation and data choices, and outline a plausible TestFlight/App Store preparation path. Prompt: 'If you had one more week, what would you improve before inviting external testers?'",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD7-Publish-Ready-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD7-Publish-Ready-Capstone/solution"
				},
				{
					title: "Capstone App Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD20 Capstone App",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-38-sad20-capstone-app-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-38-sad20-capstone-app-supplemental-2/solution"
				},
				{
					title: "Capstone App Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD20 Capstone App",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-39-sad20-capstone-app-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-39-sad20-capstone-app-supplemental-3/solution"
				}
			]
		},
		{
			title: "SADX Enrichment and Reference Boundaries",
			aliases: ["SADX Enrichment and Legacy Archive Boundaries"],
			curriculum: [
				{
					title: "Canonical Swift Repo Structure",
					aliases: ["Core Concepts"],
					content:
						"Treat the `SAD1` through `SAD7` projects as the canonical active course path. The older `Mod1Pro*` through `Mod5Pro*` folders remain available as reference material rather than as a second competing sequence."
				},
				{
					title: "Reference Material, Not Core Scope",
					content:
						"Keep the older reference folders available only for demo recovery or scaffold comparison. These materials stay outside the main public course flow. When using a reference folder, identify the specific concept being compared, such as view layout, button actions, navigation structure, or asset organization. Do not treat the older folder names as required module order; the active path remains the `SAD` sequence, and reference material is only evidence for troubleshooting, enrichment, or migration decisions. If a reference project is used, end by naming what transfers conceptually and what stays out of the active project."
				},
				{
					title: "Shapes Studio as Intentional Enrichment",
					content:
						"Expose `SADX-SwiftUI-Shapes-Studio` as optional enrichment because it still reinforces useful SwiftUI drawing and layout ideas, but it sits outside the main shipping-app spine."
				},
				{
					title: "SADX Enrichment and Reference Boundaries: Verification and Reflection",
					aliases: [
						"intro-to-swift-app-development-sadx-enrichment-and-legacy-archive-boundaries-curriculum-verification-review-sadx-enrichment-and-legacy-archive-boundaries"
					],
					content: buildSupportSectionGuidance({
						courseFamily: "Swift",
						moduleTitle: "SADX Enrichment and Reference Boundaries",
						section: "verification"
					})
				},
				{
					title: "SADX Enrichment and Reference Boundaries: Core Project",
					aliases: [
						"intro-to-swift-app-development-sadx-enrichment-and-legacy-archive-boundaries-curriculum-core-project-sadx-enrichment-and-legacy-archive-boundaries"
					],
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SADX Enrichment and Reference Boundaries",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-Swift-UI-Shapes-Studio/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-Swift-UI-Shapes-Studio/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Extension: SwiftUI Shapes Studio",
					content:
						"Use the shapes-focused enrichment pack for extra practice with paths, custom drawing, and SwiftUI composition after the main course flow is stable.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-Swift-UI-Shapes-Studio/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-Swift-UI-Shapes-Studio/solution"
				},
				{
					title: "SADX Enrichment and Reference Boundaries Transfer Practice",
					aliases: [
						"intro-to-swift-app-development-sadx-enrichment-and-legacy-archive-boundaries-supplemental-transfer-practice-sadx-enrichment-and-legacy-archive-boundaries"
					],
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SADX Enrichment and Reference Boundaries",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-40-sadx-enrichment-and-legacy-archive-boundaries-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-40-sadx-enrichment-and-legacy-archive-boundaries-supplemental-2/solution"
				},
				{
					title: "SADX Enrichment and Reference Boundaries Extension Practice",
					aliases: [
						"intro-to-swift-app-development-sadx-enrichment-and-legacy-archive-boundaries-supplemental-extension-practice-sadx-enrichment-and-legacy-archive-boundaries"
					],
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SADX Enrichment and Reference Boundaries",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-41-sadx-enrichment-and-legacy-archive-boundaries-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-41-sadx-enrichment-and-legacy-archive-boundaries-supplemental-3/solution"
				}
			]
		}
	]
};

type SwiftCourseStage =
	| "Build foundations"
	| "Extend the product"
	| "Verify quality"
	| "Prepare and ship"
	| "Optional enrichment";

interface SwiftCourseModuleFlow {
	sourceTitle: string;
	title: string;
	stage: SwiftCourseStage;
	estimatedTime: string;
	keyBlocks: string[];
	materialSection: string;
	answerSection: string;
	focus: string;
	coreRoute: string;
	stretchRoute: string;
	verification: string;
	boundary: string;
	referenceLink: string;
	projectCore: string;
	projectStretch: string;
}

const SWIFT_REFERENCES = {
	xcodeRequirements: "https://developer.apple.com/xcode/system-requirements/",
	helloSwiftUI:
		"https://developer.apple.com/tutorials/develop-in-swift/hello-swiftui",
	swiftUIPathway: "https://developer.apple.com/swiftui/get-started/",
	swiftBasics:
		"https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/",
	swiftFunctions:
		"https://docs.swift.org/swift-book/documentation/the-swift-programming-language/functions/",
	swiftAppStructure:
		"https://developer.apple.com/documentation/swiftui/app-organization",
	modelData: "https://developer.apple.com/documentation/swiftui/model-data",
	mapKit: "https://developer.apple.com/documentation/mapkit",
	navigationStack:
		"https://developer.apple.com/documentation/swiftui/navigationstack",
	list: "https://developer.apple.com/documentation/swiftui/list",
	swiftData:
		"https://developer.apple.com/documentation/swiftdata/preserving-your-apps-model-data-across-launches",
	urlSession:
		"https://developer.apple.com/documentation/foundation/urlsession",
	swiftTesting: "https://developer.apple.com/documentation/testing",
	accessibility:
		"https://developer.apple.com/design/human-interface-guidelines/accessibility/",
	runApp: "https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device",
	membership: "https://developer.apple.com/support/compare-memberships/",
	signing:
		"https://developer.apple.com/help/account/provisioning-profiles/create-an-app-store-provisioning-profile/",
	testFlight:
		"https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview",
	appReview: "https://developer.apple.com/app-store/review/guidelines/",
	submit: "https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app",
	path: "https://developer.apple.com/documentation/swiftui/path"
} as const;

const SWIFT_COURSE_FLOW: SwiftCourseModuleFlow[] = [
	{
		sourceTitle: "SAD2 Mac Setup and Project Tooling",
		title: "SW1 Mac Setup and First Launch",
		stage: "Build foundations",
		estimatedTime: "2–3 sessions",
		keyBlocks: [
			"supported macOS",
			"Xcode",
			"simulator runtime",
			"project naming",
			"build destination",
			"version record"
		],
		materialSection: "mac-setup-and-first-launch-case",
		answerSection: "mac-setup-and-first-launch-key",
		focus: "A first SwiftUI app moves from a named project to a successful simulator launch with the toolchain and destination recorded.",
		coreRoute:
			"Check the current Xcode compatibility table, create an iOS App project, identify the app entry point and first view, change visible text, and run the result in one installed simulator.",
		stretchRoute:
			"Compare preview and simulator behavior, add a second simulator size, record a reproducible clean-build routine, and explain which result belongs to source code versus local tool state.",
		verification:
			"A submission includes the Xcode version, Swift language mode, deployment target, simulator model and OS, one visible code change, and evidence that the launched build contains that change.",
		boundary:
			"A supported Mac and Xcode are required for the practical iOS route. The supplied project map and screenshots preserve a planning route when installation is unavailable; a paid developer membership is not required for this module.",
		referenceLink: SWIFT_REFERENCES.xcodeRequirements,
		projectCore:
			"Create, rename, run, and archive notes for a blank SwiftUI app without changing signing or distribution settings.",
		projectStretch:
			"Compare two destinations and write a short troubleshooting decision tree for a preview success paired with a simulator failure."
	},
	{
		sourceTitle: "SAD7 Xcode Project Anatomy",
		title: "SW2 Xcode Project Anatomy",
		stage: "Build foundations",
		estimatedTime: "2–3 sessions",
		keyBlocks: [
			"project navigator",
			"target",
			"scheme",
			"asset catalog",
			"preview canvas",
			"issue navigator"
		],
		materialSection: "xcode-project-anatomy-case",
		answerSection: "xcode-project-anatomy-key",
		focus: "A small app is easier to change when a visible screen can be traced from the app entry point through a view file, asset, target, scheme, and build destination.",
		coreRoute:
			"Use the supplied project map to locate the app entry point, ContentView, asset catalog, target settings, active scheme, preview controls, run destination, and first useful build error.",
		stretchRoute:
			"Add one grouped source folder and one asset, compare a file reference with target membership, and diagnose a supplied case where code exists but is not compiled into the active target.",
		verification:
			"Each label identifies a real Xcode role, the screen-to-source trace reaches a view included in the active target, and the final record states where to inspect a compile issue before changing unrelated settings.",
		boundary:
			"Project, target, scheme, and destination are related but not interchangeable. The course uses one app target until a later project creates a justified test target.",
		referenceLink: SWIFT_REFERENCES.helloSwiftUI,
		projectCore:
			"Annotate the supplied project diagram and make one asset-backed visual change in the first app.",
		projectStretch:
			"Repair a target-membership or asset-name mismatch and preserve a before-and-after explanation of the evidence used."
	},
	{
		sourceTitle: "SAD8 SwiftUI Mental Model",
		title: "SW3 SwiftUI Views, Layout, and Modifiers",
		stage: "Build foundations",
		estimatedTime: "3–4 sessions",
		keyBlocks: [
			"View",
			"body",
			"VStack",
			"HStack",
			"ZStack",
			"modifier order"
		],
		materialSection: "swiftui-views-layout-and-modifiers-case",
		answerSection: "swiftui-views-layout-and-modifiers-key",
		focus: "A declarative view describes the desired interface as a tree, and modifier order changes the value passed to the next step in that tree.",
		coreRoute:
			"Read a short view from the inside out, build the Welcome Profile App with text, image, stacks, spacing, and styling, and predict two modifier-order results before running them.",
		stretchRoute:
			"Extract a reusable subview, support a second screen width and large text size, and explain how identity and data inputs affect the produced view value.",
		verification:
			"The app launches, the hierarchy matches the intended grouping, every modifier has a stated purpose, the interface remains readable at a supplied alternate text size, and the explanation distinguishes declarative description from imperative drawing.",
		boundary:
			"SwiftUI may recreate view values frequently; a view struct is not a permanent screen object. Layout examples use system controls and supplied assets rather than fixed coordinates for one device.",
		referenceLink: SWIFT_REFERENCES.swiftUIPathway,
		projectCore:
			"Complete the canonical SAD1 Welcome Profile App with a coherent visual hierarchy and one reusable profile component.",
		projectStretch:
			"Add an alternate profile state, adaptive layout, and a documented modifier-order experiment without introducing navigation or shared data early."
	},
	{
		sourceTitle: "SAD9 Swift Basics in App Context",
		title: "SW4 Swift Basics in App Context",
		stage: "Build foundations",
		estimatedTime: "3–4 sessions",
		keyBlocks: [
			"let",
			"var",
			"type inference",
			"optional",
			"collection",
			"control flow"
		],
		materialSection: "swift-basics-in-app-context-case",
		answerSection: "swift-basics-in-app-context-key",
		focus: "Constants, variables, types, optionals, collections, and control flow become meaningful when they model content and decisions that a view actually presents.",
		coreRoute:
			"Model profile data with constants and variables, use arrays and dictionaries only where their shapes fit the data, unwrap one optional explicitly, and transform the values into visible SwiftUI content.",
		stretchRoute:
			"Replace loosely related values with a stronger model, compare optional-handling strategies, filter and sort a supplied collection, and write boundary cases for empty or missing data.",
		verification:
			"Every value has a justified type and mutability choice, optional absence is handled without force unwrap, collection output is deterministic, and the view displays both ordinary and empty-state cases.",
		boundary:
			"Type inference reduces annotation noise but does not remove type rules. An optional represents possible absence, not an automatic error, and force unwrapping is excluded from the core route.",
		referenceLink: SWIFT_REFERENCES.swiftBasics,
		projectCore:
			"Replace literal profile content with typed model values and render a supplied list with an explicit empty state.",
		projectStretch:
			"Add filtering, sorting, and optional metadata while keeping model transformations outside deeply nested view markup."
	},
	{
		sourceTitle: "SAD10 Functions, Structs, and Enums",
		title: "SW5 Functions, Structs, and Enums",
		stage: "Build foundations",
		estimatedTime: "3–4 sessions",
		keyBlocks: [
			"function",
			"argument label",
			"return value",
			"struct",
			"enum",
			"switch"
		],
		materialSection: "functions-structs-and-enums-case",
		answerSection: "functions-structs-and-enums-key",
		focus: "Functions name behavior, structs group related value data, and enums make a finite set of app states explicit enough for exhaustive handling.",
		coreRoute:
			"Extract one pure formatting function, model one app item as an Identifiable struct, represent a finite status with an enum, and render every status through an exhaustive switch.",
		stretchRoute:
			"Add computed properties, validation with a throwing or optional result, associated enum values, and focused tests for model behavior independent of the UI.",
		verification:
			"Function inputs and outputs are clear, the model groups one coherent concept, each enum case has visible behavior, no default branch hides an unhandled state, and repeated sample data has stable identity.",
		boundary:
			"Structs use value semantics and fit most small app models and views. Classes remain useful for shared identity or framework requirements but are not introduced merely to imitate another language.",
		referenceLink: SWIFT_REFERENCES.swiftFunctions,
		projectCore:
			"Refactor profile data into a small model, function, and display-state enum while preserving the same visible behavior.",
		projectStretch:
			"Add validation and model-only tests, then explain where value semantics reduce accidental shared mutation."
	},
	{
		sourceTitle: "SAD6 What an App Is Structurally",
		title: "SW6 App Structure and Lifecycle",
		stage: "Build foundations",
		estimatedTime: "2–3 sessions",
		keyBlocks: [
			"@main",
			"App",
			"Scene",
			"WindowGroup",
			"view hierarchy",
			"model boundary"
		],
		materialSection: "app-structure-and-lifecycle-case",
		answerSection: "app-structure-and-lifecycle-key",
		focus: "An app is a system with an entry point, scenes, view hierarchy, model data, resources, and platform services rather than one growing ContentView file.",
		coreRoute:
			"Trace startup from @main through App and WindowGroup, map the current view hierarchy, separate model data from presentation, and place assets and supporting types in understandable locations.",
		stretchRoute:
			"Extract a feature boundary, compare app-level and view-level dependencies, sketch a second scene or platform target conceptually, and identify what remains shared.",
		verification:
			"The architecture map names entry point, scene, root view, child views, model, and resources; arrows show data or ownership direction; and each proposed file boundary has one responsibility.",
		boundary:
			"File count is not architecture. The course favors the smallest structure that keeps ownership and responsibilities visible, and it does not require a named enterprise pattern.",
		referenceLink: SWIFT_REFERENCES.swiftAppStructure,
		projectCore:
			"Turn the first app into a readable multi-file structure with a model, reusable view, and documented startup path.",
		projectStretch:
			"Compare two feature-boundary options and defend the simpler one with change and testing scenarios."
	},
	{
		sourceTitle: "SAD11 State and Data Flow",
		title: "SW7 State and Data Flow",
		stage: "Build foundations",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"@State",
			"@Binding",
			"@Observable",
			"@Environment",
			"single source of truth",
			"derived state"
		],
		materialSection: "state-and-data-flow-case",
		answerSection: "state-and-data-flow-key",
		focus: "SwiftUI updates reliably when each piece of mutable data has one clear owner and dependent views receive values, bindings, or observable models intentionally.",
		coreRoute:
			"Use @State for transient view-owned data, pass a Binding to one editor, derive display values instead of storing duplicates, and use Observation for shared reference model data when the deployment target supports it.",
		stretchRoute:
			"Compare Observation with ObservableObject compatibility, inject a model through the environment, test a state transition outside the view, and diagnose a stale or duplicated source-of-truth bug.",
		verification:
			"Every mutable value has a named owner, child mutation uses an intentional binding or model method, derived values stay derived, empty and error states are represented, and the deployment-target note matches the selected observation API.",
		boundary:
			"Unclear state ownership is diagnosed before changing property wrappers. Observation integration begins with iOS 17-era platform availability. @StateObject and ObservableObject remain a compatibility route; mixing both models without an availability reason is avoided.",
		referenceLink: SWIFT_REFERENCES.modelData,
		projectCore:
			"Add a favorite toggle and editable note with explicit ownership, binding, and a visible reset path.",
		projectStretch:
			"Move related shared state into an observable model, add a transition test, and document the compatibility route for an older deployment target."
	},
	{
		sourceTitle: "SAD14 Media, Maps, and Device Features",
		title: "SW8 Media, Maps, and Permission-Aware Features",
		stage: "Extend the product",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"asset catalog",
			"SF Symbols",
			"Map",
			"coordinate",
			"permission timing",
			"privacy fallback"
		],
		materialSection: "media-maps-and-permissions-case",
		answerSection: "media-maps-and-permissions-key",
		focus: "Bundled media and supplied coordinates can create rich interfaces before a learner requests photos, contacts, microphone, camera, or live location.",
		coreRoute:
			"Build the canonical Media Gallery and Map Places apps with supplied assets, static coordinates, labels, alternate text, and a no-permission simulator route.",
		stretchRoute:
			"Add map selection, an explicit rationale screen, denied and unavailable states, and a privacy data-flow map without collecting real learner or bystander information.",
		verification:
			"Assets have stable names and accessibility descriptions, map markers come from supplied nonidentifying data, the app works with permission denied, and any proposed permission request follows an initiated feature need.",
		boundary:
			"Core work uses bundled images and static fictional places. No classroom task requires personal photos, contacts, precise location, microphone, camera, or a learner's Apple Account data.",
		referenceLink: SWIFT_REFERENCES.mapKit,
		projectCore:
			"Complete the canonical SAD2 Media Gallery and SAD4 Map Places apps using supplied nonpersonal assets and coordinates.",
		projectStretch:
			"Design and test a permission-aware enhancement with denied, restricted, unavailable, and no-network states while preserving the static fallback."
	},
	{
		sourceTitle: "SAD12 Navigation and Multi-Screen Apps",
		title: "SW9 Navigation and Multi-Screen Apps",
		stage: "Extend the product",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"NavigationStack",
			"NavigationLink",
			"TabView",
			"sheet",
			"route",
			"data passing"
		],
		materialSection: "navigation-and-multi-screen-case",
		answerSection: "navigation-and-multi-screen-key",
		focus: "Tabs represent peer destinations, stack navigation represents drill-down history, and sheets represent focused temporary work rather than interchangeable ways to add screens.",
		coreRoute:
			"Build the canonical Multi-Tab Hobby App, add one list-to-detail route, present one justified sheet, and pass model data without recreating unrelated state.",
		stretchRoute:
			"Represent routes as data, support a deep-link-like starting state, preserve selection across tabs, and test back, cancel, and save behavior for each path.",
		verification:
			"Every destination has a clear relationship to its origin, back and dismiss behavior are predictable, selected data remains consistent, and no route depends on a hidden global variable.",
		boundary:
			"NavigationStack is the core stack API for the selected modern deployment target. NavigationSplitView and UIKit navigation remain later alternatives rather than simultaneous requirements.",
		referenceLink: SWIFT_REFERENCES.navigationStack,
		projectCore:
			"Complete the canonical SAD3 Multi-Tab Hobby App with peer tabs, one drill-down detail, and one focused editor or information sheet.",
		projectStretch:
			"Add route restoration or typed navigation data and verify each path from cold launch, tab switch, and cancellation."
	},
	{
		sourceTitle: "SAD13 Lists, Forms, and CRUD Patterns",
		title: "SW10 Lists, Forms, and CRUD",
		stage: "Extend the product",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"List",
			"Form",
			"Identifiable",
			"create",
			"update",
			"delete"
		],
		materialSection: "lists-forms-and-crud-case",
		answerSection: "lists-forms-and-crud-key",
		focus: "A predictable editor separates draft input from committed model data and gives create, read, update, and delete actions stable identity and recoverable behavior.",
		coreRoute:
			"Build the in-memory SAD5 Simple Tracker list, add and edit through validated forms, toggle one status, delete intentionally, and handle empty and invalid-input states.",
		stretchRoute:
			"Add sorting and filtering, undo or confirmation for destructive action, duplicate handling, and model-level tests for create and update rules.",
		verification:
			"Rows have stable identity, edits affect the intended item, invalid drafts do not corrupt committed data, deletion is understandable and recoverable where practical, and empty state offers a next action.",
		boundary:
			"CRUD describes product actions, not automatic architecture. This module remains in memory so data-flow bugs are visible before persistence adds a second system.",
		referenceLink: SWIFT_REFERENCES.list,
		projectCore:
			"Complete the in-memory canonical SAD5 Simple Tracker with add, edit, toggle, delete, validation, and empty-state behavior.",
		projectStretch:
			"Add deterministic filtering, duplicate policy, and a reversible destructive-action path with focused model tests."
	},
	{
		sourceTitle: "SAD16 Persistence",
		title: "SW11 Persistence with SwiftData",
		stage: "Extend the product",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"@Model",
			"ModelContainer",
			"ModelContext",
			"@Query",
			"migration",
			"in-memory test store"
		],
		materialSection: "swiftdata-persistence-case",
		answerSection: "swiftdata-persistence-key",
		focus: "Persistence turns temporary model state into a stored product contract that must survive launch, edits, deletions, schema changes, and failure.",
		coreRoute:
			"Move the tracker model into SwiftData for an iOS 17-or-later route, configure a model container, insert and query items, relaunch to verify storage, and use an in-memory container for tests.",
		stretchRoute:
			"Add uniqueness or relationship behavior, document a model rename or migration risk, export or reset sample data, and compare SwiftData with a simpler UserDefaults boundary.",
		verification:
			"Create, edit, delete, and relaunch checks all pass; test data stays isolated; the selected deployment target supports the API; and schema decisions name data-loss and migration implications.",
		boundary:
			"SwiftData is available on iOS 17-era platforms. A supplied in-memory or file-backed model route preserves the lesson without CloudKit, accounts, syncing, or production personal data.",
		referenceLink: SWIFT_REFERENCES.swiftData,
		projectCore:
			"Persist the canonical SAD5 Simple Tracker locally and prove its core records survive a controlled relaunch.",
		projectStretch:
			"Add an in-memory test container, one schema-evolution note, and a safe reset or export route for sample data."
	},
	{
		sourceTitle: "SAD15 Networking and Data Loading",
		title: "SW12 Networking and Data Loading",
		stage: "Extend the product",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"URLSession",
			"async await",
			"Codable",
			"HTTP status",
			"loading state",
			"local fixture"
		],
		materialSection: "networking-and-data-loading-case",
		answerSection: "networking-and-data-loading-key",
		focus: "A network feature is a state machine with empty, loading, loaded, failed, cancelled, and stale-data possibilities rather than a success-screen callback.",
		coreRoute:
			"Decode the supplied local JSON fixture first, load equivalent public read-only data with URLSession and async/await, validate the response, and render loading, content, empty, and error states.",
		stretchRoute:
			"Add cancellation, retry, timeout explanation, cache fallback, testable client abstraction, malformed-response fixtures, and concurrency notes for UI updates.",
		verification:
			"The local fixture always works, HTTP and decoding failures are distinct, the UI never stays indefinitely loading, cancellation does not become a false error, and no secret or personal identifier enters source control.",
		boundary:
			"Core work uses a bundled nonpersonal fixture and an instructor-approved public read-only endpoint. API keys, login tokens, scraping, learner accounts, and production backends remain outside scope.",
		referenceLink: SWIFT_REFERENCES.urlSession,
		projectCore:
			"Complete the canonical SAD6 API Reference App with a local fixture, explicit state model, decode validation, and recoverable error view.",
		projectStretch:
			"Add a protocol-backed client, injected failure fixtures, cancellation, and a cache decision without storing sensitive data."
	},
	{
		sourceTitle: "SAD17 Debugging and Testing",
		title: "SW13 Debugging and Swift Testing",
		stage: "Verify quality",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"reproduction",
			"first useful signal",
			"breakpoint",
			"Swift Testing",
			"#expect",
			"regression case"
		],
		materialSection: "debugging-and-swift-testing-case",
		answerSection: "debugging-and-swift-testing-key",
		focus: "Debugging narrows a reproducible discrepancy with evidence, while a regression test preserves the corrected expectation at the smallest useful boundary.",
		coreRoute:
			"Reproduce a supplied model or UI bug, classify build, runtime, state, data, or layout evidence, inspect the earliest useful signal, fix one cause, and add a Swift Testing check for pure model behavior.",
		stretchRoute:
			"Parameterize boundary cases, test asynchronous loading with an injected client, compare Swift Testing with XCTest UI-test responsibilities, and attach useful failure context.",
		verification:
			"The report contains reproduction steps, expected and observed behavior, first useful signal, smallest causal change, passing regression evidence, and one limitation not covered by the test.",
		boundary:
			"Swift Testing is used in a test target, not the shipping app target. XCTest remains relevant for UI automation; previews, manual checks, unit tests, and UI tests provide different evidence.",
		referenceLink: SWIFT_REFERENCES.swiftTesting,
		projectCore:
			"Repair one supplied tracker or network-state defect and add a Swift Testing regression that fails before the correction and passes after it.",
		projectStretch:
			"Add parameterized and asynchronous cases, then explain what remains for simulator or UI-level validation."
	},
	{
		sourceTitle: "SAD18 App Design and Accessibility",
		title: "SW14 App Design and Accessibility",
		stage: "Verify quality",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"visual hierarchy",
			"Dynamic Type",
			"VoiceOver",
			"touch target",
			"contrast",
			"Accessibility Inspector"
		],
		materialSection: "design-and-accessibility-case",
		answerSection: "design-and-accessibility-key",
		focus: "An interface is complete only when its hierarchy, actions, status, and content remain perceivable and operable through more than one visual or motor path.",
		coreRoute:
			"Audit one project for hierarchy, labels, Dynamic Type, VoiceOver order, touch targets, contrast, noncolor status, empty states, and understandable destructive actions; then repair the highest-impact barriers.",
		stretchRoute:
			"Use Accessibility Inspector, test Reduce Motion and increased contrast, add custom accessibility actions only where native semantics are insufficient, and document remaining risk.",
		verification:
			"Core flow works at a supplied large text size, controls have accurate names and roles, state is not color-only, reading order follows task order, and the audit records before-and-after evidence.",
		boundary:
			"Accessibility is a continuing design requirement rather than one late checklist. Native controls and adaptable layout are preferred before custom accessibility metadata or fixed-size exceptions.",
		referenceLink: SWIFT_REFERENCES.accessibility,
		projectCore:
			"Audit and improve the Welcome Profile, Tracker, or API app with a recorded large-text and screen-reader pass.",
		projectStretch:
			"Test additional accessibility settings, prioritize unresolved barriers, and explain one design tradeoff without claiming universal compliance."
	},
	{
		sourceTitle: "SAD4 Running on Simulator and Device",
		title: "SW15 Simulator and Device Validation",
		stage: "Prepare and ship",
		estimatedTime: "2–3 sessions",
		keyBlocks: [
			"scheme",
			"destination",
			"simulator",
			"device",
			"console",
			"smoke test"
		],
		materialSection: "simulator-and-device-validation-case",
		answerSection: "simulator-and-device-validation-key",
		focus: "A successful compile, simulator launch, and real-device validation are separate claims with different evidence and hardware limits.",
		coreRoute:
			"Run a release candidate on two supplied simulator profiles, perform the common smoke checklist, inspect console output, and document device-only checks as conditional rather than required.",
		stretchRoute:
			"Use a personally controlled device through a free Personal Team route where available, compare permissions and performance, and isolate one simulator-device discrepancy.",
		verification:
			"The report records scheme, destination, OS, build configuration, launch result, core-flow checks, console anomalies, and which device-only claims remain untested.",
		boundary:
			"No learner is required to own or connect an iPhone. A free Apple Account can support personal on-device testing, while simulator evidence remains the complete core route.",
		referenceLink: SWIFT_REFERENCES.runApp,
		projectCore:
			"Execute and record a repeatable simulator smoke test for the current strongest app.",
		projectStretch:
			"Compare a personally controlled device with the simulator and diagnose one evidence-backed difference without collecting device identifiers in the submission."
	},
	{
		sourceTitle: "SAD1 Apple Developer Ecosystem Overview",
		title: "SW16 Apple Development and Distribution Map",
		stage: "Prepare and ship",
		estimatedTime: "1–2 sessions",
		keyBlocks: [
			"Xcode",
			"Apple Account",
			"Developer Program",
			"App Store Connect",
			"TestFlight",
			"App Review"
		],
		materialSection: "apple-development-and-distribution-map-case",
		answerSection: "apple-development-and-distribution-map-key",
		focus: "Local development, personal device testing, beta distribution, and public App Store release are different access levels with different accounts, roles, artifacts, and review steps.",
		coreRoute:
			"Map Xcode, an Apple Account, the paid Developer Program, App Store Connect, TestFlight, App Review, and the App Store to the build or decision each one controls.",
		stretchRoute:
			"Compare individual, organization, and classroom-team scenarios, identify role dependencies, and design a simulated release route when a paid account is unavailable.",
		verification:
			"Each pipeline stage names its audience, account or role requirement, input artifact, output, and a condition that can block progress without implying that payment is required to learn SwiftUI.",
		boundary:
			"Core coding and simulator work remain free. Paid membership and organizational access are optional distribution resources controlled by an adult or organization, not course completion requirements.",
		referenceLink: SWIFT_REFERENCES.membership,
		projectCore:
			"Complete a release-ladder map for the capstone and mark exactly where the free learning route ends.",
		projectStretch:
			"Add individual and organization role branches and a classroom simulation that requires no shared credentials."
	},
	{
		sourceTitle: "SAD3 Certificates, Signing, and Bundle IDs",
		title: "SW17 Signing, Teams, and Bundle IDs",
		stage: "Prepare and ship",
		estimatedTime: "2–3 sessions",
		keyBlocks: [
			"bundle identifier",
			"team",
			"certificate",
			"provisioning profile",
			"capability",
			"signing error"
		],
		materialSection: "signing-teams-and-bundle-ids-case",
		answerSection: "signing-teams-and-bundle-ids-key",
		focus: "Signing links an app identifier, team authorization, certificate, entitlements, and build destination so a platform can verify who may run or distribute a build.",
		coreRoute:
			"Use the supplied signing matrix to distinguish bundle ID, team, certificate, profile, capability, and destination; inspect Xcode's signing surface without creating or sharing credentials.",
		stretchRoute:
			"Classify supplied signing failures, trace a capability mismatch, compare automatic and manual signing conceptually, and identify the minimum role required for each correction.",
		verification:
			"The diagnosis names the failed layer and supporting message, preserves a unique reverse-DNS identifier, avoids random setting changes, and proposes a correction within the learner's actual account role.",
		boundary:
			"Certificates, private keys, provisioning files, passwords, recovery codes, and team invitations are never submitted or shared. Learners without account access use the complete supplied diagnostic cases.",
		referenceLink: SWIFT_REFERENCES.signing,
		projectCore:
			"Annotate a signing relationship map and resolve three supplied configuration cases without touching a real distribution account.",
		projectStretch:
			"Add entitlement and role constraints to the matrix and explain when an instructor or account holder must perform the action."
	},
	{
		sourceTitle: "SAD5 App Store Connect and TestFlight Workflow",
		title: "SW18 App Store Connect and TestFlight",
		stage: "Prepare and ship",
		estimatedTime: "2–3 sessions",
		keyBlocks: [
			"app record",
			"build number",
			"internal tester",
			"external tester",
			"beta review",
			"feedback"
		],
		materialSection: "app-store-connect-and-testflight-case",
		answerSection: "app-store-connect-and-testflight-key",
		focus: "TestFlight distribution joins a processed build, app record, tester group, beta information, role permissions, review state, and a feedback loop.",
		coreRoute:
			"Use a supplied App Store Connect case to order app-record creation, archive upload, processing, export-compliance response, group assignment, beta notes, invitation, feedback, and build expiration.",
		stretchRoute:
			"Compare internal and external tester constraints, design a privacy-preserving feedback plan, triage crash and session evidence, and prepare a no-account simulation for classroom review.",
		verification:
			"The workflow distinguishes internal from external testing, notes that the first external build may need review, records build lifetime and role dependencies, and never treats a tester list as public course data.",
		boundary:
			"Live TestFlight use is optional and requires an enrolled team with appropriate roles. Core work uses fictional app records and testers; no learner email addresses or shared account credentials are collected.",
		referenceLink: SWIFT_REFERENCES.testFlight,
		projectCore:
			"Prepare a simulated TestFlight release packet with beta description, test focus, build record, group choice, and feedback triage.",
		projectStretch:
			"Compare internal and external routes, add one review or export-compliance blocker, and revise the release packet after supplied feedback."
	},
	{
		sourceTitle: "SAD20 Capstone App",
		title: "SW19 Capstone Build and User Testing",
		stage: "Prepare and ship",
		estimatedTime: "8–12 sessions",
		keyBlocks: [
			"problem statement",
			"minimum viable flow",
			"iteration",
			"test plan",
			"accessibility",
			"release candidate"
		],
		materialSection: "capstone-build-and-user-testing-case",
		answerSection: "capstone-build-and-user-testing-key",
		focus: "A capstone becomes credible through a small coherent user flow, explicit data ownership, tested failure states, accessibility evidence, and bounded claims rather than feature count.",
		coreRoute:
			"Choose or adapt the canonical SAD7 capstone, define audience without collecting personal data, build one complete flow, use local data or fixtures, test ordinary and failure states, and conduct a structured review with fictional tasks.",
		stretchRoute:
			"Add one justified persistence, networking, map, or media feature; use an injected test boundary; collect nonidentifying issue counts; and revise the highest-impact usability or reliability problem.",
		verification:
			"The release candidate launches from a clean simulator state, completes the primary task, handles empty and failure states, preserves data as claimed, passes model tests, records accessibility checks, and lists known limitations.",
		boundary:
			"The capstone does not require live accounts, analytics, payments, personal data, production services, or public release. User testing uses fictional scenarios and avoids recording names, contact details, precise locations, or sensitive content.",
		referenceLink: SWIFT_REFERENCES.appReview,
		projectCore:
			"Complete the canonical SAD7 Publish-Ready Capstone as a tested release candidate with a scoped primary flow and evidence packet.",
		projectStretch:
			"Add one architecturally justified feature, automated boundary test, and evidence-backed revision without expanding beyond the stated release scope."
	},
	{
		sourceTitle: "SAD19 Final Publishing Walkthrough",
		title: "SW20 Final Publishing Walkthrough",
		stage: "Prepare and ship",
		estimatedTime: "2–3 sessions",
		keyBlocks: [
			"archive",
			"version",
			"build",
			"privacy details",
			"review notes",
			"release decision"
		],
		materialSection: "final-publishing-walkthrough-case",
		answerSection: "final-publishing-walkthrough-key",
		focus: "Publishing is a release decision supported by a reproducible archive, accurate metadata, privacy answers, reviewer context, smoke evidence, ownership, and a rollback or follow-up plan.",
		coreRoute:
			"Complete the supplied preflight ledger for archive, version and build numbers, screenshots, description, support and privacy links, app privacy answers, review notes, test account or demo mode, and release choice.",
		stretchRoute:
			"Evaluate a rejection case, third-party SDK privacy change, phased release, manual release, transfer or role constraint, and a post-release defect response.",
		verification:
			"Every claim in metadata matches the build, privacy answers include third-party behavior, reviewer access is complete, no placeholder remains, and unresolved blockers produce a no-submit decision rather than optimism.",
		boundary:
			"Submitting a live app is optional and performed only by an authorized account holder or team member. The complete course outcome is a simulated submission packet and validated release candidate.",
		referenceLink: SWIFT_REFERENCES.submit,
		projectCore:
			"Prepare and audit the capstone's simulated submission packet, then make a documented submit or hold decision.",
		projectStretch:
			"Respond to a supplied review rejection or privacy change and revise the packet, build plan, and release decision."
	},
	{
		sourceTitle: "SADX Enrichment and Reference Boundaries",
		title: "SWX Shapes and Legacy Reference Boundaries",
		stage: "Optional enrichment",
		estimatedTime: "2–4 optional sessions",
		keyBlocks: [
			"Path",
			"Shape",
			"GeometryReader",
			"coordinate space",
			"legacy comparison",
			"transfer note"
		],
		materialSection: "shapes-and-legacy-reference-case",
		answerSection: "shapes-and-legacy-reference-key",
		focus: "Custom drawing can deepen SwiftUI geometry understanding, while legacy source remains evidence for comparison rather than a second required course sequence.",
		coreRoute:
			"Use the optional Shapes Studio to read points and paths, create one parameterized Shape, preview it at multiple sizes, and document which legacy idea transfers to modern SwiftUI.",
		stretchRoute:
			"Animate shape data accessibly, test inset or scaling behavior, compare a legacy implementation with the current API, and record one migration decision.",
		verification:
			"The shape adapts to supplied frames, avoids one-device coordinates, has a nonanimated or reduced-motion representation, and the legacy comparison names both transferable concept and obsolete implementation detail.",
		boundary:
			"Shapes Studio is optional enrichment after the core app path. Legacy Mod* folders remain instructor reference and never become hidden prerequisites.",
		referenceLink: SWIFT_REFERENCES.path,
		projectCore:
			"Complete one adaptive custom Shape and a short modern-versus-legacy transfer note.",
		projectStretch:
			"Add animatable data and reduced-motion behavior, then verify geometry across three frame shapes."
	}
];

function swiftPracticePack(section: string) {
	return `/course-assets/swift/intro-swift-practice-pack.md#${section}`;
}

function swiftVerificationGuide(section: string) {
	return `/course-assets/swift/intro-swift-verification-guide.md#${section}`;
}

function contextualSwiftTitle(
	item: RawCourseModuleItem,
	flow: SwiftCourseModuleFlow
) {
	if (item.title === "Diagnostic Checkpoint")
		return `${flow.title}: Readiness Check`;
	if (item.title === "Mod5Pro3")
		return "Distribution Pipeline Reference Walkthrough";
	if (item.title.startsWith("Worked Example Set:"))
		return `${flow.title}: ${item.title.replace("Worked Example Set:", "Worked Cases —")}`;
	return item.title;
}

function contextualizeSwiftItem(
	item: RawCourseModuleItem,
	flow: SwiftCourseModuleFlow,
	isSupplemental: boolean
): RawCourseModuleItem {
	const canonicalWorkspace = swiftCanonicalWorkspaces.find(workspace =>
		[item.projectLink, item.solutionLink].some(
			link => link && swiftCourseResource(link)?.pack === workspace.pack
		)
	);
	const welcomeProject =
		flow.title === "SW3 SwiftUI Views, Layout, and Modifiers" &&
		item.title === "Project: Welcome Profile App";
	const networkingProject =
		flow.title === "SW12 Networking and Data Loading" &&
		item.title === "Project: API-Powered Reference App";
	const networkingWorkspace =
		networkingProject ||
		(flow.title === "SW12 Networking and Data Loading" &&
			item.title === "Diagnostic Checkpoint");
	const trackerProject =
		flow.title === "SW10 Lists, Forms, and CRUD" &&
		item.title === "Project: Simple Tracker App";
	const persistenceProject =
		flow.title === "SW11 Persistence with SwiftData" &&
		item.title === "Project Pass: Persist the Simple Tracker App";
	const trackerWorkspace =
		trackerProject ||
		(flow.title === "SW10 Lists, Forms, and CRUD" &&
			item.title === "Diagnostic Checkpoint");
	const persistenceWorkspace =
		persistenceProject ||
		(flow.title === "SW11 Persistence with SwiftData" &&
			item.title === "Diagnostic Checkpoint");
	const workspaceRoot = trackerWorkspace
		? swiftTrackerRoot
		: persistenceWorkspace
			? swiftDataTrackerRoot
			: networkingWorkspace
				? swiftNetworkingRoot
				: (canonicalWorkspace?.root ?? null);
	const projectReading = trackerProject
		? swiftTrackerReading
		: persistenceProject
			? swiftDataTrackerReading
			: networkingProject
				? swiftNetworkingReading
				: item.title.startsWith("Project:")
					? (canonicalWorkspace?.reading ?? null)
					: null;
	const sourceTopic = flow.sourceTitle.replace(/^SAD\d+\s+/u, "");
	const diagnosticAliases =
		item.title === "Diagnostic Checkpoint" &&
		sourceTopic !== flow.sourceTitle
			? [
					`Diagnostic Checkpoint: ${sourceTopic}`,
					`Understanding Check: ${sourceTopic}`
				]
			: [];
	const priorTitles: Record<string, string> = swiftPriorTitles;
	const priorTitle = priorTitles[item.title];
	const practiceMatch = isSupplemental
		? item.title.match(/^(.+?) (Transfer|Extension) Practice$/u)
		: null;
	const suppliedCasePractice =
		Boolean(practiceMatch) &&
		/\/Swift\/tree\/[^/]+\/SAD-\d{2}-[^/]+\/starter$/u.test(
			item.projectLink ?? ""
		);
	const usesCaseResource =
		suppliedCasePractice ||
		(item.contentKind === "assignment" && item.ideImport === false);
	const previousPracticeTitle = practiceMatch
		? `${practiceMatch[2]} Practice: ${practiceMatch[1]}`
		: null;
	const practiceLink = swiftPracticePack(flow.materialSection);
	const verificationLink = swiftVerificationGuide(flow.answerSection);
	const authoredReading = item.preserveInstructions
		? `${item.content.trim()}\n\n[Practice case](${practiceLink}) · [Check the result](${verificationLink})`
		: projectReading;
	const isExtension =
		flow.stage === "Optional enrichment" ||
		item.title.includes("Extension") ||
		item.title.includes("Transfer Practice") ||
		item.title === "Mod5Pro3";
	const completionRoute = isSupplemental
		? `**Completion route:** Core: ${flow.projectCore} Stretch: ${flow.projectStretch}`
		: `**Practice route:** Core: ${flow.coreRoute} Stretch: ${flow.stretchRoute}`;
	const caseToolchain: Record<string, string> = {
		"networking-and-data-loading-case":
			"Use bundled nonpersonal JSON for the core case. Optional public HTTPS endpoints must support read-only requests without credentials.",
		"signing-teams-and-bundle-ids-case":
			"Use the supplied signing failures to identify the required team role. Live account changes require authorization from that account's owner.",
		"shapes-and-legacy-reference-case":
			"Shapes Studio is optional enrichment after the core projects. Legacy Mod* examples support code comparison."
	};
	const practiceTask = (
		item.title.includes("Extension")
			? flow.projectStretch
			: flow.projectCore
	).replace(
		"when an instructor or account holder must perform the action",
		"which account role is authorized to perform the action"
	);
	const practiceToolchain =
		caseToolchain[flow.materialSection] ?? flow.boundary;
	const suppliedCaseReading = `## Assignment

${flow.focus}

${practiceTask}

Use the [supplied ${flow.title} case](${practiceLink}) for its initial data, project map or observed failure.

## Evidence

${flow.verification}

Record the initial condition, expected result, observed result and the evidence supporting the conclusion. A written case analysis records predictions separately from an executed app check.

## Reference

After the attempt, compare the baseline reasoning with the [verification guide](${verificationLink}) and explain how the task changes the expected evidence.

## Toolchain

${practiceToolchain}

[Primary reference](${flow.referenceLink})`;
	const legacyNote = `The visible ${flow.title} sequence is the active learner order. The source-pack label ${flow.sourceTitle} remains as an alias so established starter, solution, and archive links stay traceable.`;

	return {
		...item,
		title: contextualSwiftTitle(item, flow),
		aliases: [
			...new Set([
				...(item.aliases ?? []),
				item.title,
				...diagnosticAliases,
				...(previousPracticeTitle ? [previousPracticeTitle] : []),
				...(priorTitle ? [priorTitle] : [])
			])
		],
		ideImport: suppliedCasePractice
			? false
			: welcomeProject || workspaceRoot
				? true
				: item.ideImport,
		preserveInstructions:
			suppliedCasePractice || authoredReading
				? true
				: item.preserveInstructions,
		content: suppliedCasePractice
			? suppliedCaseReading
			: welcomeProject
				? swiftWelcomeReading.trim()
				: authoredReading
					? authoredReading.trim()
					: `${item.content.trim()}

**Course position:** ${flow.stage}. ${legacyNote}

**Build focus:** ${flow.focus}

${completionRoute}

**Verification gate:** ${flow.verification}

**Toolchain and access boundary:** ${flow.boundary}

**Local continuity:** Use the [supplied practice case](${practiceLink}) when Xcode, a compatible Mac, a simulator runtime, a device, network access, or an Apple distribution account is unavailable. Check the result against the [verification guide](${verificationLink}); preserve the learner's reasoning and only then compare the expected evidence.

**Primary reference:** [Open the current first-party reference](${flow.referenceLink}). Record the Xcode version, Swift language mode, deployment target, and relevant API availability before copying version-sensitive steps.`,
		learningPath:
			flow.stage === "Optional enrichment" ||
			item.title.includes("Extension")
				? "challenge"
				: isExtension
					? "choice"
					: "core",
		projectLink: usesCaseResource
			? practiceLink
			: workspaceRoot
				? `${workspaceRoot}/starter`
				: (item.projectLink ?? flow.referenceLink),
		solutionLink: usesCaseResource
			? verificationLink
			: workspaceRoot
				? `${workspaceRoot}/solution`
				: (item.solutionLink ?? verificationLink),
		datasetLink: usesCaseResource ? undefined : practiceLink,
		mediaLink: item.mediaLink ?? flow.referenceLink
	};
}

const sourceSwiftModules = new Map(
	introToSwiftAppDevelopmentSourceCourse.modules.map(module => [
		module.title,
		module
	])
);

export const introToSwiftAppDevelopmentCourse: RawCourse = {
	name: introToSwiftAppDevelopmentSourceCourse.name,
	modules: SWIFT_COURSE_FLOW.map(flow => {
		const sourceModule = sourceSwiftModules.get(flow.sourceTitle);
		if (!sourceModule)
			throw new Error(`Missing Swift source module: ${flow.sourceTitle}`);

		return {
			...sourceModule,
			title: flow.title,
			aliases: [
				...new Set([...(sourceModule.aliases ?? []), flow.sourceTitle])
			],
			kind: flow.stage === "Optional enrichment" ? "appendix" : "module",
			estimatedTime: flow.estimatedTime,
			keyBlocks: [...flow.keyBlocks],
			curriculum: sourceModule.curriculum.map(item =>
				contextualizeSwiftItem(item, flow, false)
			),
			supplementalProjects: sourceModule.supplementalProjects.map(item =>
				contextualizeSwiftItem(item, flow, true)
			)
		};
	}),
	developmentMetadata: {
		priority: "soon",
		standards: [
			"Apple Develop in Swift and SwiftUI first-party learning progression",
			"Swift API Design Guidelines and Swift language reference",
			"Apple Human Interface Guidelines with accessibility integrated into every project",
			"App Store Connect, TestFlight, privacy, and App Review first-party operational guidance"
		],
		sourcePolicy:
			"Keep the seven canonical instruction-material/Swift app projects in their established SAD1–SAD7 order while presenting SW1–SW20 as the active lesson sequence. Legacy Mod* projects and Shapes Studio remain traceable reference or optional enrichment, not a competing prerequisite path. Every version-sensitive lesson links to a first-party Apple or Swift source plus a supplied local continuity case.",
		assessmentCadence: [
			"Each module ends with a uniquely named readiness check tied to a launch, model, interaction, test, accessibility, or release artifact.",
			"Each canonical app passes a simulator smoke route plus ordinary, empty, and failure-state checks before the next project adds complexity.",
			"Model and networking work includes focused Swift Testing evidence where the boundary can run without UI automation.",
			"Accessibility, privacy, and no-device or no-account equivalents are checked throughout instead of being deferred to publishing.",
			"The capstone ends with a release-candidate evidence packet and an explicit submit-or-hold decision."
		],
		toolchain: [
			"Current stable Xcode on a supported macOS version, checked against Apple's current compatibility table.",
			"SwiftUI with the selected Swift language mode and deployment target recorded at course start.",
			"Simulator-first core route; no personally owned iPhone or paid Developer Program membership is assumed.",
			"Observation and SwiftData use an iOS 17-or-later route with compatibility notes rather than unmarked version assumptions.",
			"Bundled JSON, fictional map coordinates, supplied assets, and in-memory test stores preserve deterministic offline practice."
		],
		safetyPolicy: [
			"Do not collect learner or bystander photos, contacts, precise location, microphone recordings, account identifiers, device identifiers, or other personal data.",
			"Do not commit API keys, signing certificates, private keys, provisioning files, passwords, recovery codes, tokens, or team invitations.",
			"Permission-aware projects remain fully functional with supplied assets and fictional data when permission is denied or hardware is absent.",
			"Live App Store Connect, TestFlight, signing, and submission actions are optional and performed only through an authorized adult or organizational role.",
			"User-testing tasks use fictional scenarios and nonidentifying issue records rather than recording people or sensitive content."
		],
		courseBoundaries: [
			"This is a first SwiftUI app-development course, not a comprehensive Swift algorithms, UIKit, Objective-C, backend, cloud, payments, analytics, or production operations course.",
			"SW1–SW14 form the account-free build and quality core; SW15–SW20 add conditional device and distribution understanding without making paid access a completion requirement.",
			"The seven canonical app projects are Welcome Profile, Media Gallery, Multi-Tab Hobby, Map Places, Simple Tracker, API Reference, and Publish-Ready Capstone.",
			"Modern APIs carry deployment-target notes; compatibility alternatives are explained when they clarify ownership or availability rather than taught as duplicate full tracks.",
			"Legacy source is used only for comparison, troubleshooting, or migration evidence and is never hidden required work."
		],
		capstoneExpectations: [
			"One scoped primary user flow with explicit audience, criteria, and non-goals.",
			"Clear model ownership, intentional navigation, and a bounded persistence or networking decision.",
			"Ordinary, empty, loading or failure, and recovery states appropriate to the selected feature set.",
			"Focused model or client tests plus a reproducible simulator smoke record.",
			"Large-text, screen-reader semantics, noncolor state, privacy, and permission-fallback evidence.",
			"A simulated submission packet with accurate metadata, limitations, privacy answers, and a documented submit-or-hold decision."
		],
		recommendedNextWork: [
			"Keep the canonical Swift source repository's starter and solution projects aligned with the visible SW1–SW20 sequence while preserving existing folder URLs.",
			"Recheck version-sensitive Observation, SwiftData, testing, simulator, signing, and App Store Connect notes whenever the supported Xcode baseline changes.",
			"Add instructor-captured simulator screenshots or short transcripts only when they have stable, accessible URLs and a matching text route."
		]
	}
};
