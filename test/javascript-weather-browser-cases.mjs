import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const fixture = JSON.parse(
	readFileSync(
		new URL("./fixtures/javascript-weather-sources.json", import.meta.url),
		"utf8"
	)
);
export function editedWeatherSource(_resource, filename) {
	if (!["index.html", "styles.css", "script.js"].includes(filename))
		return undefined;
	const original = fixture.files.reference[filename];
	if (filename === "index.html")
		return original
			.replace("<body>", '<body data-weather-edited="true">')
			.replace("What do I need to bring today?", "Weather packing list");
	if (filename === "styles.css")
		return original + "\n#output-text { font-weight: 700; }\n";
	return original.replace('"Windbreaker!"', '"Windbreaker and scarf!"');
}
export async function inspectWeather(page, resource, kind) {
	if (resource.role === "starter" && kind === "exact") {
		assert.equal(await page.$("#input"), null);
		assert.equal(await page.$("#submit"), null);
		return { blankStarterRetained: true, runtimeErrors: 0 };
	}
	const cases = [
		["hot", "Sunglasses!", "sunglasses.svg"],
		["rain", "Umbrella!", "umbrella.svg"],
		["snow", "Timbs!", "boots.svg"],
		["cold", "Jacket!", "jacket.svg"],
		[
			"wind",
			kind === "edited" ? "Windbreaker and scarf!" : "Windbreaker!",
			"windbreaker.svg"
		],
		["fog", "I'm not sure!", null],
		["", "I'm not sure!", null],
		["HOT", "I'm not sure!", null],
		["hot", "Sunglasses!", "sunglasses.svg"]
	];
	const observed = [];
	for (const [input, text, image] of cases) {
		await page.$eval(
			"#input",
			(element, value) => {
				element.value = value;
			},
			input
		);
		await page.click("#submit");
		await page.waitForFunction(
			expected =>
				document.querySelector("#output-text")?.textContent ===
				expected,
			{},
			text
		);
		const state = await page.evaluate(() => {
			const image = document.querySelector("#output-image");
			const input = document.querySelector("#input");
			return {
				text: document.querySelector("#output-text").textContent,
				image: image.getAttribute("src"),
				alt: image.alt,
				hidden: image.hidden,
				naturalWidth: image.naturalWidth,
				label: document.querySelector('label[for="input"]')
					?.textContent,
				inputWidth: input.getBoundingClientRect().width,
				scrollWidth: document.documentElement.scrollWidth,
				viewport: innerWidth,
				panelClass: document.querySelector("#panel").className,
				panelColor: getComputedStyle(document.querySelector("#panel"))
					.color,
				panelBackground: getComputedStyle(
					document.querySelector("#panel")
				).backgroundColor,
				heading: document.querySelector("h1").textContent,
				outputWeight: getComputedStyle(
					document.querySelector("#output-text")
				).fontWeight,
				edited: document.body.dataset.weatherEdited === "true"
			};
		});
		assert.equal(state.text, text);
		assert.equal(
			state.heading.trim(),
			kind === "edited"
				? "Weather packing list"
				: "What do I need to bring today?"
		);
		if (kind === "edited") assert.equal(state.outputWeight, "700");
		const luminance = color => {
			const values = color
				.match(/[\d.]+/g)
				.slice(0, 3)
				.map(Number)
				.map(value => value / 255)
				.map(value =>
					value <= 0.04045
						? value / 12.92
						: ((value + 0.055) / 1.055) ** 2.4
				);
			return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
		};
		const foreground = luminance(state.panelColor),
			background = luminance(state.panelBackground);
		const contrast =
			(Math.max(foreground, background) + 0.05) /
			(Math.min(foreground, background) + 0.05);
		assert.ok(contrast >= 4.5, "Readable heading color for " + input);
		assert.ok(state.label);
		assert.ok(state.inputWidth >= 180);
		assert.ok(state.scrollWidth <= state.viewport + 1);
		assert.equal(state.edited, kind === "edited");
		if (image) {
			await page.waitForFunction(() => {
				const image = document.querySelector("#output-image");
				return image.complete && image.naturalWidth > 0;
			});
			assert.ok(state.image.endsWith("/" + image));
			assert.ok(state.alt.length > 0);
			assert.equal(state.hidden, false);
		} else {
			assert.equal(state.image, null);
			assert.equal(state.hidden, true);
		}
		observed.push({
			input,
			text,
			image,
			panelClass: state.panelClass,
			contrast
		});
	}
	return {
		cases: observed,
		allFiveWeatherCases: true,
		fallbackClearsPicture: true,
		recognizedAfterUnknown: true,
		editedOutputVerified: kind === "edited"
	};
}
