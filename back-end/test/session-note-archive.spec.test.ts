import { describe, expect, it, vi } from "vitest";
import {
	confirmedArchiveAppend,
	archiveDestination,
	NoteArchiveError
} from "../src/utils/sessionNoteArchive.js";

function actions() {
	return {
		destination: () => "Synthetic Sent",
		connect: vi.fn().mockResolvedValue(undefined),
		append: vi
			.fn()
			.mockResolvedValue({
				destination: "Synthetic Sent",
				uid: 42,
				uidValidity: 1n
			}),
		logout: vi.fn().mockResolvedValue(undefined)
	};
}

describe("safe archival outcome classification without mailbox access", () => {
	it("confirms destination and optional UID information without a selected mailbox path", async () => {
		const calls = actions();
		await expect(confirmedArchiveAppend(calls)).resolves.toBeUndefined();
		expect(calls.append).toHaveBeenCalledTimes(1);
	});
	it("does not confuse a selected mailbox path with the APPEND destination", async () => {
		const calls = actions();
		calls.append.mockResolvedValue({
			destination: "Synthetic Sent",
			path: "INBOX"
		} as any);
		await expect(confirmedArchiveAppend(calls)).resolves.toBeUndefined();
		calls.append.mockResolvedValue({
			destination: "Other",
			path: "Synthetic Sent"
		} as any);
		await expect(confirmedArchiveAppend(calls)).rejects.toMatchObject({
			outcome: "unconfirmed"
		});
	});
	it("normalizes only server namespace prefixes and case-insensitive INBOX", () => {
		expect(archiveDestination("Sent", "INBOX.")).toBe("INBOX.Sent");
		expect(archiveDestination("INBOX.Sent", "INBOX.")).toBe("INBOX.Sent");
		expect(archiveDestination("inbox", "INBOX.")).toBe("INBOX");
	});
	it("retains confirmed APPEND even if logout fails", async () => {
		const calls = actions();
		calls.logout.mockRejectedValue(new Error("Synthetic logout failure"));
		await expect(confirmedArchiveAppend(calls)).resolves.toBeUndefined();
		expect(calls.append).toHaveBeenCalledTimes(1);
	});
	it("proves a connection failure happened before APPEND", async () => {
		const calls = actions();
		calls.connect.mockRejectedValue(new Error("Private connection data"));
		await expect(confirmedArchiveAppend(calls)).rejects.toMatchObject({
			outcome: "not_appended",
			message: "archive_nonacceptance"
		});
		expect(calls.append).not.toHaveBeenCalled();
		expect(calls.logout).toHaveBeenCalledTimes(1);
	});
	it.each(["NO", "BAD"])(
		"accepts only a concrete tagged %s response as nonacceptance",
		async status => {
			const calls = actions();
			calls.append.mockRejectedValue(
				Object.assign(new Error("Private mailbox error"), {
					responseStatus: status
				})
			);
			await expect(confirmedArchiveAppend(calls)).rejects.toMatchObject({
				outcome: "not_appended"
			});
		}
	);
	it("does not claim success when IMAP returns false", async () => {
		const calls = actions();
		calls.append.mockResolvedValue(false);
		await expect(confirmedArchiveAppend(calls)).rejects.toMatchObject({
			outcome: "not_appended"
		});
	});
	it.each([undefined, null, true, {}, [], { path: "" }])(
		"keeps a missing or malformed APPEND acknowledgment unconfirmed",
		async result => {
			const calls = actions();
			calls.append.mockResolvedValue(result);
			await expect(confirmedArchiveAppend(calls)).rejects.toMatchObject({
				outcome: "unconfirmed"
			});
		}
	);
	it("does not classify a timeout after APPEND as safe to retry", async () => {
		const calls = actions();
		calls.append.mockRejectedValue(
			Object.assign(new Error("Private transport data"), {
				code: "ETIMEOUT"
			})
		);
		const error = await confirmedArchiveAppend(calls).catch(error => error);
		expect(error).toBeInstanceOf(NoteArchiveError);
		expect(error).toMatchObject({
			outcome: "unconfirmed",
			message: "archive_outcome_ambiguous"
		});
		expect(calls.append).toHaveBeenCalledTimes(1);
	});
});
