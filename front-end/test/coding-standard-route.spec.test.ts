import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const routeSource = readFileSync(
	resolve(__dirname, "../src/pages/coding_standard.vue"),
	"utf8"
);
const navigationSource = [
	readFileSync(resolve(__dirname, "../src/components/TheHeader.vue"), "utf8"),
	readFileSync(resolve(__dirname, "../src/components/TheFooter.vue"), "utf8")
].join("\n");
const appSource = readFileSync(resolve(__dirname, "../src/App.vue"), "utf8");

describe("hidden coding standard route", () => {
	it("redirects the direct route to the canonical static document", () => {
		expect(routeSource).toContain(
			"https://static.classes.jacobdanderson.net/coding_standard.md"
		);
		expect(routeSource).toContain("window.location.replace");
		expect(routeSource).toContain('content: "noindex,nofollow"');
		expect(appSource).toContain("/^\\/coding_standard(?:\\/|$)/");
	});

	it("does not advertise the route in site navigation", () => {
		expect(navigationSource).not.toContain("/coding_standard");
		expect(routeSource).not.toContain("RouterLink");
	});
});
