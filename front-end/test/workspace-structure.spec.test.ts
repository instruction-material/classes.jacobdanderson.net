import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { reactive } from "vue";
import { routeLocationKey } from "vue-router";
import { api } from "@/api";
import AdminReviewStatus from "@/components/AdminReviewStatus.vue";
import IdeStarterPicker from "@/components/IdeStarterPicker.vue";
import TutorProfile from "@/components/TutorProfile.vue";
import { ideStarters } from "@/modules/ideStarterCatalog";
import MdMail from "@/pages/admin/mdmail.vue";
import Pathways from "@/pages/pathways.vue";
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
function user(id: string, name: string) {
	return {
		_id: id,
		name,
		email: `${id}@example.invalid`,
		age: 14,
		state: "GA",
		courseAccess: [],
		editUsers: false,
		saveEdit: "Save"
	};
}
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
		expect(ideStarters).toHaveLength(27);
		expect(new Set(ideStarters.map(item => item.id)).size).toBe(27);
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
		await wrapper.findAll("select")[0].setValue("assembly");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Assembly and C Caller")!
			.trigger("click");
		expect(wrapper.emitted("choose")![2][0]).toMatchObject({
			mode: "assembly",
			template: "course"
		});
		await wrapper.findAll("select")[1].setValue("Blank");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Blank Assembly")!
			.trigger("click");
		expect(wrapper.emitted("choose")![3][0]).toMatchObject({
			mode: "assembly",
			template: "blank"
		});
		await wrapper.findAll("select")[0].setValue("rust");
		await wrapper.findAll("select")[1].setValue("Templates");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Rust Cargo Project")!
			.trigger("click");
		expect(wrapper.emitted("choose")![4][0]).toMatchObject({
			mode: "rust",
			template: "course"
		});
		await wrapper.findAll("select")[1].setValue("Blank");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Blank Rust")!
			.trigger("click");
		expect(wrapper.emitted("choose")![5][0]).toMatchObject({
			mode: "rust",
			template: "blank"
		});
		await wrapper.findAll("select")[0].setValue("web");
		await wrapper.findAll("select")[1].setValue("Templates");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "HTML, CSS and JavaScript")!
			.trigger("click");
		expect(wrapper.emitted("choose")![6][0]).toMatchObject({
			mode: "web",
			template: "blank"
		});
		await wrapper.findAll("select")[0].setValue("swift");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "SwiftUI App Source")!
			.trigger("click");
		expect(wrapper.emitted("choose")![7][0]).toMatchObject({
			mode: "swift",
			template: "blank"
		});
		wrapper.unmount();
	});
	it("selects one learner without search or introductory text", async () => {
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
		expect(wrapper.find('input[type="search"]').exists()).toBe(false);
		expect(wrapper.find(".section-heading").exists()).toBe(false);
		expect(wrapper.text()).not.toContain("Search learners");
		expect(wrapper.text()).not.toContain(
			"Update course access for each learner"
		);
		expect(wrapper.findAll(".directory-card")).toHaveLength(0);
		const selector = wrapper.get(".learner-selector select");
		expect(selector.findAll("option").map(option => option.text())).toEqual(
			["Ada", "Grace"]
		);
		expect(selector.element.value).toBe("one");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Edit course access")!
			.trigger("click");
		expect(
			wrapper
				.findComponent({ name: "LearnerCourseAccess" })
				.props("editable")
		).toBe(true);
		expect(wrapper.find(".learner-content").exists()).toBe(true);
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
	it("requires a verified recipient choice without additional identity controls", async () => {
		const wrapper = mount(MdMail, { global: { stubs } });
		await flushPromises();
		expect(wrapper.find("#note-student").exists()).toBe(false);
		await wrapper.get("#subject-date-input").setValue("2026-10-04");
		await wrapper.get("#markdown-input").setValue("Synthetic note");
		await wrapper.get(".send-btn").trigger("click");
		expect(wrapper.get("#send-validation").text()).toContain(
			"Select a recipient"
		);
		expect(api.post).not.toHaveBeenCalled();
		wrapper.unmount();
	});
	it("previews session notes without introducing another message mode", async () => {
		const wrapper = mount(MdMail, { global: { stubs } });
		await flushPromises();
		expect(wrapper.find(".message-kind").exists()).toBe(false);
		await wrapper
			.get("#subject-input")
			.setValue("Synthetic internal message");
		await wrapper.get("#markdown-input").setValue("Synthetic body");
		await wrapper.get('[data-testid="preview-toggle"]').trigger("click");
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
					: path === "/users/child-a/session-notes/recent"
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
						: path === "/users/child-b/session-notes/recent"
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
		await wrapper.get("#recipient-select").setValue("child-a");
		await flushPromises();
		expect(api.get).toHaveBeenCalledWith(
			"/users/child-a/session-notes/recent"
		);
		expect(wrapper.findAll(".history-note")).toHaveLength(1);
		expect(wrapper.get(".history-note").text()).toContain("Child A draft");
		expect(wrapper.text()).not.toContain("Foreign draft");
		expect(
			wrapper
				.findAll("#recipient-select option")
				.map(option => option.text())
		).toContain("Same name · hild-a");
		await wrapper.get("#recipient-select").setValue("child-b");
		await flushPromises();
		expect(api.get).toHaveBeenCalledWith(
			"/users/child-b/session-notes/recent"
		);
		expect(wrapper.get(".history-note").text()).toContain("Child B draft");
		expect(wrapper.text()).not.toContain("Child A draft");
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
			wrapper.get<HTMLSelectElement>("#recipient-select").element.value
		).toBe("a");
		await wrapper
			.get("#markdown-input")
			.setValue("Student A private draft");
		route.query.student = "b";
		await flushPromises();
		expect(
			wrapper.get<HTMLSelectElement>("#recipient-select").element.value
		).toBe("a");
		expect(
			wrapper.get<HTMLTextAreaElement>("#markdown-input").element.value
		).toBe("Student A private draft");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Keep current recipient")!
			.trigger("click");
		await wrapper.get("#recipient-select").setValue("b");
		await wrapper
			.findAll("button")
			.find(
				button => button.text() === "Discard draft and switch recipient"
			)!
			.trigger("click");
		await flushPromises();
		expect(
			wrapper.get<HTMLSelectElement>("#recipient-select").element.value
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
