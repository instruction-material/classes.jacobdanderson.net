import { mount } from "@vue/test-utils";
import { createHead } from "@unhead/vue/server";
import { describe, expect, it } from "vitest";
import PaymentPage from "@/pages/payment.vue";

describe("PaymentPage", () => {
	it("keeps payment destinations unconfigured until supplied by the instructor", () => {
		const wrapper = mount(PaymentPage, {
			global: {
				plugins: [createHead()],
				stubs: {
					RouterLink: {
						props: ["to"],
						template: '<a :href="to"><slot /></a>'
					}
				}
			}
		});
		expect(wrapper.get("h1").text()).toBe(
			"No payment destination is configured"
		);
		expect(wrapper.text()).toContain("Contact your instructor");
		expect(wrapper.text()).not.toMatch(/\$40|50 Minutes|Venmo|Zelle/);
		expect(wrapper.find('a[href^="https:"]').exists()).toBe(false);
		expect(wrapper.find('a[href^="mailto:"]').exists()).toBe(false);
		expect(wrapper.find("img").exists()).toBe(false);
		expect(wrapper.find('a[href="/courses"]').exists()).toBe(true);
		expect(wrapper.find('a[href="/signup"]').exists()).toBe(false);
		wrapper.unmount();
	});
});
