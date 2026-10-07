export class NoteArchiveError extends Error {
	constructor(readonly outcome: "not_appended" | "unconfirmed") {
		super(
			outcome === "not_appended"
				? "archive_nonacceptance"
				: "archive_outcome_ambiguous"
		);
	}
}

export function archiveDestination(mailbox: string, namespacePrefix = "") {
	if (mailbox.toUpperCase() === "INBOX") return "INBOX";
	return mailbox.startsWith(namespacePrefix)
		? mailbox
		: namespacePrefix + mailbox;
}

export async function confirmedArchiveAppend(actions: {
	destination: () => string;
	connect: () => Promise<unknown>;
	append: () => Promise<unknown>;
	logout: () => Promise<unknown>;
}) {
	let appendStarted = false;
	try {
		await actions.connect();
		appendStarted = true;
		const result = await actions.append();
		if (result === false) throw new NoteArchiveError("not_appended");
		const intended = actions.destination();
		const destination = (result as { destination?: unknown } | null)
			?.destination;
		if (
			!result
			|| typeof result !== "object"
			|| Array.isArray(result)
			|| typeof destination !== "string"
			|| !destination.length
			|| !intended
			|| archiveDestination(destination) !== archiveDestination(intended)
		) {
			throw new NoteArchiveError("unconfirmed");
		}
	}
	catch (error) {
		if (error instanceof NoteArchiveError) throw error;
		const status = (error as { responseStatus?: unknown } | null)
			?.responseStatus;
		// Only a pre-APPEND failure or a tagged negative response proves no append.
		throw new NoteArchiveError(
			!appendStarted || status === "NO" || status === "BAD"
				? "not_appended"
				: "unconfirmed"
		);
	}
	finally {
		try {
			await actions.logout();
		}
		catch {}
	}
}
