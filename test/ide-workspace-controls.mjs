export async function confirmProjectImport(page) {
	await page.waitForSelector("[data-testid='ide-route-import-confirm']:not([disabled])");
	await page.click("[data-testid='ide-route-import-confirm']");
}

export async function openProjectSidebar(page) {
	await page.waitForSelector(".code-ide-workspace");
	if (await page.evaluate(() => window.innerWidth <= 760)) {
		const selector = ".mobile-workspace-navigation button";
		await page.waitForSelector(selector);
		if (await page.$eval(selector, button => button.getAttribute("aria-expanded")) !== "true")
			await page.click(selector);
	} else if (await page.$("button[aria-label='Expand project sidebar']")) {
		await page.click("button[aria-label='Expand project sidebar']");
	}
	await page.waitForSelector(".file-button");
}

export async function downloadProjectZip(page) {
	const alreadyOpen = Boolean(await page.$("#code-ide-settings-panel"));
	if (!alreadyOpen) await page.click("button[aria-label='IDE settings']");
	try {
		await page.waitForSelector("#code-ide-settings-panel");
		await page.click("button[aria-label='Download project ZIP']");
	} finally {
		if (!alreadyOpen) await page.click("button[aria-label='IDE settings']");
	}
}
