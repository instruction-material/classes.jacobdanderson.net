import {
	webContactRoot,
	webDeploymentRoot,
	webModulePortfolioRoot,
	webNotesRoot
} from "../../modules/webProjectResources";
import type { RawCourse, RawCourseModuleItem } from "./types";

const asset =
	"/course-assets/web-development-foundations/web-development-foundations-";
type Practice = {
	root: string;
	worksheet: string;
	tasks: Record<string, string>;
};

const feature: Practice = {
	root: webNotesRoot,
	worksheet: "feature-slice-capstone",
	tasks: {
		"Core Project: Feature Slice Studio":
			"Complete the Workshop kit case. Trace the assigned ID from create through reload, retain the failed submission and repair it. Submit your trace, keyboard checks and three deferred features.",
		"Extension Challenge: Feature Slice Studio":
			"Add a count of visible notes beside the list. Create Poster box, reload, then delete it. Check that the count follows the returned list and that a failed write leaves it unchanged.",
		"Feature Slice Transfer Practice":
			"Repeat the slice with title Brush box, body Pack two brushes. and tags []. Open a second tab, rename the note in the first tab and reload the second. Compare the ID and visible title.",
		"Feature Slice Extension Practice":
			"Create a note titled Paper tray. Try creating the same title again. Add a conflict message that keeps the draft editable. Change only the title and record the result of retrying."
	}
};
const api: Practice = {
	root: webContactRoot,
	worksheet: "api-integration-capstone",
	tasks: {
		"Core Project: API Integration Studio":
			"Complete the Workshop Host case. Submit the request matrix, safe log fields, draft recovery and retry observations.",
		"Extension Challenge: API Integration Studio":
			"Add a retry hint for a rate-limited submission using the response’s Retry-After header. Send seven valid requests inside one fresh window, compare the hint with the header and retry manually after the interval.",
		"API Integration Transfer Practice":
			"Use the worksheet request with topic project. Compare omitting replyTo with supplying host@example.invalid. Record the differing status, field report and simulated delivery.",
		"API Integration Extension Practice":
			"Add distinct browser messages for delivery_unavailable and delivery_timeout. Run the fail and timeout scenarios from the worksheet, keep the same draft and submit after ordinary startup."
	}
};
const persistence: Practice = {
	root: webNotesRoot,
	worksheet: "data-persistence-capstone",
	tasks: {
		"Core Project: Data Persistence Studio":
			"Complete the Blue bin and Red bin case. Submit the two IDs, update and conflict evidence, backup digest and comparison with the separate restore target.",
		"Extension Challenge: Data Persistence Studio":
			"Write a snapshot comparison keyed by note ID. Reverse the records in a copy, then change one body in another copy. Report which ID and field differ for each comparison.",
		"Data Persistence Transfer Practice":
			"Create Kit and kit with identical bodies and empty tags. Query each exact title, update only the second by ID and compare both after reload.",
		"Data Persistence Extension Practice":
			"Duplicate one record in a disposable snapshot and attempt a fresh restore. Keep the original, record the startup result and repeat with an untouched copy on a new target."
	}
};
const readiness: Practice = {
	root: webNotesRoot,
	worksheet: "deployment-readiness-capstone",
	tasks: {
		"Core Project: Deployment Readiness Studio":
			"Complete the Pickup list release rehearsal. Retain A, evaluate B with writes frozen, restore into the separate target and submit the release decision with evidence.",
		"Extension Challenge: Deployment Readiness Studio":
			"Write a loopback acceptance check that compares /health, /api/ready and the exact-title Pickup list response. Record the exit status on A, unavailable B and restored A.",
		"Deployment Readiness Transfer Practice":
			"After taking a separate practice snapshot, add Late pickup to its source. Restore the earlier snapshot on a fresh target and identify which write would be lost at cutover.",
		"Deployment Readiness Extension Practice":
			"Add a restore check that verifies the original Pickup list ID, body and tags before accepting writes. Test it against a clean restore and a disposable target where only the body changed."
	}
};
const hosting: Practice = {
	root: webDeploymentRoot,
	worksheet: "deployment-preflight",
	tasks: {
		"Core Project: Hosting and Operations Topics to Add":
			"Run the two local services and build retained A. Stop only the API, inspect the still-served page and recover the API. Record process, port and observable failure for each boundary.",
		"Workflow Notebook: Hosting and Operations Topics":
			"Record the ownership of ports 4173 and 4001, the public API URL and the allowed page origin. Attach a request before and after restarting only the API.",
		"Hosting Ops Transfer Practice":
			"Serve the front end from a second free port. Compare the new page origin with FRONTEND_ORIGIN, then restart the API with the matching value and repeat the browser request.",
		"Hosting Ops Extension Practice":
			"Alter env.js in a disposable copy of retained A. Run verify, preserve its result and stage a new target from intact A. Compare the recovered manifest and page."
	}
};
const advanced: Practice = {
	root: webNotesRoot,
	worksheet: "deployment-readiness-capstone",
	tasks: {
		"Core Project: Suggested Advanced Strand":
			"Run the Notes A/B rehearsal and create a timeline of process health, storage readiness and the visible form. Record the first signal that would hold traffic.",
		"Workflow Notebook: Suggested Advanced Strand":
			"Record the time, endpoint, status and decision for the healthy instance, unavailable instance and restored target. Retain only redacted log fields.",
		"Operations Strand Transfer Practice":
			"Compare a stopped second instance with a listening instance using NOTES_SCENARIO=unavailable. Classify connection failure, health and readiness separately.",
		"Operations Strand Extension Practice":
			"Write a local readiness monitor that samples /api/ready three times with a bounded timeout. Run it during normal service, unavailable storage and after recovery. Keep status and elapsed time for every sample."
	}
};
const network: Practice = {
	root: webDeploymentRoot,
	worksheet: "deployment-preflight",
	tasks: {
		"Core Project: Integration with Network Topics":
			"Trace the page request from loopback 4173 to the API on 4001. Compare stopping the API with setting the wrong allowed origin. Record direct HTTP and browser results for both.",
		"Workflow Notebook: Integration with Network Topics":
			"Record page origin, API origin, requested path and returned origin header. Draw where a future HTTPS reverse proxy would sit.",
		"Network Integration Transfer Practice":
			"Use http://127.0.0.1:4174 as FRONTEND_ORIGIN while the page is still on 4173. Capture the response headers and browser result, restore 4173 and retest.",
		"Network Integration Extension Practice":
			"Point the page at /not-a-status-prefix on the correct API port. Compare the Network entry with the wrong-origin case, then restore the original configuration and reload."
	}
};
const expansion: Practice = {
	root: webDeploymentRoot,
	worksheet: "deployment-preflight",
	tasks: {
		"Core Project: Expansion Ideas and Next Steps":
			"Design a CI job from the local release rehearsal. Run its build and verify commands on a fresh target, then write down the distinct browser acceptance step and the evidence it needs.",
		"Workflow Notebook: Expansion Ideas and Next Steps":
			"Record the root lockfile, runtime version, two processes and public configuration needed to reproduce release A. Mark which inputs would be copied into a static artifact.",
		"Next Steps Transfer Practice":
			"Build A and B with the worksheet’s different API paths. Compare their manifests and serve both in turn. Identify the acceptance test needed in addition to checking file digests.",
		"Next Steps Extension Practice":
			"Write a local CI check that exits unsuccessfully if verification rejects a disposable artifact with a modified index.html. Retest using intact A and record both exit codes."
	}
};

const packDirections: Record<string, { setup: string; evidence: string }> = {
	[webNotesRoot]: {
		setup: "Work in an exported copy of your Notes starter. If starting fresh, complete validateNoteInput and replaceMemoryNote using the imported README. Run the starter from the complete locked repository and open the loopback page on port 3001. Use the memory adapter unless the task calls for MongoDB. Keep the original instance running when comparing a separate restore target.",
		evidence:
			"Record the adapter, request or startup command, observed result and the note ID when one is available. Keep seed files outside the public directory."
	},
	[webContactRoot]: {
		setup: "Use a copy of the Contact starter. Complete parseContact from the README and start the workspace from the full repository. Open the loopback page on port 3002 with the local JSON transport. Keep the Network panel open. Use a request client when the form prevents the input you need to test.",
		evidence:
			"Keep the fictional input, expected and observed response or connection failure, visible feedback and a successful retest. Record only redacted server log fields."
	},
	[webDeploymentRoot]: {
		setup: "Use the Separate Deployment starter. Complete digestBytes and assertInventory from the README. Copy frontend/env.template.js to frontend/env.js before starting the static server. Run the front end and API as separate loopback processes. Keep release A in its own directory and use new destinations for builds or restores.",
		evidence:
			"Identify the process and configuration responsible for the result. Keep the command output, artifact or request you checked, then repeat the check after recovery."
	},
	[webModulePortfolioRoot]: {
		setup: "Work in the module edition of the portfolio starter. Keep a copy of the earlier four-file portfolio. Implement validateProjectIdea in project-idea.js, then run the selected workspace from the complete locked repository. Submit a valid idea and a spaces-only title using the form. Check focus before and after clearing the draft.",
		evidence:
			"Retain the edited files, the local build and preview commands, the browser dimensions and your observations. Check the saved change again after rebuilding."
	}
};

function route(
	item: RawCourseModuleItem,
	root: string,
	worksheet: string,
	task: string
) {
	const { setup, evidence } = packDirections[root];
	const baseline = item.title.startsWith("Core Project:")
		? " The reference supplies the completed base application. Collect your own case evidence."
		: "";
	item.content = `${task}

${setup}

**Checkpoints:** ${evidence}${baseline}`;
	item.preserveInstructions = true;
	item.datasetLink = asset + "practice-pack.md#" + worksheet + "-case";
	item.projectLink = root + "/starter";
	item.ideImport = true;
	if (item.title.startsWith("Core Project:"))
		item.solutionLink = root + "/solution";
	else delete item.solutionLink;
}

const individual: Record<string, [string, string, string]> = {
	"Practical Projects Transfer Practice": [
		webContactRoot,
		"validated-api",
		"Use the supplied Contact request for a fictional supply desk. Test the ordinary case, omit topic, then restore it. Retain the three responses and the simulated delivery result."
	],
	"Practical Projects Extension Practice": [
		webNotesRoot,
		"persistence-boundary",
		"Use the Notes case to create two supply requests. Add an exact-title search control to the page and test a matching title, a different case and an absent title."
	],
	"Practice Project: Personal Site with Accessibility Checklist": [
		webModulePortfolioRoot,
		"portfolio-build",
		"Build the workshop section and project-idea form in the portfolio case. Submit keyboard order, validation focus, 200% reflow and two working previews."
	],
	"Practice Project: Form-backed Contact or Survey App": [
		webContactRoot,
		"validated-api",
		"Build the fictional Contact form using the supplied request, a missing topic and the failed delivery scenario. Demonstrate draft retention and successful manual retry."
	],
	"Practice Project: CRUD App with Database": [
		webNotesRoot,
		"persistence-boundary",
		"Complete the Notes case. Use the README’s isolated MongoDB adapter for the database version. Create, read, replace and delete by ID. Restart the service between create and replace, then compare against a memory run."
	],
	"Practice Project: Authenticated Course Dashboard": [
		webContactRoot,
		"validated-api",
		"Extend a separate copy of the Contact server. Add a local session-backed dashboard using two fictional accounts, tutor Rowan and learner Lee, with one course assigned to Lee. Check a signed-out request, Lee reading the assigned course, Lee requesting the tutor roster and Rowan opening the roster. Expect 401 when signed out, 200 for the assigned course, 403 for the learner’s roster request and 200 for the tutor. Enforce permissions on the server. Record status and visible state before login, after login and after logout. The Contact pack supplies the server and form baseline. Implement the session and dashboard yourself."
	],
	"Practice Project: Deployed Full-Stack Capstone with README and Test Plan":
		[
			webDeploymentRoot,
			"deployment-preflight",
			"Ship the retained front end and API as separate local processes. Deliver the README, process and origin map, expected and observed browser matrix and restored-A manifest. Include an API contract check, a keyboard and layout check, load timing and an inventory of public and private settings. Record the tested loopback addresses and the limits of that deployment."
		]
};

const assignments = new Map(Object.entries(individual));
for (const { tasks, root, worksheet } of [
	feature,
	api,
	persistence,
	readiness,
	hosting,
	advanced,
	network,
	expansion
]) {
	for (const [title, task] of Object.entries(tasks)) {
		assignments.set(title, [root, worksheet, task]);
	}
}

export function applyWebPracticeRoutes(course: RawCourse) {
	for (const module of course.modules) {
		const core = module.curriculum.find(item =>
			item.title.startsWith("Core Project:")
		);
		const reading = module.curriculum[0];
		if (
			core?.datasetLink?.startsWith(asset + "practice-pack.md#") &&
			reading
		) {
			reading.contentKind = "reading";
			reading.datasetLink = core.datasetLink;
			for (const activity of module.curriculum) {
				if (
					activity.title.endsWith(": Guided Example") ||
					activity.title.endsWith(": Review")
				)
					activity.datasetLink = core.datasetLink;
			}
			reading.solutionLink = core.datasetLink
				.replace("practice-pack.md#", "verification-guide.md#")
				.replace(/-case$/, "-key");
		}
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			const assignment = assignments.get(item.title);
			if (assignment) route(item, ...assignment);
		}
	}
}
