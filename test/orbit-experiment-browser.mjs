import assert from "node:assert/strict";
import { join } from "node:path";

const number = text => Number(text.replaceAll(",", ""));
export async function checkOrbitExperiment(page, output, profileName) {
	const cardID = await page.$$eval(".lesson-item", rows => rows.find(row =>
		row.querySelector("h5")?.textContent.trim() === "Tesla-Retriever Intercept Simulation")?.id);
	assert.ok(cardID, "The original intercept assignment is visible");
	const link = `[id=${JSON.stringify(cardID)}] .assignment-content a[href='/tesla-retriever']`;
	await page.waitForSelector(link);
	await page.$eval(link, (element) => {
		element.target = "_self";
	});
	await page.locator(link).click();
	await page.waitForSelector("#orbit-hours");
	const text = selector =>
		page.$eval(selector, element => element.textContent.trim());
	const fill = async (selector, value) => {
		await page.locator(selector).fill(String(value));
		await page.keyboard.press("Tab");
	};
	const advance = () =>
		page.locator(".trial-actions button:nth-child(1)").click();
	const reset = () =>
		page.locator(".trial-actions button:nth-child(3)").click();
	const coordinates = async () => [
		await text("#tesla-coordinate"),
		await text("#retriever-coordinate")
	];
	assert.deepEqual(await coordinates(), ["(2, 0)", "(-2, 0)"]);
	for (const radius of [0.5, 3, 2]) {
		await fill("#orbit-radius", radius);
		await page.waitForFunction(
			value =>
				document.querySelector("#retriever-coordinate")?.textContent
				=== `(${-value}, 0)`,
			{},
			radius
		);
	}
	await advance();
	await page.waitForFunction(
		() => document.querySelector("#orbit-hours")?.textContent === "10,000"
	);
	const beforeChange = await coordinates();
	await page
		.locator("button[aria-label='Increase speed by 150 mph']")
		.click();
	await page.waitForFunction(
		() => document.querySelector("#orbit-speed")?.textContent === "60,150"
	);
	assert.deepEqual(await coordinates(), beforeChange);
	await fill("#orbit-step", 5000000);
	await advance();
	await page.waitForFunction(
		() =>
			document.querySelector("#orbit-status")?.textContent === "Intercept"
	);
	assert.ok(
		Math.abs(
			number(await text("#orbit-hours")) - (10000 + 615440000 / 150)
		) < 0.001
	);
	assert.equal((await coordinates())[0], (await coordinates())[1]);
	await reset();
	await page
		.locator("button[aria-label='Increase speed by 150 mph']")
		.click();
	await advance();
	await page.waitForFunction(
		() =>
			document.querySelector("#orbit-status")?.textContent === "Intercept"
	);
	assert.ok(
		Math.abs(number(await text("#orbit-hours")) - 615440000 / 150) < 0.001
	);
	assert.deepEqual(await coordinates(), ["(2, 0)", "(2, 0)"]);
	assert.equal(
		await page.$$eval(".observation-card tbody tr", rows => rows.length),
		1
	);
	assert.equal(
		await page.$eval("#orbit-radius", element => element.disabled),
		true
	);
	assert.equal(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= innerWidth
		),
		true
	);
	await page.screenshot({
		path: join(output, `${profileName}-orbit-intercept.png`),
		fullPage: true
	});
	await reset();
	await fill("#orbit-radius", 3);
	await page
		.locator("button[aria-label='Increase speed by 150 mph']")
		.click();
	await advance();
	assert.equal(await text("#orbit-status"), "Paused");
	assert.equal(number(await text("#orbit-hours")), 5000000);
	await page.locator(".plot-card > button").click();
	const differentRadiusCoordinates = await coordinates();
	assert.notEqual(
		differentRadiusCoordinates[0],
		differentRadiusCoordinates[1]
	);
	await page.screenshot({
		path: join(output, `${profileName}-orbit-different-radius.png`),
		fullPage: true
	});
	await reset();
	await fill("#orbit-radius", 4);
	await page.waitForSelector("[role='alert']");
	assert.equal(
		await page.$eval(
			".trial-actions button:first-child",
			element => element.disabled
		),
		true
	);
	await fill("#orbit-radius", 2);
	await fill("#orbit-step", 0);
	await advance();
	await page.waitForSelector("[role='alert']");
	await fill("#orbit-step", 100);
	await page.locator(".trial-actions button:nth-child(2)").click();
	await page.waitForFunction(
		() => document.querySelector("#orbit-status")?.textContent === "Running"
	);
	await page.locator(".trial-actions button:nth-child(2)").click();
	await page.waitForFunction(
		() => document.querySelector("#orbit-status")?.textContent === "Paused"
	);
	assert.ok(number(await text("#orbit-hours")) >= 100);
	await page.locator(".orbit-heading a").click();
	await page.waitForFunction(
		() =>
			document.querySelector("#course-select")?.value
			=== "late-elementary-b-math"
			&& document
				.querySelector("#course-reader-panel h3")
				?.textContent
				.includes("LEB18")
	);
	return {
		assignmentLinkOpened: true,
		radiusBoundsExercised: [0.5, 3],
		equalSpeedAdvanced: true,
		speedChangePreservedPositions: true,
		crossedStepInterceptAccepted: true,
		actualRecordedInterceptHours: 615440000 / 150,
		interceptCoordinate: "(2, 0)",
		differentRadiusDidNotIntercept: true,
		differentRadiusCoordinates,
		invalidInputsRejected: true,
		playPauseAccepted: true,
		lessonReturnAccepted: true
	};
}
