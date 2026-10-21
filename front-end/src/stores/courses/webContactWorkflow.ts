import type {
	CourseItemLearningPath,
	RawCourse,
	RawCourseModuleItem
} from "./types";
import contract from "../../assets/course-guides/web-contact-contract.md?raw";
import identity from "../../assets/course-guides/web-contact-identity.md?raw";
import routes from "../../assets/course-guides/web-contact-routes.md?raw";
import runtime from "../../assets/course-guides/web-contact-runtime.md?raw";
import { webContactRoot } from "../../modules/webProjectResources";

const staleResponseFixture = `(() => {
  const realFetch = window.fetch.bind(window);
  const pending = [];
  window.fetch = (input, options) => {
    if (String(input) !== "/api/contact") return realFetch(input, options);
    if (pending.length === 2) return Promise.reject(new Error("Reload this two-call fixture."));
    return new Promise(resolve => pending.push(resolve));
  };
  window.releaseContact = index => {
    const release = pending[index];
    if (!release) throw new Error("No pending response at this index.");
    pending[index] = null;
    release(new Response('{"ok":true,"delivery":"simulated"}', {
      status: 202, headers: { "Content-Type": "application/json" }
    }));
  };
})();`;

export function applyWebContactWorkflow(course: RawCourse, courseId: string) {
	if (courseId !== "web-development-foundations") return;
	const module = course.modules.find(
		row => row.title === "WDF5 Stage 4: Back-End Basics"
	);
	if (!module) return;
	if (
		module.curriculum.length !== 2 ||
		module.supplementalProjects.length !== 3
	) {
		throw new Error("Unexpected contact module activities");
	}
	const id = "web-development-foundations-wdf5-stage-4-back-end-basics";
	module.id = id;
	module.curriculum[0].id = `${id}-curriculum-back-end-basics-core-concepts`;
	module.curriculum[0].content = [runtime, routes, contract, identity]
		.map(reading => reading.trim())
		.join("\n\n---\n\n");
	module.curriculum[0].preserveInstructions = true;
	module.curriculum[1].id = `${id}-curriculum-core-project-back-end-basics`;
	const optionalIds = [
		"project-booking-or-contact-app-with-email-integration",
		"back-end-basics-transfer-practice",
		"back-end-basics-extension-practice"
	];
	for (const [index, suffix] of optionalIds.entries())
		module.supplementalProjects[index].id = `${id}-supplemental-${suffix}`;
	const update = (
		item: RawCourseModuleItem,
		title: string,
		content: string,
		path: CourseItemLearningPath
	) => {
		item.title = title;
		item.content = content;
		item.learningPath = path;
		item.preserveInstructions = true;
		item.projectLink = `${webContactRoot}/starter`;
		item.ideImport = true;
		if (path === "core") item.solutionLink = `${webContactRoot}/solution`;
		else delete item.solutionLink;
	};
	update(
		module.curriculum[1],
		"Core Project: Validate a Contact Request",
		"Implement parseContact in src/validation.js using the four-field contract in the reading and imported README. Keep validation pure and use JavaScript without adding a dependency to the starter. Predict the unfinished 501 response before editing. Check exact limits, whitespace, wrong types, unknown fields and input immutability, then trace a valid browser request through the real local HTTP service. Verify safe errors, literal text, repeated-request limits, cancellation and recovery. Save and reopen the edited source, export every nested file, and run it in the matching maintained checkout. Compare the core reference after an independent attempt.\n\n**Checkpoints:** Retain the source diff, predicted and observed request table, native command and port, browser results at both widths and 200% zoom, and the successful restart with saved edits.",
		"core"
	);
	update(
		module.supplementalProjects[0],
		"Choice: Write a Local API Probe",
		"Continue the completed contact project. Add probe.mjs to the saved workspace and write a repeatable Node.js 24 check using built-in fetch and node:assert/strict. Use only the owned loopback host and port from this service's ready record, with CONTACT_SCENARIO=ok. Check GET /health, a valid fictional POST returning the exact 202 body, a wrong-field POST returning 400 invalid_contact, and an unknown API path returning JSON 404. The request example and response shapes are in the reading. Use assert.equal for status and assert.deepEqual for parsed JSON; fetch resolving does not establish success. Bound each request with AbortSignal.timeout(2000). Print only case labels and pass/fail; a failed case must set process.exitCode=1. Export probe.mjs with the project, copy it into the matching role directory alongside src/ and public/, and run node probe.mjs there while the service is running. Restart the service or wait ten seconds between probe runs to renew the request budget. Stop the owned service and confirm a failed probe exits unsuccessfully, then restart and show recovery. No separate reference implementation is provided for the probe; the core reference supplies the API it checks.\n\n**Checkpoints:** Retain the added script, successful run, failed run and exit codes from the exported project.",
		"choice"
	);
	update(
		module.supplementalProjects[1],
		"Choice: Extend One Contact Topic",
		"Continue the same saved project. Add one fictional topic to the documented contract, browser select and validator together. Create independent valid and invalid request cases, including the new topic sent directly without the form. Retain the original project and lesson values, field limits, unknown-key rejection and stable error shape. Verify that changing only the select does not change the server contract. Save, reopen and export the added work, then run that export in the maintained checkout. The core reference does not include this extra topic.\n\n**Checkpoints:** Keep the revised contract, source diff, original-case results and new direct-request evidence.",
		"choice"
	);
	update(
		module.supplementalProjects[2],
		"Challenge: A Response That Ignores Cancellation",
		[
			"Continue the saved contact project. Add public/stale-response.js containing the fixture below. In public/index.html load it with `<script src='/stale-response.js'></script>` immediately before the app.js module. It intercepts two contact submissions and deliberately ignores AbortSignal, allowing response order to be controlled. It does not model server delivery or transport deadlines.",
			`\`\`\`js\n${staleResponseFixture}\n\`\`\``,
			"Submit valid fictional input, use Reset, fill a new valid form and submit again. In the browser console run window.releaseContact(0). The fresh form must remain Submitting with its submit button disabled. Run window.releaseContact(1); only that current response may show success and release the button. Reload between experiments to reset the two-call fixture.",
			"Temporarily remove only the `if (current !== generation) return;` check immediately before the 202 response branch in public/app.js. Reload and repeat the action order. Predict and observe how the old response replaces the fresh pending status even though Reset aborted its controller. Restore the check and demonstrate the protected result. Explain the different responsibilities of cancellation, generation identity and the pending guard. Remove the fixture script tag and restore ordinary HTTP behavior before final export. The core reference does not include this extra fixture.",
			"**Checkpoints:** Save the fixture, action order, predicted and observed status timeline, and restored source. Confirm that the ordinary local service still succeeds after removing the fixture."
		].join("\n\n"),
		"challenge"
	);
}
