import { createRequire } from "node:module";
import nodemailer from "nodemailer";
import { describe, expect, it } from "vitest";

const parseAddress = createRequire(import.meta.url)(
	"nodemailer/lib/addressparser"
) as (value: string, options: { flatten: true }) => { address: string }[];

describe("patched mail package compatibility", () => {
	it.each([
		{
			name: "nested comments",
			to: "Learner (outer(inner) <outside@outside.example.test>) <learner@approved.example.test>",
			expected: "learner@approved.example.test"
		},
		{
			name: "semicolons inside group comments",
			to: "Team: (note; <outside@outside.example.test>) <learner@approved.example.test>;",
			expected: "learner@approved.example.test"
		},
		{
			name: "semicolons inside quoted group names",
			to: "Team: \"note;\" \"<outside@outside.example.test>\" <learner@approved.example.test>;",
			expected: "learner@approved.example.test"
		},
		{
			name: "angle brackets inside quoted local parts",
			to: "<\"local@outside.example.test>\"@approved.example.test>",
			expected: "\"local@outside.example.test>\"@approved.example.test",
			envelope: "\"local@outside.example.test \"@approved.example.test"
		}
	])(
		"retains the intended recipient for $name",
		async ({ to, expected, envelope }) => {
			expect(
				parseAddress(to, { flatten: true }).map(value => value.address)
			).toEqual([expected]);
			const transport = nodemailer.createTransport({
				streamTransport: true,
				buffer: true,
				newline: "unix"
			});
			try {
				const result = await transport.sendMail({
					from: "sender@example.test",
					to,
					subject: "Synthetic recipient parser check",
					text: "In-memory composition only"
				});
				expect(result.envelope.to).toEqual([envelope ?? expected]);
			}
			finally {
				transport.close();
			}
		}
	);

	it("composes transactional mail without contacting a provider", async () => {
		const transport = nodemailer.createTransport({
			streamTransport: true,
			buffer: true,
			newline: "unix"
		});
		const result = await transport.sendMail({
			from: "sender@example.test",
			to: "learner@example.test",
			replyTo: "reply@example.test",
			subject: "Synthetic compatibility check",
			text: "Plain message",
			html: "<p>HTML message</p>"
		});
		expect(result.envelope.to).toEqual(["learner@example.test"]);
		expect(result.message.toString()).toContain(
			"Subject: Synthetic compatibility check"
		);
		expect(result.message.toString()).toContain("Plain message");
		expect(result.message.toString()).toContain("HTML message");
		transport.close();
	});
});
