import { mount } from "@vue/test-utils";
import { createHead } from "@unhead/vue/server";
import { createPinia } from "pinia";
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { hasOpenCourseCatalog } from "@/modules/catalogVisibility";
import { coursePathwayMaps } from "@/modules/coursePathwayMaps";
import HomePage from "@/pages/index.vue";
import PathwaysPage from "@/pages/pathways.vue";
import TheFooter from "@/components/TheFooter.vue";
import { courseCatalog } from "@/stores/courses/index";
import { coursePublicPathways } from "@/stores/courses/public-pathways";
import { useContentStore } from "@/stores/content";

const link = { props: ["to"], template: '<a :href="to"><slot /></a>' };

describe("public course discovery", () => {
	it.each([
		["https://classes.jacobdanderson.net", true],
		["https://instruction-material.classes.jacobdanderson.net", false],
		["https://cs.avasan.org", false],
		["https://cs.avasan.com", false],
		["https://classes.jacobdanderson.net.example.org", false],
		["http://localhost:3333", false]
	])("opens only the canonical catalog at %s", (origin, expected) => {
		expect(hasOpenCourseCatalog(origin)).toBe(expected);
	});

	it("covers each catalog course once without turning variants into prerequisites", () => {
		const courseIds = coursePathwayMaps.flatMap(pathway =>
			pathway.stages.flatMap(stage => stage.courseIds)
		);
		expect(courseIds.slice().sort()).toEqual(
			courseCatalog.map(course => course.id).sort()
		);
		expect(new Set(courseIds).size).toBe(courseIds.length);
		expect(coursePathwayMaps.map(pathway => pathway.id).sort()).toEqual(
			coursePublicPathways.map(pathway => pathway.id).sort()
		);
		for (const pathway of coursePathwayMaps) {
			expect(pathway.summary.split(/\s+/).length).toBeLessThan(20);
			expect(pathway.readiness.split(/\s+/).length).toBeLessThan(30);
		}
		expect(
			coursePathwayMaps.find(
				pathway => pathway.id === "python-programming"
			)?.stages[0].courseIds
		).toEqual(["python-level-1", "python-level-1-classroom"]);
		expect(
			coursePathwayMaps.find(pathway => pathway.id === "game-development")
				?.kind
		).toBe("choices");
	});

	it("filters visual maps and links every course to its stable catalog anchor", async () => {
		const wrapper = mount(PathwaysPage, {
			global: { stubs: { RouterLink: link } }
		});
		const links = wrapper.findAll('a[href^="/courses#"]');
		expect(
			links
				.map(anchor =>
					anchor.attributes("href").slice("/courses#".length)
				)
				.sort()
		).toEqual(courseCatalog.map(course => course.id).sort());
		await wrapper.get("button:nth-child(3)").trigger("click");
		expect(wrapper.findAll(".pathway-card")).toHaveLength(1);
		expect(wrapper.get(".pathway-card h2").text()).toBe("Math");
		expect(wrapper.findAll("details")).toHaveLength(0);
		await wrapper
			.get('input[type="search"]')
			.setValue("no matching course xyz");
		expect(wrapper.text()).toContain("No matching pathways");
		wrapper.unmount();
	});

	it("keeps planning backlog out of public pathway search", async () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/pages/pathways.vue"),
			"utf8"
		);
		expect(pageSource).not.toContain("stores/courses/public-pathways");
		const wrapper = mount(PathwaysPage, {
			global: { stubs: { RouterLink: link } }
		});
		await wrapper
			.get('input[type="search"]')
			.setValue("prohibited-activity");
		expect(wrapper.text()).toContain("No matching pathways");
		wrapper.unmount();
	});

	it("uses a single pathways action and leaves booking and payment to navigation", () => {
		const wrapper = mount(HomePage, {
			global: {
				plugins: [createPinia(), createHead()],
				stubs: { RouterLink: link }
			}
		});
		expect(wrapper.findAll('a[href="/pathways"]')).toHaveLength(1);
		expect(wrapper.get('a[href="/pathways"]').text()).toBe(
			"Course Pathways"
		);
		expect(wrapper.findAll("details")).toHaveLength(0);
		expect(wrapper.findAll(".hero-proof")).toHaveLength(0);
		expect(wrapper.find('a[href="/signup"]').exists()).toBe(false);
		expect(wrapper.find('a[href="/payment"]').exists()).toBe(false);
		expect(
			wrapper.get(".hero-text p").text().split(/\s+/).length
		).toBeLessThan(30);
		wrapper.unmount();
	});

	it("shows useful subjects and session preparation without hiding them behind controls", () => {
		const pinia = createPinia();
		const wrapper = mount(HomePage, {
			global: {
				plugins: [pinia, createHead()],
				stubs: { RouterLink: link }
			}
		});
		try {
			const groups = useContentStore(pinia).subjectGroups;
			expect(wrapper.findAll(".home-subject")).toHaveLength(
				groups.length
			);
			for (const [index, group] of groups.entries()) {
				const article = wrapper.findAll(".home-subject")[index];
				expect(article.get("h3").text()).toBe(group.title);
				expect(article.get("p").text()).toBe(group.description);
				expect(article.findAll("li").map(item => item.text())).toEqual(
					group.subjects
				);
			}
			expect(wrapper.findAll(".home-session__steps > li")).toHaveLength(
				3
			);
			expect(wrapper.get(".home-session").text()).toContain("assignment");
			expect(wrapper.get(".home-session").text()).toContain("next steps");
			expect(wrapper.findAll("button, details")).toHaveLength(0);
		} finally {
			wrapper.unmount();
		}
	});

	it.each([false, true])(
		"keeps contact and privacy once in the footer (compact: %s)",
		compact => {
			const wrapper = mount(TheFooter, {
				props: { compact },
				global: { stubs: { RouterLink: link } }
			});
			expect(wrapper.findAll('a[href^="mailto:"]')).toHaveLength(1);
			expect(wrapper.get('a[href^="mailto:"]').text()).toBe(
				"Contact (opens your email app)"
			);
			expect(wrapper.findAll('a[href="/privacy"]')).toHaveLength(1);
			expect(wrapper.find('a[href="/signup"]').exists()).toBe(false);
			expect(wrapper.find(".site-footer__eyebrow").exists()).toBe(false);
			wrapper.unmount();
		}
	);
});
