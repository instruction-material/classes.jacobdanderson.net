import { Types } from "mongoose";
import { describe, expect, it } from "vitest";
import { ExternalIdentity } from "../src/models/schemas/ExternalIdentity.js";
import { externalIdentitySubjectHash } from "../src/utils/externalIdentityAccounts.js";

describe("external identity persistence privacy", () => {
	it("keeps identity keys out of default selections and no longer requires provider email", () => {
		expect(ExternalIdentity.schema.path("subject").options.select).toBe(false);
		expect(ExternalIdentity.schema.path("emailAtLink").options.select).toBe(false);
		expect(ExternalIdentity.schema.path("emailAtLink").options.required)
			.not.toBe(true);
	});

	it("validates a new link containing only a hashed provider subject", async () => {
		const subjectHash = externalIdentitySubjectHash(
			"google",
			"opaque-provider-subject"
		);
		const identity = new ExternalIdentity({
			accountID: new Types.ObjectId(),
			accountRole: "user",
			lastLoginAt: new Date(),
			provider: "google",
			subject: subjectHash
		});

		expect(subjectHash).toMatch(/^[a-f\d]{64}$/u);
		expect(subjectHash).not.toContain("opaque-provider-subject");
		await expect(identity.validate()).resolves.toBeUndefined();
	});
});
