import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import { retainNoteSendIntent } from "@/modules/sessionNoteSendIntent";
import MdMail from "@/pages/admin/mdmail.vue";

vi.mock("@/api", () => ({ api: { get: vi.fn(), post: vi.fn() } }));
vi.mock("@/modules/adminRecipients", () => ({
	fetchAdminRecipients: vi
		.fn()
		.mockResolvedValue([
			{ name: "Synthetic Student", emails: ["student@example.invalid"] }
		])
}));
vi.mock("@/modules/sessionNoteSendIntent", () => ({
	retainNoteSendIntent: vi.fn()
}));

const studentId = "a".repeat(24);
const sessionId = "b".repeat(24);
const noteId = "c".repeat(24);
let wrapper: ReturnType<typeof mount>;

beforeEach(() => {
	setActivePinia(createPinia());
	vi.clearAllMocks();
	vi.mocked(api.get).mockReset();
	vi.mocked(api.post).mockReset();
	vi.mocked(retainNoteSendIntent).mockReset();
	vi.mocked(api.get).mockImplementation(async (path: string) => ({
		data: path.endsWith("/identities")
			? {
					students: [
						{
							studentId,
							name: "Synthetic Student",
							recipientName: "Synthetic Student"
						}
					]
				}
			: {
					scheduledSessions: [
						{
							_id: sessionId,
							startAt: "2026-09-30T17:00:00Z",
							timezone: "America/New_York"
						}
					],
					sessionNotes: []
				}
	}));
	vi.mocked(api.post).mockImplementation(async (path: string) => ({
		data: path.endsWith("/session-notes")
			? { sessionNote: { _id: noteId } }
			: {
					ok: true,
					operationId: "synthetic-operation",
					evidenceStatus: "smtp_accepted"
				}
	}));
	vi.mocked(retainNoteSendIntent).mockImplementation(
		async (signature, saveDraft) => ({
			signature,
			key: "synthetic-send-idempotency-key",
			noteId: await saveDraft()
		})
	);
});
afterEach(() => wrapper?.unmount());

async function compose(selectStudent = true) {
	wrapper = mount(MdMail, { attachTo: document.body });
	await flushPromises();
	if (selectStudent) {
		await wrapper.get("#note-student").setValue(studentId);
		await flushPromises();
	}
	await wrapper.get("#recipient-select").setValue("Synthetic Student");
	await wrapper.get("#subject-date-input").setValue("2026-09-30");
	await wrapper.get("#markdown-input").setValue("Synthetic note body");
}

describe("direct, safely validated session-note sending", () => {
	it("sends a complete unlinked note from Compose with one click", async () => {
		await compose();
		await wrapper.get("#note-unlinked").setValue(true);
		expect(wrapper.get(".send-btn").text()).toBe("Send");
		expect(wrapper.get(".send-btn").attributes("disabled")).toBeUndefined();
		await wrapper.get(".send-btn").trigger("click");
		await flushPromises();
		expect(api.post).toHaveBeenCalledTimes(2);
		expect(api.post).toHaveBeenLastCalledWith(
			"/admin-mail/send",
			expect.objectContaining({
				studentId,
				noteId,
				unlinked: true,
				scheduledSessionId: undefined,
				idempotencyKey: "synthetic-send-idempotency-key",
				subject: "Session Notes (09/30)"
			}),
			{ withCredentials: true }
		);
		expect(wrapper.find('[data-testid="live-preview"]').exists()).toBe(
			false
		);
	});
	it("sends only the explicitly selected scheduled session", async () => {
		await compose();
		await wrapper.get("#note-session").setValue(sessionId);
		await wrapper.get(".send-btn").trigger("click");
		await flushPromises();
		expect(api.post).toHaveBeenLastCalledWith(
			"/admin-mail/send",
			expect.objectContaining({
				studentId,
				scheduledSessionId: sessionId,
				unlinked: false
			}),
			{ withCredentials: true }
		);
	});
	it("explains missing association instead of silently disabling Send", async () => {
		await compose();
		await wrapper.get(".send-btn").trigger("click");
		expect(wrapper.get("#send-validation").text()).toContain(
			"check Unlinked note"
		);
		expect(document.activeElement?.id).toBe("note-unlinked");
		expect(api.post).not.toHaveBeenCalled();
	});
	it("requires student identity without inferring it from the recipient or date", async () => {
		await compose(false);
		await wrapper.get("#note-unlinked").setValue(true);
		await wrapper.get(".send-btn").trigger("click");
		expect(wrapper.get("#send-validation").text()).toContain(
			"Select the student"
		);
		expect(document.activeElement?.id).toBe("note-student");
		expect(api.post).not.toHaveBeenCalled();
	});
	it("retains an existing draft when its student is selected for the first time", async () => {
		await compose(false);
		await wrapper.get("#note-student").setValue(studentId);
		await flushPromises();
		expect(
			wrapper.get<HTMLTextAreaElement>("#markdown-input").element.value
		).toBe("Synthetic note body");
		expect(
			wrapper.get<HTMLInputElement>("#subject-input").element.value
		).toBe("Session Notes (09/30)");
		expect(wrapper.find(".student-context-confirmation").exists()).toBe(
			false
		);
	});
	it("keeps Preview optional and never sends from the Preview tab control", async () => {
		await compose();
		await wrapper.get('[data-testid="tab-preview"]').trigger("click");
		expect(wrapper.get('[data-testid="live-preview"]').exists()).toBe(true);
		expect(api.post).not.toHaveBeenCalled();
	});
	it("rejects a whitespace-only body with visible feedback", async () => {
		await compose();
		await wrapper.get("#note-unlinked").setValue(true);
		await wrapper.get("#markdown-input").setValue("  \n ");
		await wrapper.get(".send-btn").trigger("click");
		expect(wrapper.get("#send-validation").text()).toContain(
			"Write the note"
		);
		expect(api.post).not.toHaveBeenCalled();
	});
	it("reuses the saved note and send key after a request failure", async () => {
		await compose();
		await wrapper.get("#note-unlinked").setValue(true);
		vi.mocked(api.post).mockImplementation(async path => {
			if (path === "/admin-mail/send")
				throw new Error("Synthetic network interruption");
			return { data: { sessionNote: { _id: noteId } } };
		});
		await wrapper.get(".send-btn").trigger("click");
		await flushPromises();
		await wrapper.get(".send-btn").trigger("click");
		await flushPromises();
		expect(retainNoteSendIntent).toHaveBeenCalledTimes(1);
		expect(
			vi
				.mocked(api.post)
				.mock.calls.filter(([path]) => path.endsWith("/session-notes"))
		).toHaveLength(1);
		const attempts = vi
			.mocked(api.post)
			.mock.calls.filter(([path]) => path === "/admin-mail/send");
		expect(attempts).toHaveLength(2);
		expect(attempts[0][1]).toEqual(attempts[1][1]);
	});
	it("exposes student-list errors and offers a safe retry", async () => {
		vi.mocked(api.get).mockRejectedValueOnce(
			new Error("Synthetic identity load failure")
		);
		wrapper = mount(MdMail);
		await flushPromises();
		expect(wrapper.text()).toContain("Unable to load students");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Retry student list")!
			.trigger("click");
		await flushPromises();
		expect(
			wrapper
				.find("#note-student option[value='" + studentId + "']")
				.exists()
		).toBe(true);
	});
});
