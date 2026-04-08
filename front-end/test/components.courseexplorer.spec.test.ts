import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CourseExplorer from "@/components/CourseExplorer.vue";

describe("CourseExplorer.vue", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("renders public course-library content without auth state", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});

		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Core lessons");
		});

		expect(wrapper.text()).toContain("Course Library");
		expect(wrapper.text()).toContain("Scratch Level 1");
		expect(wrapper.text()).toContain("Supplemental projects");
	});
});
