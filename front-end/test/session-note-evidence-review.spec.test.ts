import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import SessionNoteEvidenceReview from "@/components/SessionNoteEvidenceReview.vue";

const mocks = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), key: vi.fn() }));
vi.mock("@/api", () => ({ api: { get: mocks.get, post: mocks.post } }));
vi.mock("@/modules/sessionNoteSendIntent", () => ({
	retainEvidenceActionKey: mocks.key
}));
const operationId = "b1b73ebc-95bb-4112-ac27-e3ef9b939f2a";

beforeEach(() => {
	vi.clearAllMocks();
	mocks.key.mockResolvedValue("stable-archive-review-key");
	mocks.post.mockResolvedValue({ data: {} });
	mocks.get.mockResolvedValue({
		data: {
			operations: [
				{
					operationId,
					noteId: "synthetic-note",
					evidenceStatus: "smtp_accepted",
					statusReason: "smtp_accepted",
					archivalStatus: "review_required"
				}
			],
			unlinkedNotes: [],
			externalEvidence: [],
			writerMarkers: []
		}
	});
});

describe("administrator archival review", () => {
	it("shows archival uncertainty separately from SMTP acceptance", async () => {
		const wrapper = mount(SessionNoteEvidenceReview);
		await wrapper.find("button").trigger("click");
		await flushPromises();
		expect(wrapper.text()).toContain("smtp_accepted");
		expect(wrapper.text()).toContain("archive review_required");
		expect(wrapper.text()).toContain("Pause sending and recovery");
		wrapper.unmount();
	});
	it("shows the operator gate for paused queued work without sending", async () => {
		mocks.get.mockResolvedValue({
			data: {
				sendingPaused: true,
				operations: [
					{
						operationId,
						noteId: "synthetic-note",
						evidenceStatus: "queued",
						statusReason: "queued",
						archivalStatus: "not_applicable"
					}
				],
				unlinkedNotes: [],
				externalEvidence: [],
				writerMarkers: []
			}
		});
		const wrapper = mount(SessionNoteEvidenceReview);
		await wrapper.find("button").trigger("click");
		await flushPromises();
		expect(wrapper.text()).toContain(
			"Queued operations require operator activation"
		);
		expect(wrapper.text()).toContain("queued");
		expect(mocks.post).not.toHaveBeenCalled();
		wrapper.unmount();
	});
	it("records protected archival evidence without sending mail", async () => {
		const wrapper = mount(SessionNoteEvidenceReview);
		const form = wrapper.find("form");
		const fields = form.findAll("input");
		await fields[0].setValue(operationId);
		await fields[1].setValue("a".repeat(64));
		await form.find("select").setValue("archive_confirmed_present");
		await form.trigger("submit");
		await flushPromises();
		expect(mocks.post).toHaveBeenCalledExactlyOnceWith(
			"/admin-mail/session-notes/operations/" +
				operationId +
				"/disposition",
			{
				decision: "archive_confirmed_present",
				evidenceRef: "a".repeat(64),
				idempotencyKey: "stable-archive-review-key"
			}
		);
		expect(wrapper.text()).toContain(
			"SMTP evidence is unchanged; no email was sent."
		);
		wrapper.unmount();
	});
});
