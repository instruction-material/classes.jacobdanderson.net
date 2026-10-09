import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import { fetchAdminRecipients } from "@/modules/adminRecipients";
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
const noteId = "c".repeat(24);
let wrapper: ReturnType<typeof mount>;

beforeEach(() => {
	setActivePinia(createPinia());
	vi.clearAllMocks();
	vi.mocked(api.get).mockReset();
	vi.mocked(api.post).mockReset();
	vi.mocked(retainNoteSendIntent).mockReset();
	vi.mocked(fetchAdminRecipients).mockResolvedValue([
		{ name: "Synthetic Student", emails: ["student@example.invalid"] }
	]);
	vi.mocked(api.get).mockImplementation(async (path: string) => {
		if (path === "/admin-mail/session-notes/identities") {
			return {
				data: {
					students: [
						{
							studentId,
							name: "Synthetic Student",
							recipientName: "Synthetic Student"
						}
					]
				}
			};
		}
		if (path === `/users/${studentId}/session-notes/recent`) {
			return { data: { sessionNotes: [] } };
		}
		throw new Error(`Unexpected GET path: ${path}`);
	});
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
		await wrapper.get("#recipient-select").setValue(studentId);
		await flushPromises();
	}
	await wrapper.get("#subject-date-input").setValue("2026-09-30");
	await wrapper.get("#markdown-input").setValue("Synthetic note body");
}

describe("direct, safely validated session-note sending", () => {
	it("keeps only recipient, date and notes instead of workflow controls", async () => {
		await compose();
		for (const removed of [
			"Message type",
			"Internal message",
			"Compose Message",
			"Student identity",
			"Actual session",
			"Saved note version",
			"Save this draft before sending",
			"Unlinked note;"
		])
			expect(wrapper.text()).not.toContain(removed);
		expect(wrapper.findAll("select")).toHaveLength(1);
		expect(wrapper.find('[role="tablist"]').exists()).toBe(false);
		for (const selector of [
			"#note-student",
			"#note-session",
			"#note-unlinked",
			"#saved-note"
		])
			expect(wrapper.find(selector).exists()).toBe(false);
	});
	it("sends a complete unlinked note from Compose with one click", async () => {
		await compose();
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
	it("never guesses a scheduled session from the selected subject date", async () => {
		await compose();
		await wrapper.get(".send-btn").trigger("click");
		await flushPromises();
		expect(api.post).toHaveBeenLastCalledWith(
			"/admin-mail/send",
			expect.objectContaining({
				studentId,
				scheduledSessionId: undefined,
				unlinked: true
			}),
			{ withCredentials: true }
		);
		expect(api.get).not.toHaveBeenCalledWith(
			`/users/${studentId}/schedule`
		);
		expect(
			JSON.parse(vi.mocked(retainNoteSendIntent).mock.calls[0][0])
		).toMatchObject({ studentId, unlinked: true, selectedSavedNoteId: "" });
	});
	it("requires the single recipient choice without guessing a student from the date", async () => {
		await compose(false);
		await wrapper.get(".send-btn").trigger("click");
		expect(wrapper.get("#send-validation").text()).toContain(
			"Select a recipient"
		);
		expect(document.activeElement?.id).toBe("recipient-select");
		expect(api.post).not.toHaveBeenCalled();
	});
	it("retains an existing draft when its student is selected for the first time", async () => {
		await compose(false);
		await wrapper.get("#recipient-select").setValue(studentId);
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
	it("keeps Preview optional and never sends from its compact toggle", async () => {
		await compose();
		await wrapper.get('[data-testid="preview-toggle"]').trigger("click");
		expect(wrapper.get('[data-testid="live-preview"]').exists()).toBe(true);
		expect(api.post).not.toHaveBeenCalled();
	});
	it("rejects a whitespace-only body with visible feedback", async () => {
		await compose();
		await wrapper.get("#markdown-input").setValue("  \n ");
		await wrapper.get(".send-btn").trigger("click");
		expect(wrapper.get("#send-validation").text()).toContain(
			"Write the note"
		);
		expect(api.post).not.toHaveBeenCalled();
	});
	it("reuses the saved note and send key after a request failure", async () => {
		await compose();
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
		const original = vi.mocked(api.get).getMockImplementation()!;
		let failIdentities = true;
		vi.mocked(api.get).mockImplementation(
			(path: string, ...args: any[]) => {
				if (path.endsWith("/identities") && failIdentities) {
					failIdentities = false;
					return Promise.reject(
						new Error("Synthetic identity load failure")
					);
				}
				return original(path, ...args);
			}
		);
		wrapper = mount(MdMail);
		await flushPromises();
		expect(wrapper.text()).toContain("Unable to load recipients");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Retry recipients")!
			.trigger("click");
		await flushPromises();
		expect(
			wrapper
				.find(`#recipient-select option[value='${studentId}']`)
				.exists()
		).toBe(true);
	});
	it("fails closed when a student's recipient mapping is unavailable", async () => {
		vi.mocked(fetchAdminRecipients).mockResolvedValue([]);
		await compose();
		await wrapper.get(".send-btn").trigger("click");
		expect(wrapper.get("#send-validation").text()).toContain(
			"No saved recipient address"
		);
		expect(api.post).not.toHaveBeenCalled();
	});
	it("does not dispatch when saving the note fails", async () => {
		await compose();
		vi.mocked(api.post).mockRejectedValue(
			new Error("Synthetic draft-save failure")
		);
		await wrapper.get(".send-btn").trigger("click");
		await flushPromises();
		expect(api.post).toHaveBeenCalledTimes(1);
		expect(vi.mocked(api.post).mock.calls[0][0]).toBe(
			`/users/${studentId}/session-notes`
		);
		expect(wrapper.get(".result").text()).toContain(
			"Synthetic draft-save failure"
		);
	});
	it("keeps sibling identity explicit inside the single recipient choice", async () => {
		const siblingId = "d".repeat(24);
		vi.mocked(fetchAdminRecipients).mockResolvedValue([
			{ name: "Synthetic Family", emails: ["family@example.invalid"] }
		]);
		vi.mocked(api.get).mockResolvedValue({
			data: {
				students: [
					{
						studentId,
						name: "First child",
						recipientName: "Synthetic Family"
					},
					{
						studentId: siblingId,
						name: "Second child",
						recipientName: "Synthetic Family"
					}
				],
				sessionNotes: []
			}
		});
		await compose(false);
		await wrapper.get("#recipient-select").setValue(siblingId);
		await wrapper.get(".send-btn").trigger("click");
		await flushPromises();
		expect(api.post).toHaveBeenLastCalledWith(
			"/admin-mail/send",
			expect.objectContaining({
				studentId: siblingId,
				recipientName: "Synthetic Family",
				to: "family@example.invalid",
				unlinked: true
			}),
			{ withCredentials: true }
		);
		expect(
			wrapper
				.findAll("#recipient-select option")
				.map(option => option.text())
		).toEqual(["Select a person", "First child", "Second child"]);
	});
	it("does not dispatch concurrent double clicks twice", async () => {
		await compose();
		let finishSave!: (value: {
			data: { sessionNote: { _id: string } };
		}) => void;
		vi.mocked(api.post).mockImplementation(async path => {
			if (path.endsWith("/session-notes")) {
				return new Promise(resolve => {
					finishSave = resolve;
				});
			}
			return {
				data: {
					ok: true,
					operationId: "synthetic-operation",
					evidenceStatus: "smtp_accepted"
				}
			};
		});
		await wrapper.get(".send-btn").trigger("click");
		await wrapper.get(".send-btn").trigger("click");
		finishSave({ data: { sessionNote: { _id: noteId } } });
		await flushPromises();
		expect(api.post).toHaveBeenCalledTimes(2);
		expect(retainNoteSendIntent).toHaveBeenCalledTimes(1);
	});
});
