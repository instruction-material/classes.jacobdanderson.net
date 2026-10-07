export async function confirmProjectImport(page) {
	await page.waitForSelector("[data-testid='ide-route-import-confirm']:not([disabled])");
	await page.click("[data-testid='ide-route-import-confirm']");
}

export async function openProjectSidebar(page) {
	await page.waitForSelector(".code-ide-workspace");
	await page.waitForSelector("select[aria-label='Active project file']");
	if (await page.evaluate(() => window.matchMedia("(max-width: 900px)").matches)) {
		const selector = ".mobile-workspace-navigation button";
		await page.waitForSelector(selector);
		if (await page.$eval(selector, button => button.getAttribute("aria-expanded")) !== "true")
			await page.locator(selector).click();
		await page.waitForSelector(`${selector}[aria-expanded='true']`);
	}
	else {
		await page.waitForFunction(() => document.querySelector("button[aria-label='Expand project sidebar']") || document.querySelector(".file-button"));
		if (await page.$("button[aria-label='Expand project sidebar']"))
			await page.locator("button[aria-label='Expand project sidebar']").click();
		await page.waitForSelector("button[aria-label='Collapse project sidebar']");
	}
	await page.waitForSelector(".file-button");
}

export async function downloadProjectZip(page) {
	const alreadyOpen = Boolean(await page.$("#code-ide-settings-panel"));
	if (!alreadyOpen) await page.click("button[aria-label='IDE settings']");
	try {
		await page.waitForSelector("#code-ide-settings-panel");
		await page.click("button[aria-label='Download project ZIP']");
	}
	finally {
		if (!alreadyOpen) await page.click("button[aria-label='IDE settings']");
	}
}
