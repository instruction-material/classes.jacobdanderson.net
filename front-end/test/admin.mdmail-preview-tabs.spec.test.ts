import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import MdMail from "@/pages/admin/mdmail.vue";

vi.mock("@/api", () => ({
	api: {
		get: vi.fn().mockResolvedValue({ data: { students: [] } }),
		post: vi.fn()
	}
}));
vi.mock("@/modules/adminRecipients", () => ({
	fetchAdminRecipients: vi.fn().mockResolvedValue([])
}));
let wrapper: ReturnType<typeof mount>;
beforeEach(() => {
	setActivePinia(createPinia());
	vi.clearAllMocks();
});
afterEach(() => wrapper?.unmount());

describe("switchable session-note compose and preview", () => {
	it("opens in Compose with separate accessible view buttons", async () => {
		wrapper = mount(MdMail);
		await flushPromises();
		expect(wrapper.find('[data-testid="md-input"]').exists()).toBe(true);
		expect(wrapper.find('[data-testid="live-preview"]').exists()).toBe(
			false
		);
		expect(wrapper.find("label[for='markdown-input']").text()).toBe(
			"Notes"
		);
		expect(wrapper.find('[role="tablist"]').exists()).toBe(false);
		const controls = wrapper.get(
			'[role="group"][aria-label="Session note view"]'
		);
		expect(controls.findAll("button").map(button => button.text())).toEqual(
			["Compose", "Preview"]
		);
		expect(
			wrapper.get('[data-testid="compose-toggle"]').attributes()
		).toMatchObject({
			type: "button",
			"aria-pressed": "true",
			"aria-controls": "note-composer"
		});
		expect(
			wrapper.get('[data-testid="preview-toggle"]').attributes()
		).toMatchObject({
			type: "button",
			"aria-pressed": "false"
		});
		expect(
			wrapper
				.get('[data-testid="preview-toggle"]')
				.attributes("aria-controls")
		).toBeUndefined();
		expect(wrapper.get('[data-testid="md-input"]').isVisible()).toBe(true);
	});
	it("replaces the writing area with sanitized preview without resetting the draft", async () => {
		wrapper = mount(MdMail);
		await flushPromises();
		const draft =
			"**Hello** _world_\n<script>alert('synthetic')</script><img src=x onerror=alert('synthetic')>";
		await wrapper.get('[data-testid="md-input"]').setValue(draft);
		await wrapper.get('[data-testid="preview-toggle"]').trigger("click");
		const body = wrapper.get('[data-testid="live-preview-body"]');
		expect(body.html()).toContain("<strong>Hello</strong>");
		expect(body.html()).toContain("<em>world</em>");
		expect(body.find("script").exists()).toBe(false);
		expect(body.find("[onerror]").exists()).toBe(false);
		expect(
			wrapper.get<HTMLTextAreaElement>('[data-testid="md-input"]').element
				.value
		).toBe(draft);
		expect(wrapper.get('[data-testid="md-input"]').isVisible()).toBe(false);
		expect(wrapper.get('[data-testid="live-preview"]').isVisible()).toBe(
			true
		);
		expect(api.post).not.toHaveBeenCalled();
	});
	it("preserves readable homework lists in both preview and history", async () => {
		wrapper = mount(MdMail);
		await flushPromises();
		await wrapper
			.get('[data-testid="md-input"]')
			.setValue(
				"**Homework:**\n- Add a start and pause feature.\n- Add a timer mode."
			);
		await wrapper.get('[data-testid="preview-toggle"]').trigger("click");
		expect(
			wrapper
				.get('[data-testid="live-preview-body"]')
				.findAll("ul li")
				.map(item => item.text())
		).toEqual(["Add a start and pause feature.", "Add a timer mode."]);
		const source = readFileSync(
			resolve(__dirname, "../src/pages/admin/mdmail.vue"),
			"utf8"
		);
		expect(source).toContain(".preview-body :deep(ul),");
		expect(source).toContain(".history-note__body :deep(ul),");
		expect(source).toContain("padding-inline-start: 1.65rem;");
		expect(source).toContain("list-style-position: outside;");
	});
	it("returns to Compose with the draft and composer preserved", async () => {
		wrapper = mount(MdMail);
		await flushPromises();
		const composer = wrapper.get('[data-testid="md-input"]').element;
		const initialRequests = vi.mocked(api.get).mock.calls.length;
		await wrapper
			.get('[data-testid="md-input"]')
			.setValue("**Original draft**");
		const preview = wrapper.get('[data-testid="preview-toggle"]');
		const compose = wrapper.get('[data-testid="compose-toggle"]');
		await preview.trigger("click");
		expect(preview.attributes("aria-pressed")).toBe("true");
		expect(preview.attributes("aria-controls")).toBe("note-preview");
		expect(compose.attributes("aria-pressed")).toBe("false");
		expect(
			wrapper.get('[data-testid="live-preview"]').attributes()
		).toMatchObject({
			id: "note-preview",
			role: "region",
			"aria-label": "Note preview"
		});
		await preview.trigger("click");
		expect(wrapper.get('[data-testid="live-preview"]').isVisible()).toBe(
			true
		);
		await compose.trigger("click");
		expect(preview.attributes("aria-pressed")).toBe("false");
		expect(preview.attributes("aria-controls")).toBeUndefined();
		expect(compose.attributes("aria-pressed")).toBe("true");
		expect(wrapper.find('[data-testid="live-preview"]').exists()).toBe(
			false
		);
		expect(wrapper.get('[data-testid="md-input"]').isVisible()).toBe(true);
		expect(
			wrapper.get<HTMLTextAreaElement>('[data-testid="md-input"]').element
				.value
		).toBe("**Original draft**");
		await wrapper
			.get('[data-testid="md-input"]')
			.setValue("**Edited draft**");
		await preview.trigger("click");
		expect(
			wrapper.get('[data-testid="live-preview-body"]').html()
		).toContain("<strong>Edited draft</strong>");
		expect(wrapper.get('[data-testid="md-input"]').element).toBe(composer);
		expect(api.get).toHaveBeenCalledTimes(initialRequests);
		expect(api.post).not.toHaveBeenCalled();
	});
});
