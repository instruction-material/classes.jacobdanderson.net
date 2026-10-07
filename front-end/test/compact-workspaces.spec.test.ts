import { readFileSync } from "node:fs";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AccountSecurity from "@/components/AccountSecurity.vue";
import GraphSketcherWorkspace from "@/components/GraphSketcherWorkspace.vue";

const mocks = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock("@/api", () => ({ api: { post: mocks.post } }));
const source = (file: string) => readFileSync(new URL("../src/" + file, import.meta.url), "utf8");
beforeEach(() => { setActivePinia(createPinia()); vi.clearAllMocks(); window.localStorage.clear(); });
describe("content-first workspace refinements", () => {
	it("keeps recovery protected and unlisted, without review polling or roster embeds", () => {
		const shell = source("components/AdminWorkspaceShell.vue");
		expect(shell).not.toContain("AdminReviewStatus");
		expect(shell).not.toContain('to: "/courses"');
		expect(shell.indexOf('label: "Session notes"')).toBeLessThan(shell.indexOf('label: "People"'));
		expect(shell).toContain('to: "/admin/ide-reports"');
		expect(source("pages/admin/mdmail.vue")).not.toContain("SessionNoteEvidenceReview");
		expect(source("pages/admin/session-note-recovery.vue")).toContain("requiresAdmin: true");
		expect(shell).not.toContain("session-note-recovery");
		expect(source("pages/admin/student-management.vue")).not.toContain("<iframe");
	});
	it("keeps IDE backup and rename inside settings and starts the explorer closed", () => {
		const ide = source("components/CodeIdeWorkspace.vue");
		expect(ide).toContain("const sidebarCollapsed = ref(true)");
		expect(ide).not.toContain("Protect local saves");
		expect(ide).not.toContain("Storage: your account");
		expect(ide).not.toContain("Project name ·");
		expect(ide).toContain('class="project-context"');
		expect(ide).toContain("selectedProject.courseProjectTitle");
		const settings = ide.slice(ide.indexOf('id="code-ide-settings-panel"'), ide.indexOf('@click="downloadSelectedProject"'));
		expect(settings).toContain("Project name");
		expect(settings).toContain('aria-label="Download project ZIP"');
		expect(source("pages/ide.vue")).not.toContain("<select");
		expect(ide).toContain('<IdeEnvironmentSelect');
	});
	it("opens graph settings from coordinates and keeps restored content without save clutter", async () => {
		const wrapper = mount(GraphSketcherWorkspace);
		expect(wrapper.text()).not.toMatch(/Expand graph|Show inspector|Saved on this device|Restored the graph/);
		const control = wrapper.get('[aria-label="Graph settings"]');
		expect(control.element.parentElement?.className).toBe("graph-coordinate-tools");
		expect(control.attributes("aria-expanded")).toBe("false");
		await control.trigger("click");
		expect(control.attributes("aria-expanded")).toBe("true");
		await wrapper.get('[aria-label="Close graph settings"]').trigger("click");
		expect(control.attributes("aria-expanded")).toBe("false");
		expect(wrapper.get(".graph-sketcher-page").attributes("style")).toMatch(/height:/);
		wrapper.unmount();
	});
	it("keeps the existing email until verification and clears password input immediately", async () => {
		mocks.post.mockResolvedValue({ data: { message: "Check your new email to verify the change." } });
		const wrapper = mount(AccountSecurity, { props: { email: "old@example.invalid", entityId: "synthetic", role: "admin" } });
		await wrapper.get('[name="account-email"]').setValue("new@example.invalid");
		await wrapper.get('[name="email-current-password"]').setValue("synthetic-password");
		await wrapper.findAll("button").find(button => button.text() === "Send verification")!.trigger("click");
		expect(mocks.post).toHaveBeenCalledWith("/accounts/changeEmail/synthetic", { email: "new@example.invalid", currentPassword: "synthetic-password" });
		expect(wrapper.get<HTMLInputElement>('[name="email-current-password"]').element.value).toBe("");
		expect(wrapper.text()).not.toContain("Email updated successfully");
		wrapper.unmount();
	});
});
