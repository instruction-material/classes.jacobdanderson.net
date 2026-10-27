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
			expect(wrapper.findAll("footer")).toHaveLength(1);
			expect(wrapper.findAll("h2, h3, .site-footer__inner")).toHaveLength(
				0
			);
			expect(
				wrapper.findAll("nav a").map(link => link.attributes("href"))
			).toEqual(["/privacy", "mailto:contact@example.com"]);
			for (const link of wrapper.findAll('a[target="_blank"]')) {
				expect(link.attributes("rel")).toBe("noopener noreferrer");
				expect(link.text()).toContain("(opens in a new tab)");
			}
		} finally {
			wrapper.unmount();
		}
	});

	it.each([false, true])(
		"retains the accessible theme control (%s)",
		compact => {
			const wrapper = mountFooter(compact);
			try {
				expect(
					Array.from(
						wrapper.get(".site-footer__bottom").element.children
					).map(child => child.tagName)
				).toEqual(["P", "NAV", "BUTTON"]);
				const button = wrapper.get("button");
				expect(button.attributes("type")).toBe("button");
				expect(button.attributes("aria-label")).toMatch(
					/^Switch to (light|dark) mode$/
				);
				expect(button.attributes("aria-pressed")).toMatch(
					/^(true|false)$/
				);
				expect(wrapper.get("nav").attributes("aria-label")).toBe(
					"Footer"
				);
			} finally {
				wrapper.unmount();
			}
		}
	);
});
