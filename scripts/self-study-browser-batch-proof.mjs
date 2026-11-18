import assert from "node:assert/strict";

export function planBatches(ids, size = 4) {
	assert.ok(ids.length > 0 && new Set(ids).size === ids.length);
	assert.ok(Number.isInteger(size) && size >= 1 && size <= 4);
	return Array.from({ length: Math.ceil(ids.length / size) }, (_, index) =>
		ids.slice(index * size, (index + 1) * size));
}

export function readingCount(manifest) {
	return manifest.modules
		.filter(module => !manifest.reviewedModuleIds || manifest.reviewedModuleIds.includes(module.id))
		.reduce((sum, module) => sum + module.readings.length, 0);
}

// Budget complete page work, including the navigation to and from each resource.
// Per-page assertions and their own timeouts remain unchanged.
export function browserTimeoutMs(ids, manifests) {
	assert.ok(ids.length > 0 && new Set(ids).size === ids.length);
	let readings = 0;
	let assignments = 0;
	let resources = 0;
	for (const id of ids) {
		for (const role of ["learner", "instructor"]) {
			const manifest = manifests[id][role];
			for (const module of manifest.modules) {
				if (manifest.reviewedModuleIds && !manifest.reviewedModuleIds.includes(module.id)) continue;
				readings += module.readings.length * 2;
				const items = [...(module.projects ?? []), ...(module.optional ?? [])];
				assignments += items.length * 2;
				resources += items.reduce((sum, item) => sum + (item.selfChecks?.length ?? 0), 0) * 2;
			}
		}
	}
	const timeout = Math.max(900000, 60000 + readings * 500 + assignments * 250 + resources * 750);
	assert.ok(Number.isSafeInteger(timeout));
	return timeout;
}

export function aggregateProofs(scope, results) {
	const { ids, sourceCommit, sourceMode, manifests } = scope;
	assert.ok(ids.length > 0 && new Set(ids).size === ids.length);
	const profiles = results.flatMap((result) => {
		assert.equal(result.complete, true);
		assert.equal(result.sourceCommit, sourceCommit);
		assert.equal(result.sourceMode, sourceMode);
		assert.equal(result.expectedProfiles, result.selectedCourseIds.length * 4);
		assert.equal(result.profiles.length, result.expectedProfiles);
		assert.equal(result.expectedReadingViews, result.profiles.reduce((sum, profile) => sum + profile.completeReadings.length, 0));
		return result.profiles;
	});
	const completedIds = results.flatMap(result => result.selectedCourseIds);
	assert.equal(new Set(completedIds).size, completedIds.length, "A course must run in exactly one batch");
	assert.ok(completedIds.every(id => ids.includes(id)));
	const keys = new Set();
	for (const profile of profiles) {
		assert.ok(completedIds.includes(profile.id));
		assert.ok(["learner", "instructor"].includes(profile.role));
		assert.ok([390, 1280].includes(profile.width));
		const key = [profile.id, profile.role, profile.width].join(":");
		assert.ok(!keys.has(key), "Each role and width must have its own result");
		keys.add(key);
		assert.equal(profile.sourceCommit, sourceCommit);
		assert.deepEqual(profile.pageErrors, []);
		assert.equal(profile.writes, 0);
		assert.equal(profile.completeReadings.length, readingCount(manifests[profile.id][profile.role]));
	}
	const expectedReadingViews = ids.reduce((sum, id) =>
		sum + ["learner", "instructor"].reduce((n, role) => n + readingCount(manifests[id][role]) * 2, 0), 0);
	return {
		complete: completedIds.length === ids.length,
		sourceMode,
		sourceCommit,
		selectedCourseIds: ids,
		expectedProfiles: ids.length * 4,
		expectedReadingViews,
		profiles
	};
}
