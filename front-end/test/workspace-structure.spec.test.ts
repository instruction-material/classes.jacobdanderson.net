import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { reactive } from "vue";
import { routeLocationKey } from "vue-router";
import { api } from "@/api";
import IdeStarterPicker from "@/components/IdeStarterPicker.vue";
import TutorProfile from "@/components/TutorProfile.vue";
import AdminReviewStatus from "@/components/AdminReviewStatus.vue";
import MdMail from "@/pages/admin/mdmail.vue";
import Pathways from "@/pages/pathways.vue";
import { ideStarters } from "@/modules/ideStarterCatalog";
import { useAppStore } from "@/stores/app";
vi.mock("@/api", () => ({ api: { get: vi.fn(), post: vi.fn() } }));
vi.mock("@/modules/adminRecipients", () => ({
	fetchAdminRecipients: vi
		.fn()
		.mockResolvedValue([
			{ name: "Test Parent", emails: ["synthetic@example.invalid"] }
		])
}));
vi.mock("vue-router", async importOriginal => ({
	...(await importOriginal<typeof import("vue-router")>()),
	useRoute: () => ({ path: "/admin/mdmail" })
}));
const user = (id: string, name: string) => ({
	_id: id,
	name,
	email: `${id}@example.invalid`,
	age: 14,
	state: "GA",
	courseAccess: [],
	editUsers: false,
	saveEdit: "Save"
});
const stubs = {
	RouterLink: { props: ["to"], template: "<a><slot /></a>" },
	CourseAccessCodeManager: true,
	LearnerSessionTools: true,
	LearnerCodeReviewTools: true,
	SessionNoteEvidenceReview: true
};
beforeEach(() => {
	setActivePinia(createPinia());
	vi.clearAllMocks();
	window.history.replaceState({}, "", "/");
	vi.mocked(api.get).mockResolvedValue({
		data: {
			students: [],
			operations: [],
			unlinkedNotes: [],
			externalEvidence: [],
			writerMarkers: []
		}
	});
});
describe("simplified workspaces", () => {
	it("filters existing starters and creates only the chosen project", async () => {
		const wrapper = mount(IdeStarterPicker, {
			props: { open: true },
			global: { stubs: { Teleport: true } }
		});
		expect(ideStarters).toHaveLength(22);
		expect(new Set(ideStarters.map(item => item.id)).size).toBe(22);
		await wrapper.findAll("select")[0].setValue("java");
		expect(wrapper.text()).toContain("Java Outline");
		expect(wrapper.text()).not.toContain("Python Level 1 Outline");
		await wrapper.findAll("select")[1].setValue("Demos");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Demo Java")!
			.trigger("click");
		expect(wrapper.emitted("choose")![0][0]).toMatchObject({
			mode: "java",
			template: "demo"
		});
		await wrapper.findAll("select")[0].setValue("cpp");
		await wrapper.findAll("select")[1].setValue("Templates");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "C++ Console Source")!
			.trigger("click");
		expect(wrapper.emitted("choose")![1][0]).toMatchObject({
			mode: "cpp",
			template: "course"
		});
		wrapper.unmount();
	});
	it("puts learner search first and keeps tutor security in Account", async () => {
		const app = useAppStore();
		app.setCurrentTutor({
			_id: "teacher",
			name: "Teacher",
			email: "teacher@example.invalid",
			age: 30,
			state: "GA",
			coursePermissions: [],
			editTutors: false,
			saveEdit: "Save",
			usersOfTutorLength: 2
		});
		vi.mocked(api.get).mockResolvedValue({
			data: [user("one", "Ada"), user("two", "Grace")]
		});
		const wrapper = mount(TutorProfile, {
			props: { mode: "teaching" },
			global: { stubs }
		});
		await flushPromises();
		expect(wrapper.text()).not.toContain("Manage account security");
		await wrapper.get('input[type="search"]').setValue("Grace");
		expect(wrapper.findAll(".directory-card")).toHaveLength(1);
		expect(wrapper.find(".directory-card").text()).toContain("Grace");
		wrapper.unmount();
	});
	it("shows honest bounded review status only for an administrator", async () => {
		const anonymous = mount(AdminReviewStatus, { global: { stubs } });
		await flushPromises();
		expect(api.get).not.toHaveBeenCalled();
		anonymous.unmount();
		useAppStore().setCurrentAdmin({
			_id: "admin",
			name: "Admin",
			email: "admin@example.invalid",
			editAdmins: false,
			saveEdit: "Save"
		});
		vi.mocked(api.get).mockResolvedValue({
			data: {
				operations: [{}],
				unlinkedNotes: [{}],
				externalEvidence: [],
				writerMarkers: []
			}
		});
		const wrapper = mount(AdminReviewStatus, { global: { stubs } });
		await flushPromises();
		expect(wrapper.text()).toContain("2 review entries need attention");
		expect(wrapper.text()).toContain("same note");
		wrapper.unmount();
	});
	it("keeps a completed empty review check out of the working area", async () => {
		useAppStore().setCurrentAdmin({
			_id: "admin",
			name: "Admin",
			email: "admin@example.invalid",
			editAdmins: false,
			saveEdit: "Save"
		});
		const wrapper = mount(AdminReviewStatus, { global: { stubs } });
		await flushPromises();
		expect(wrapper.find('[role="status"]').exists()).toBe(false);
		wrapper.unmount();
	});
	it("requires student and session identity for session notes, independent of label date", async () => {
		const wrapper = mount(MdMail, { global: { stubs } });
		await flushPromises();
		expect(wrapper.get("#note-student").exists()).toBe(true);
		await wrapper.get("#recipient-select").setValue("Test Parent");
		await wrapper.get("#subject-date-input").setValue("2026-10-04");
		await wrapper.get("#markdown-input").setValue("Synthetic note");
		await wrapper.get(".send-btn").trigger("click");
		expect(wrapper.get("#send-validation").text()).toContain(
			"Select the student"
		);
		expect(api.post).not.toHaveBeenCalled();
		wrapper.unmount();
	});
	it("previews internal messages without silently becoming a session-note send", async () => {
		const wrapper = mount(MdMail, { global: { stubs } });
		await flushPromises();
		await wrapper.get(".message-kind select").setValue("internal");
		await wrapper.get("#recipient-select").setValue("Test Parent");
		await wrapper
			.get("#subject-input")
			.setValue("Synthetic internal message");
		await wrapper.get("#markdown-input").setValue("Synthetic body");
		await wrapper.get('[data-testid="tab-preview"]').trigger("click");
		expect(wrapper.get('[data-testid="live-preview"]').exists()).toBe(true);
		expect(api.post).not.toHaveBeenCalled();
		wrapper.unmount();
	});
	it("keeps public pathways searchable without expanding every course description", async () => {
		const wrapper = mount(Pathways, { global: { stubs } });
		const total = wrapper.findAll(".pathway-card").length;
		expect(total).toBeGreaterThan(10);
		expect(wrapper.findAll(".pathway-card > details[open]")).toHaveLength(
			0
		);
		await wrapper.get('input[type="search"]').setValue("turtle");
		expect(wrapper.findAll(".pathway-card").length).toBeLessThan(total);
		await wrapper
			.get('input[type="search"]')
			.setValue("no matching family 12345");
		expect(wrapper.text()).toContain("No matching pathways");
		wrapper.unmount();
	});
	it("loads saved notes by student ID when siblings share a recipient", async () => {
		vi.mocked(api.get).mockImplementation(async (path: string) => ({
			data:
				path === "/admin-mail/session-notes/identities"
					? {
							students: [
								{
									studentId: "child-a",
									name: "Same name",
									recipientName: "Test Parent"
								},
								{
									studentId: "child-b",
									name: "Same name",
									recipientName: "Test Parent"
								}
							]
						}
					: path === "/users/child-a/session-notes"
						? {
								sessionNotes: [
									{
										_id: "note-a",
										studentId: "child-a",
										primaryEmail:
											"synthetic@example.invalid",
										ccEmails: [],
										sessionDate: "2026-10-04T10:00:00.000Z",
										markdown: "Child A draft",
										subject: "A"
									},
									{
										_id: "foreign",
										studentId: "child-b",
										primaryEmail:
											"synthetic@example.invalid",
										ccEmails: [],
										sessionDate: "2026-10-04T11:00:00.000Z",
										markdown: "Foreign draft"
									}
								]
							}
						: path === "/users/child-b/session-notes"
							? {
									sessionNotes: [
										{
											_id: "note-b",
											studentId: "child-b",
											primaryEmail:
												"synthetic@example.invalid",
											ccEmails: [],
											sessionDate:
												"2026-10-04T11:00:00.000Z",
											markdown: "Child B draft",
											subject: "B"
										}
									]
								}
							: {
									sessions: [],
									operations: [],
									unlinkedNotes: [],
									externalEvidence: [],
									writerMarkers: []
								}
		}));
		const wrapper = mount(MdMail, { global: { stubs } });
		await flushPromises();
		await wrapper.get("#note-student").setValue("child-a");
		await flushPromises();
		expect(api.get).toHaveBeenCalledWith("/users/child-a/session-notes");
		expect(
			wrapper.find('#saved-note option[value="foreign"]').exists()
		).toBe(false);
		await wrapper.get("#note-student").setValue("child-b");
		await flushPromises();
		expect(api.get).toHaveBeenCalledWith("/users/child-b/session-notes");
		expect(
			wrapper.find('#saved-note option[value="note-a"]').exists()
		).toBe(false);
		await wrapper.get("#saved-note").setValue("note-b");
		expect(
			wrapper.get<HTMLTextAreaElement>("#markdown-input").element.value
		).toBe("Child B draft");
		expect(api.post).not.toHaveBeenCalled();
		wrapper.unmount();
	});
	it("keeps a student's draft until a requested context change is confirmed", async () => {
		vi.mocked(api.get).mockImplementation(async (path: string) => ({
			data: path.endsWith("/identities")
				? {
						students: [
							{
								studentId: "a",
								name: "Same name",
								recipientName: "Test Parent"
							},
							{
								studentId: "b",
								name: "Same name",
								recipientName: "Test Parent"
							}
						]
					}
				: { scheduledSessions: [], sessionNotes: [] }
		}));
		const route = reactive({ query: { student: "a" } });
		const wrapper = mount(MdMail, {
			global: { stubs, provide: { [routeLocationKey as symbol]: route } }
		});
		await flushPromises();
		expect(
			wrapper.get<HTMLSelectElement>("#note-student").element.value
		).toBe("a");
		await wrapper
			.get("#markdown-input")
			.setValue("Student A private draft");
		route.query.student = "b";
		await flushPromises();
		expect(
			wrapper.get<HTMLSelectElement>("#note-student").element.value
		).toBe("a");
		expect(
			wrapper.get<HTMLTextAreaElement>("#markdown-input").element.value
		).toBe("Student A private draft");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Keep current student")!
			.trigger("click");
		await wrapper.get("#note-student").setValue("b");
		await wrapper
			.findAll("button")
			.find(
				button => button.text() === "Discard draft and switch student"
			)!
			.trigger("click");
		await flushPromises();
		expect(
			wrapper.get<HTMLSelectElement>("#note-student").element.value
		).toBe("b");
		expect(
			wrapper.get<HTMLTextAreaElement>("#markdown-input").element.value
		).toBe("");
		expect(api.post).not.toHaveBeenCalled();
		route.query.student = "foreign";
		await flushPromises();
		expect(wrapper.text()).toContain("requested student is unavailable");
		await wrapper.get(".send-btn").trigger("click");
		expect(api.post).not.toHaveBeenCalled();
		wrapper.unmount();
	});
});
