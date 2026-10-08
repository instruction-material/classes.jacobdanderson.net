import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import TheFooter from "@/components/TheFooter.vue";

describe("TheFooter.vue", () => {
	function mountFooter(compact: boolean) {
		return mount(TheFooter, {
			props: { compact },
			global: {
				stubs: {
					RouterLink: {
						props: ["to"],
						template: '<a :href="to"><slot /></a>'
					}
				}
			}
		});
	}

	it("keeps Contact last in the compact footer link row", () => {
		const wrapper = mountFooter(true);
		try {
			expect(
				wrapper
					.findAll(".site-footer__bottom .site-action-row a")
					.map(link => link.attributes("href"))
			).toEqual(["/privacy", "mailto:contact@example.com"]);
			expect(wrapper.text()).toContain("(opens your email app)");
		} finally {
			wrapper.unmount();
		}
	});

	it("preserves a single Contact link in the full home footer", () => {
		const wrapper = mountFooter(false);
		try {
			expect(wrapper.findAll('a[href^="mailto:"]')).toHaveLength(1);
			expect(wrapper.get('a[href="/privacy"]').text()).toBe("Privacy");
		} finally {
			wrapper.unmount();
		}
	});
});
