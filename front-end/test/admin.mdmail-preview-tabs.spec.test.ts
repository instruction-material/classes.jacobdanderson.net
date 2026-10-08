import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import MdMail from "@/pages/admin/mdmail.vue";

vi.mock("@/api", () => ({ api: { get: vi.fn().mockResolvedValue({ data: { students: [] } }), post: vi.fn() } }));
vi.mock("@/modules/adminRecipients", () => ({ fetchAdminRecipients: vi.fn().mockResolvedValue([]) }));
let wrapper: ReturnType<typeof mount>;
beforeEach(() => {
	setActivePinia(createPinia());
	vi.clearAllMocks();
});
afterEach(() => wrapper?.unmount());

describe("compact session-note preview", () => {
	it("opens directly into the writing area without compose tabs", async () => {
		wrapper = mount(MdMail);
		await flushPromises();
		expect(wrapper.find("[data-testid=\"md-input\"]").exists()).toBe(true);
		expect(wrapper.find("[data-testid=\"live-preview\"]").exists()).toBe(false);
		expect(wrapper.find("label[for='markdown-input']").text()).toBe("Notes");
		expect(wrapper.find("[role=\"tablist\"]").exists()).toBe(false);
		expect(wrapper.find("[data-testid=\"preview-toggle\"]").attributes("aria-expanded")).toBe("false");
	});
	it("renders sanitized Markdown without hiding or resetting the draft", async () => {
		wrapper = mount(MdMail);
		await flushPromises();
		const draft = "**Hello** _world_\n<script>alert('synthetic')</script><img src=x onerror=alert('synthetic')>";
		await wrapper.get("[data-testid=\"md-input\"]").setValue(draft);
		await wrapper.get("[data-testid=\"preview-toggle\"]").trigger("click");
		const body = wrapper.get("[data-testid=\"live-preview-body\"]");
		expect(body.html()).toContain("<strong>Hello</strong>");
		expect(body.html()).toContain("<em>world</em>");
		expect(body.find("script").exists()).toBe(false);
		expect(body.find("[onerror]").exists()).toBe(false);
		expect(wrapper.get<HTMLTextAreaElement>("[data-testid=\"md-input\"]").element.value).toBe(draft);
		expect(api.post).not.toHaveBeenCalled();
	});
	it("preserves readable homework lists in both preview and history", async () => {
		wrapper = mount(MdMail);
		await flushPromises();
		await wrapper.get("[data-testid=\"md-input\"]").setValue("**Homework:**\n- Add a start and pause feature.\n- Add a timer mode.");
		await wrapper.get("[data-testid=\"preview-toggle\"]").trigger("click");
		expect(wrapper.get("[data-testid=\"live-preview-body\"]").findAll("ul li").map(item => item.text())).toEqual(["Add a start and pause feature.", "Add a timer mode."]);
		const source = readFileSync(resolve(__dirname, "../src/pages/admin/mdmail.vue"), "utf8");
		expect(source).toContain(".preview-body :deep(ul),");
		expect(source).toContain(".history-note__body :deep(ul),");
		expect(source).toContain("padding-inline-start: 1.65rem;");
		expect(source).toContain("list-style-position: outside;");
	});
	it("uses an accessible native toggle and retains the writing area when closing it", async () => {
		wrapper = mount(MdMail);
		await flushPromises();
		const toggle = wrapper.get("[data-testid=\"preview-toggle\"]");
		expect(toggle.attributes("type")).toBe("button");
		expect(toggle.attributes("aria-controls")).toBe("note-preview");
		await toggle.trigger("click");
		expect(toggle.attributes("aria-expanded")).toBe("true");
		expect(wrapper.get("[data-testid=\"live-preview\"]").attributes()).toMatchObject({ "id": "note-preview", "role": "region", "aria-label": "Note preview" });
		await toggle.trigger("click");
		expect(toggle.attributes("aria-expanded")).toBe("false");
		expect(wrapper.find("[data-testid=\"live-preview\"]").exists()).toBe(false);
		expect(wrapper.find("[data-testid=\"md-input\"]").exists()).toBe(true);
		expect(api.post).not.toHaveBeenCalled();
	});
});
