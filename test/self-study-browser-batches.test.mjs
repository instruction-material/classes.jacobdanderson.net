import assert from "node:assert/strict";
// eslint-disable-next-line test/no-import-node-test -- Native CI batch runner contracts.
import { it } from "node:test";
import { aggregateProofs, browserTimeoutMs, planBatches } from "../scripts/self-study-browser-batch-proof.mjs";

const sourceCommit = "a".repeat(40);
const ids = ["reading", "writing"];
const manifests = Object.fromEntries(ids.map(id => [id,	Object.fromEntries(["learner", "instructor"].map(role => [role, { modules: [{ id: "lesson", readings: [{}, {}] }], role }]))]));
const scope = { ids, manifests, sourceCommit, sourceMode: "build" };
function result(selectedCourseIds) {
	const profiles = selectedCourseIds.flatMap(id =>
		["learner", "instructor"].flatMap(role => [390, 1280].map(width =>
			({ id, role, width, sourceCommit, completeReadings: [{}, {}], pageErrors: [], writes: 0 }))));
	return { complete: true, sourceCommit, sourceMode: "build", selectedCourseIds, expectedProfiles: profiles.length, expectedReadingViews: profiles.length * 2, profiles };
}

it("batches retain all 23 courses in order with one browser run at a time", () => {
	const courses = Array.from({ length: 23 }, (_, index) => `course-${index}`);
	const batches = planBatches(courses);
	assert.equal(batches.length, 6);
	assert.ok(batches.every(batch => batch.length <= 4));
	assert.deepEqual(batches.flat(), courses);
	assert.throws(() => planBatches(["same", "same"]));
	assert.throws(() => planBatches([]));
	assert.throws(() => planBatches(courses, 0));
	assert.throws(() => planBatches(courses, 5));
});

it("aggregate becomes complete only after every course, role, width and reading passes", () => {
	const partial = aggregateProofs(scope, [result(["reading"])]);
	assert.equal(partial.complete, false);
	assert.equal(partial.expectedProfiles, 8);
	assert.equal(partial.expectedReadingViews, 16);
	const complete = aggregateProofs(scope, [result(["reading"]), result(["writing"])]);
	assert.equal(complete.complete, true);
	assert.equal(complete.profiles.length, 8);
	assert.equal(complete.profiles.reduce((n, p) => n + p.completeReadings.length, 0), 16);
});

it("reject duplicate, missing, failed or foreign results instead of accepting a partial review", () => {
	for (const mutate of [
		(p) => { p.complete = false; },
		(p) => { p.sourceCommit = "b".repeat(40); },
		(p) => { p.sourceMode = "dev"; },
		(p) => { p.profiles.pop(); },
		(p) => { p.profiles[0] = p.profiles[1]; },
		(p) => { p.profiles[0].sourceCommit = "b".repeat(40); },
		(p) => { p.profiles[0].pageErrors = ["render failed"]; },
		(p) => { p.profiles[0].writes = 1; },
		(p) => { p.profiles[0].completeReadings.pop(); },
		(p) => { p.profiles[0].role = "owner"; },
		(p) => { p.profiles[0].width = 800; },
		(p) => { p.expectedReadingViews -= 1; }
	]) {
		const broken = result(ids);
		mutate(broken);
		assert.throws(() => aggregateProofs(scope, [broken]));
	}
	assert.throws(() => aggregateProofs(scope, [result(["reading"]), result(["reading"])]));
	assert.throws(() => aggregateProofs(scope, [result(["other"])]));
});

it("resource-heavy batches retain enough time for all roles and widths", () => {
	const lessons = Array.from({ length: 100 }, (_, index) => ({
		id: `lesson-${index}`,
		readings: [{}],
		projects: [{ selfChecks: [{}, {}, {}, {}] }],
		optional: [{ selfChecks: [{}, {}] }]
	}));
	const heavy = { dense: Object.fromEntries(["learner", "instructor"].map(role => [role, { modules: lessons }])) };
	assert.ok(browserTimeoutMs(["dense"], heavy) > 924130, "Outgrown batch must fit beyond the observed original failure");
	const withMore = structuredClone(heavy);
	withMore.dense.instructor.modules[0].optional[0].selfChecks.push({});
	assert.ok(browserTimeoutMs(["dense"], withMore) > browserTimeoutMs(["dense"], heavy));
	assert.equal(browserTimeoutMs(ids, manifests), 900000, "Small reviews retain the existing floor");
	assert.throws(() => browserTimeoutMs([], manifests));
	assert.throws(() => browserTimeoutMs(["reading", "reading"], manifests));
	assert.throws(() => browserTimeoutMs(["missing"], manifests));
});

it("budget only the explicitly reviewed modules without changing the review set", () => {
	const modules = [
		{ id: "selected", readings: [{}], projects: [], optional: [] },
		{ id: "unreviewed", readings: [], projects: [{ selfChecks: Array.from({ length: 1000 }, () => ({})) }], optional: [] }
	];
	const selected = { course: Object.fromEntries(["learner", "instructor"].map(role => [role, { modules, reviewedModuleIds: ["selected"] }])) };
	const full = structuredClone(selected);
	for (const role of ["learner", "instructor"]) delete full.course[role].reviewedModuleIds;
	assert.equal(browserTimeoutMs(["course"], selected), 900000);
	assert.ok(browserTimeoutMs(["course"], full) > browserTimeoutMs(["course"], selected));
	assert.deepEqual(selected.course.learner.reviewedModuleIds, ["selected"]);
});
