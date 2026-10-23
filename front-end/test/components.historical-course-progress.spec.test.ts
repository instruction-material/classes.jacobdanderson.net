import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import HistoricalCourseProgress from "@/components/HistoricalCourseProgress.vue";

const course = {
	id: "pre-algebra-b",
	name: "Pre-Algebra B",
	modules: []
};

describe("HistoricalCourseProgress", () => {
	it("shows exact saved identities without assigning them to current lessons", async () => {
		const oldId = "pre-algebra-b-retired-checkpoint";
		const wrapper = mount(HistoricalCourseProgress, {
			props: {
				course,
				progress: {
					courseId: course.id,
					completedModuleIds: [],
					completedItemIds: [oldId]
				}
			}
		});

		expect(wrapper.text()).toContain("Earlier completions (1)");
		expect(wrapper.find("code").text()).toBe(oldId);
		expect(
			wrapper.find('button[aria-label^="Remove earlier"]').exists()
		).toBe(false);
		const trigger = wrapper.get(".workspace-disclosure__trigger");
		expect(trigger.attributes("aria-expanded")).toBe("false");
		await trigger.trigger("click");
		expect(trigger.attributes("aria-expanded")).toBe("true");
		await wrapper.setProps({ editable: true });
		await wrapper
			.get('button[aria-label^="Remove earlier"]')
			.trigger("click");
		expect(wrapper.emitted("remove")?.[0]).toEqual([
			{ id: oldId, kind: "item" }
		]);
	});

	it("limits rendered history until requested", async () => {
		const wrapper = mount(HistoricalCourseProgress, {
			props: {
				course,
				progress: {
					courseId: course.id,
					completedModuleIds: [],
					completedItemIds: Array.from(
						{ length: 51 },
						(_, index) => `pre-algebra-b-retired-${index}`
					)
				}
			}
		});

		expect(wrapper.findAll("li")).toHaveLength(50);
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Show more")!
			.trigger("click");
		expect(wrapper.findAll("li")).toHaveLength(51);
	});

	it("shows saved IDs for a course no longer in the catalog", () => {
		const oldId = "java-without-graphics-old-item";
		const wrapper = mount(HistoricalCourseProgress, {
			props: {
				course: null,
				progress: {
					courseId: "java-without-graphics",
					completedModuleIds: [],
					completedItemIds: [oldId]
				}
			}
		});

		expect(wrapper.find("code").text()).toBe(oldId);
		expect(
			wrapper.find('button[aria-label^="Remove earlier"]').exists()
		).toBe(false);
	});
});
