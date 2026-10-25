import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";

const fixture = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/javascript-grid-layout-sources.json"),
		"utf8"
	)
);
const images = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/javascript-grid-layout-image-sources.json"),
		"utf8"
	)
).images;
const originals = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/javascript-grid-layout-originals.json"),
		"utf8"
	)
).resources;
const root = resolve("public/course-assets/javascript-level-1");

it("retains all 23 source rasters unchanged in both complete role packs", () => {
	expect(images).toHaveLength(23);
	for (const image of images) {
		for (const role of ["starter", "reference"]) {
			const resource = fixture.resources.find(
				(row: { project: string; role: string }) =>
					row.project === image.project && row.role === role
			);
			const file = resource.files.find(
				(row: { name: string }) => row.name === image.name
			);
			const svg = readFileSync(resolve(root, file.path), "utf8");
			const data = svg.match(
				/href="data:image\/(?:png|jpeg);base64,([A-Za-z0-9+/=]+)"/
			)![1];
			const raw = Buffer.from(data, "base64");
			expect(raw.length).toBe(image.rasterBytes);
			expect(createHash("sha256").update(raw).digest("hex")).toBe(
				image.rasterSHA256
			);
			expect(svg).not.toMatch(/(?:href|src)="https?:/);
			if (image.viewBox)
				expect(svg).toContain(`viewBox="${image.viewBox}"`);
		}
	}
});

it("preserves all original team statistics and moves while completing nicknames and labels", () => {
	const original = originals.find(
		(row: { project: string; role: string }) =>
			row.project === "pokemon-team" && row.role === "reference"
	);
	const supplied = document.createElement("template");
	supplied.innerHTML = original.panels.HTML;
	const sourceCards = [
		...supplied.content.querySelectorAll(".col.s12.m6.l4")
	];
	const resource = fixture.resources.find(
		(row: { project: string; role: string }) =>
			row.project === "pokemon-team" && row.role === "reference"
	);
	const local = document.createElement("template");
	local.innerHTML = readFileSync(
		resolve(
			root,
			resource.files.find(
				(row: { name: string }) => row.name === "index.html"
			).path
		),
		"utf8"
	);
	const cards = [...local.content.querySelectorAll(".team-card")];
	expect(cards).toHaveLength(6);
	for (const [index, card] of cards.entries()) {
		const values = [...sourceCards[index].querySelectorAll("td")].map(
			node => node.textContent.trim()
		);
		expect(
			[...card.querySelectorAll("dd")].map(node =>
				node.textContent.trim()
			)
		).toEqual(values.slice(0, 6));
		expect(
			[...card.querySelectorAll("tbody td")].map(node =>
				node.textContent.trim()
			)
		).toEqual(values.slice(6));
		expect(card.querySelector(".nickname")!.textContent).toBeTruthy();
		expect(card.querySelectorAll("dt abbr[title]")).toHaveLength(6);
	}
});
