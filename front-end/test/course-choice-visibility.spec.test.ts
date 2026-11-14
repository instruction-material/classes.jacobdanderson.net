import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import CourseExplorer from "@/components/CourseExplorer.vue";
import PathwaysPage from "@/pages/pathways.vue";
import { coursePathwayMaps } from "@/modules/coursePathwayMaps";
import {
	courseCatalog,
	getCourseCatalogEntry,
	listedCourseCatalog
} from "@/stores/courses/index";

vi.mock("@/api", () => ({
	api: { get: vi.fn().mockResolvedValue({ data: [] }), put: vi.fn() }
}));
const removed = [
	"early-elementary-a-reading",
	"early-elementary-b-picture-book",
	"middle-school-a-literature",
	"middle-school-b-writing",
	"middle-school-b-writing-retake",
	"novel-writing",
	"intro-to-biology"
];
const retained = ["middle-school-c-grammar", "introduction-to-public-speaking"];
afterEach(() => window.localStorage.clear());
it("keeps Grammar and Public Speaking offered while retiring the requested seven choices", () => {
	expect(courseCatalog).toHaveLength(77);
	expect(listedCourseCatalog).toHaveLength(70);
	for (const id of removed) {
		expect(
			listedCourseCatalog.some(course => course.id === id),
			id
		).toBe(false);
		expect(getCourseCatalogEntry(id)?.id).toBe(id);
	}
	for (const id of retained)
		expect(
			listedCourseCatalog.some(course => course.id === id),
			id
		).toBe(true);
	const paths = coursePathwayMaps.flatMap(path =>
		path.stages.flatMap(stage => stage.courseIds)
	);
	for (const id of removed) expect(paths, id).not.toContain(id);
	for (const id of retained) expect(paths, id).toContain(id);
});
it("offers only the listed courses in the actual public course selector", async () => {
	const pinia = createPinia();
	setActivePinia(pinia);
	window.history.replaceState({}, "", "/courses");
	const wrapper = mount(CourseExplorer, {
		props: { publicCatalog: true, browseAll: true },
		global: {
			plugins: [pinia],
			stubs: {
				RouterLink: {
					props: ["to"],
					template: '<a :href="to"><slot /></a>'
				}
			}
		}
	});
	try {
		await flushPromises();
		const choices = wrapper
			.findAll("#course-select option")
			.map(option => option.attributes("value"));
		expect(choices).toHaveLength(70);
		for (const id of removed) expect(choices, id).not.toContain(id);
		for (const id of retained) expect(choices, id).toContain(id);
	} finally {
		wrapper.unmount();
	}
});
it("removes those choices from public pathway links and labels", () => {
	const wrapper = mount(PathwaysPage, {
		global: {
			stubs: {
				RouterLink: {
					props: ["to"],
					template: '<a :href="to"><slot /></a>'
				}
			}
		}
	});
	try {
		const links = wrapper.findAll("a").map(link => link.attributes("href"));
		for (const id of removed)
			expect(links, id).not.toContain(`/courses#${id}`);
		for (const id of retained)
			expect(links, id).toContain(`/courses#${id}`);
		expect(wrapper.text()).toContain("Grammar and public speaking");
		expect(wrapper.text()).not.toMatch(
			/Reading, writing and speaking|Early reading and stories|Life and environment/
		);
	} finally {
		wrapper.unmount();
	}
});
