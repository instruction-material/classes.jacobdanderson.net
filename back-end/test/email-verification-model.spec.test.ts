import { describe, expect, it } from "vitest";
import { Admin } from "../src/models/schemas/Admin.js";
import { Tutor } from "../src/models/schemas/Tutor.js";
import { User } from "../src/models/schemas/User.js";
import { serializeAccountEntity } from "../src/utils/accountSessions.js";

describe("private pending email-verification metadata", () => {
	it.each([Admin, Tutor, User])("never serializes pending verification for $modelName", Model => {
		const document = new (Model as any)({
			name: "Synthetic account", email: "old@example.invalid", password: "synthetic-hash",
			emailChange: { email: "new@example.invalid", tokenHash: "private-synthetic-hash", expiresAt: new Date() }
		});
		expect(Model.schema.path("emailChange").options.select).toBe(false);
		const output = serializeAccountEntity(document);
		expect(output.email).toBe("old@example.invalid");
		expect(output).not.toHaveProperty("emailChange");
		expect(output).not.toHaveProperty("password");
		expect(JSON.stringify(output)).not.toContain("private-synthetic");
	});
});
