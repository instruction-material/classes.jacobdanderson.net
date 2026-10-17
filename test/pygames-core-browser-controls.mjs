import assert from "node:assert/strict";
import { downloadProjectZip } from "./ide-workspace-controls.mjs";
const storageKey = "classes-python-ide-projects:anonymous";

export async function savedProjects(page) {
	return page.evaluate(
		key =>
			new Promise((resolve, reject) => {
				const opening = indexedDB.open("classes-python-ide", 1);
				opening.onupgradeneeded = () => {
					opening.transaction.abort();
					reject(
						new Error("Primary project store is not initialized")
					);
				};
				opening.onerror = () => reject(opening.error);
				opening.onsuccess = () => {
					const database = opening.result;
					const transaction = database.transaction(
						"projectStores",
						"readonly"
					);
					const request = transaction
						.objectStore("projectStores")
						.get(key);
					let projects;
					request.onsuccess = () => {
						projects = request.result?.projects;
					};
					transaction.oncomplete = () => {
						database.close();
						resolve(Array.isArray(projects) ? projects : []);
					};
					transaction.onerror = transaction.onabort = () => {
						database.close();
						reject(
							transaction.error ??
								new Error("Primary store read failed")
						);
					};
				};
			}),
		storageKey
	);
}

export async function exportedBytes(page) {
	await page.evaluate(() => {
		delete window.__pyGamesArchive;
	});
	await downloadProjectZip(page);
	await page.waitForFunction(() => window.__pyGamesArchive instanceof Blob);
	return Uint8Array.from(
		await page.evaluate(async () =>
			Array.from(
				new Uint8Array(await window.__pyGamesArchive.arrayBuffer())
			)
		)
	);
}

export async function waitSaved(page, key, accepts = () => true) {
	const deadline = Date.now() + 12000;
	while (Date.now() < deadline) {
		const project = (await savedProjects(page)).find(
			p => p.courseProjectKey === key
		);
		if (project && accepts(project)) return project;
		await new Promise(resolve => setTimeout(resolve, 50));
	}
	assert.fail(`Saved project was not ready: ${key}`);
}

export async function courseAction(page, origin, activity) {
	await page.goto(`${origin}/courses#${activity.module}`, {
		waitUntil: "domcontentloaded"
	});
	await page.waitForSelector(".lesson-view-toggle button");
	const card = `#${activity.module}-${activity.item}`;
	for (const position of [1, 2, 3]) {
		await page
			.locator(`.lesson-view-toggle button:nth-child(${position})`)
			.click();
		if (!(await page.$(card))) continue;
		const href = await page.$eval(
			card,
			(element, key) =>
				[...element.querySelectorAll("a")]
					.find(a => {
						const u = new URL(a.href);
						return (
							u.pathname === "/ide" &&
							u.searchParams.get("projectKey") === key
						);
					})
					?.getAttribute("href"),
			activity.key
		);
		if (href) return href;
	}
	assert.fail(`Missing actual course action: ${activity.name}`);
}
