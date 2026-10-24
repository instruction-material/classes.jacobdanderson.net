export async function confirmProjectImport(page) {
	await page.waitForSelector("[data-testid='ide-route-import-confirm']:not([disabled])");
	await page.locator("[data-testid='ide-route-import-confirm']:not([disabled])").click();
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
	const trigger = "button[aria-label='IDE settings']";
	await page.waitForSelector(trigger);
	const alreadyOpen = await page.$eval(trigger, button => button.getAttribute("aria-expanded") === "true");
	if (!alreadyOpen) await page.locator(trigger).click();
	try {
		await page.waitForSelector("#code-ide-settings-panel", { visible: true });
		const download = "button[aria-label='Download project ZIP']:not([disabled])";
		await page.waitForSelector(download);
		await page.$eval(download, button => button.scrollIntoView({
			block: "end",
			inline: "nearest",
			behavior: "instant"
		}));
		await page.$eval("#code-ide-settings-panel", (panel) => {
			panel.scrollTop = panel.scrollHeight;
		});
		await page.waitForFunction(() => {
			const panel = document.querySelector("#code-ide-settings-panel");
			const button = document.querySelector("button[aria-label='Download project ZIP']");
			if (!panel || !button || button.disabled) return false;
			const bounds = button.getBoundingClientRect();
			const clip = panel.getBoundingClientRect();
			const center = document.elementFromPoint(
				bounds.x + bounds.width / 2,
				bounds.y + bounds.height / 2
			);
			return bounds.width > 0 && bounds.height > 0
				&& bounds.top >= Math.max(0, clip.top)
				&& bounds.bottom <= Math.min(innerHeight, clip.bottom)
				&& button.contains(center);
		});
		await page.locator(download).click();
	}
	catch (error) {
		const state = await page.evaluate(() => {
			const panel = document.querySelector("#code-ide-settings-panel");
			const download = document.querySelector("button[aria-label='Download project ZIP']");
			const bounds = element => element?.getBoundingClientRect().toJSON();
			const rectangle = download?.getBoundingClientRect();
			return {
				viewport: { width: innerWidth, height: innerHeight },
				settingsExpanded: document.querySelector("button[aria-label='IDE settings']")?.getAttribute("aria-expanded"),
				panel: bounds(panel),
				panelScrollTop: panel?.scrollTop,
				panelScrollHeight: panel?.scrollHeight,
				panelClientHeight: panel?.clientHeight,
				download: bounds(download),
				disabled: download?.disabled,
				visibleText: download?.textContent,
				centerElement: rectangle ? document.elementFromPoint(rectangle.x + rectangle.width / 2, rectangle.y + rectangle.height / 2)?.outerHTML.slice(0, 500) : null
			};
		});
		throw new Error(`Project ZIP control failed: ${JSON.stringify(state)}`, { cause: error });
	}
	finally {
		if (!alreadyOpen) {
			await page.locator(trigger).click();
			await page.waitForSelector("#code-ide-settings-panel", { hidden: true });
		}
	}
}
