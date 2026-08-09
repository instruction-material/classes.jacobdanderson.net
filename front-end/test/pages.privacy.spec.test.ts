import { mount } from "@vue/test-utils";
import { createHead, renderSSRHead } from "@unhead/vue/server";
import { describe, expect, it } from "vitest";
import TheFooter from "@/components/TheFooter.vue";
import PrivacyPage from "@/pages/privacy.vue";

const routerLinkStub = {
	props: ["to"],
	template: '<a :href="to"><slot /></a>'
};

describe("public Scratch privacy disclosure", () => {
	it("publishes metadata and explains the Scratch-controlled services", async () => {
		const head = createHead();
		const wrapper = mount(PrivacyPage, {
			global: { plugins: [head] }
		});
		const renderedHead = await renderSSRHead(head);

		expect(renderedHead.headTags).toContain(
			"<title>Privacy | Classes</title>"
		);
		expect(renderedHead.headTags).toContain(
			"How optional external Scratch solution players handle browser connections."
		);
		expect(wrapper.text()).toContain(
			"Browsing a course does not contact MIT Scratch."
		);
		expect(wrapper.text()).toContain("including third-party services");
		expect(wrapper.text()).toContain(
			"does not send your Classes account details, course progress, or saved browser projects"
		);
	});

	it("links the public privacy notice from the site footer", () => {
		const wrapper = mount(TheFooter, {
			global: { stubs: { RouterLink: routerLinkStub } }
		});

		expect(wrapper.get('a[href="/privacy"]').text()).toBe("Privacy");
	});
});
