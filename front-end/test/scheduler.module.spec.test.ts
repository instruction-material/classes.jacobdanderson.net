import { describe, expect, it, vi } from "vitest";
import {
	buildSchedulerEmbedUrl,
	buildSchedulerUrl,
	DEFAULT_SCHEDULER_ORIGIN,
	normalizeSchedulerOrigin,
	SCHEDULER_ORIGIN,
	schedulerDnsPrefetchHref,
	schedulerEmbedThemeMessageSource,
	schedulerEmbedThemeType,
	schedulerManageBookingUrl,
	schedulerPortalUrl,
	schedulerUrl
} from "@/modules/scheduler";

describe("scheduler embed helpers", () => {
	it("defaults to the production scheduler service", () => {
		expect(SCHEDULER_ORIGIN).toBe(DEFAULT_SCHEDULER_ORIGIN);
		expect(schedulerUrl).toBe(`${DEFAULT_SCHEDULER_ORIGIN}/`);
		expect(schedulerDnsPrefetchHref).toBe("//scheduler.example.com");
	});

	it("normalizes configured scheduler origins", () => {
		expect(normalizeSchedulerOrigin("http://localhost:5173/calendar")).toBe(
			"http://localhost:5173"
		);
		expect(normalizeSchedulerOrigin("scheduler.example.com")).toBe(
			DEFAULT_SCHEDULER_ORIGIN
		);
		expect(normalizeSchedulerOrigin("ftp://example.invalid")).toBe(
			DEFAULT_SCHEDULER_ORIGIN
		);
	});

	it("builds an embedded scheduler URL without forcing a theme by default", () => {
		const url = new URL(buildSchedulerEmbedUrl());

		expect(url.toString()).toBe(`${schedulerUrl}?embed=1`);
		expect(url.searchParams.get("theme")).toBeNull();
	});

	it("passes the parent theme through the embed URL", () => {
		const url = new URL(buildSchedulerEmbedUrl("light"));

		expect(url.searchParams.get("embed")).toBe("1");
		expect(url.searchParams.get("theme")).toBe("light");
	});

	it("builds explicit scheduler subpaths for portal and manage flows", () => {
		expect(schedulerPortalUrl).toBe(`${DEFAULT_SCHEDULER_ORIGIN}/portal`);
		expect(schedulerManageBookingUrl).toBe(
			`${DEFAULT_SCHEDULER_ORIGIN}/booking/manage`
		);
		expect(buildSchedulerUrl("portal")).toBe(
			`${DEFAULT_SCHEDULER_ORIGIN}/portal`
		);
	});

	it("keeps scheduler URL search params on the configured scheduler origin", () => {
		const sampleSearchParam = "sample search param";
		const url = new URL(
			buildSchedulerUrl("/booking/manage", {
				empty: "",
				token: sampleSearchParam
			})
		);

		expect(url.origin).toBe(DEFAULT_SCHEDULER_ORIGIN);
		expect(url.pathname).toBe("/booking/manage");
		expect(url.searchParams.get("token")).toBe(sampleSearchParam);
		expect(url.searchParams.has("empty")).toBe(false);
	});

	it("does not allow arbitrary absolute URLs as scheduler paths", () => {
		expect(buildSchedulerUrl("https://example.invalid/portal")).toBe(
			schedulerUrl
		);
		expect(buildSchedulerUrl("//example.invalid/portal")).toBe(
			schedulerUrl
		);
	});

	it("keeps reparsed scheduler paths on the configured origin", () => {
		const escapingPaths = [
			"/\\example.invalid/portal",
			"\\\\example.invalid/portal",
			"/\t/example.invalid/portal",
			`${DEFAULT_SCHEDULER_ORIGIN}//example.invalid/portal`
		];
		for (const path of escapingPaths) {
			expect(buildSchedulerUrl(path)).toBe(schedulerUrl);
			expect(buildSchedulerEmbedUrl("light", path)).toBe(
				`${schedulerUrl}?embed=1&theme=light`
			);
		}
	});

	it("preserves ordinary scheduler paths and explicit search parameters", () => {
		expect(
			buildSchedulerUrl("/booking/manage?tab=active#details", {
				page: 0,
				preview: false
			})
		).toBe(
			`${DEFAULT_SCHEDULER_ORIGIN}/booking/manage?tab=active&page=0&preview=false#details`
		);
		expect(buildSchedulerUrl(`${DEFAULT_SCHEDULER_ORIGIN}/portal`)).toBe(
			`${DEFAULT_SCHEDULER_ORIGIN}/portal`
		);
		expect(buildSchedulerUrl("/%5Cexample.invalid/portal")).toBe(
			`${DEFAULT_SCHEDULER_ORIGIN}/%5Cexample.invalid/portal`
		);
	});

	it("uses the configured local scheduler origin for the final URL check", async () => {
		vi.stubEnv("VITE_SCHEDULER_ORIGIN", "http://localhost:5173");
		vi.resetModules();
		try {
			const localScheduler = await import("@/modules/scheduler");
			expect(localScheduler.buildSchedulerUrl("/portal")).toBe(
				"http://localhost:5173/portal"
			);
			expect(
				localScheduler.buildSchedulerUrl("/\\example.invalid/portal")
			).toBe("http://localhost:5173/");
		} finally {
			vi.unstubAllEnvs();
			vi.resetModules();
		}
	});

	it("exposes the theme message contract used by the iframe", () => {
		expect(schedulerEmbedThemeMessageSource).toBe("example.com");
		expect(schedulerEmbedThemeType).toBe("scheduler:theme");
	});
});
