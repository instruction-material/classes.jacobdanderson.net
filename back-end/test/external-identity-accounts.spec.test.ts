import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	adminFindById: vi.fn(),
	adminFindOne: vi.fn(),
	externalCreate: vi.fn(),
	externalDeleteOne: vi.fn(),
	externalFindOne: vi.fn(),
	externalUpdateOne: vi.fn(),
	tutorFindById: vi.fn(),
	tutorFindOne: vi.fn(),
	userFindById: vi.fn(),
	userFindOne: vi.fn()
}));

vi.mock("../src/models/schemas/Admin.js", () => ({
	Admin: {
		findById: modelMocks.adminFindById,
		findOne: modelMocks.adminFindOne
	}
}));

vi.mock("../src/models/schemas/Tutor.js", () => ({
	Tutor: {
		findById: modelMocks.tutorFindById,
		findOne: modelMocks.tutorFindOne
	}
}));

vi.mock("../src/models/schemas/User.js", () => ({
	User: {
		findById: modelMocks.userFindById,
		findOne: modelMocks.userFindOne
	}
}));

vi.mock("../src/models/schemas/ExternalIdentity.js", () => ({
	ExternalIdentity: {
		create: modelMocks.externalCreate,
		deleteOne: modelMocks.externalDeleteOne,
		findOne: modelMocks.externalFindOne,
		updateOne: modelMocks.externalUpdateOne
	}
}));

const {
	ExternalIdentityAccountError,
	externalIdentitySubjectHash,
	resolveExternalIdentityAccount
} = await import("../src/utils/externalIdentityAccounts.js");

function queryWith<T>(result: T) {
	return {
		exec: vi.fn().mockResolvedValue(result)
	};
}

function makeEntity(role: "admin" | "tutor" | "user") {
	return {
		_id: new Types.ObjectId(),
		email: "shared@example.com",
		role
	};
}

describe("external identity account linking", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		modelMocks.adminFindById.mockReturnValue(queryWith(null));
		modelMocks.adminFindOne.mockReturnValue(queryWith(null));
		modelMocks.tutorFindById.mockReturnValue(queryWith(null));
		modelMocks.tutorFindOne.mockReturnValue(queryWith(null));
		modelMocks.userFindById.mockReturnValue(queryWith(null));
		modelMocks.userFindOne.mockReturnValue(queryWith(null));
		modelMocks.externalFindOne.mockReturnValue(queryWith(null));
		modelMocks.externalCreate.mockResolvedValue({});
		modelMocks.externalDeleteOne.mockReturnValue(queryWith({ deletedCount: 1 }));
		modelMocks.externalUpdateOne.mockReturnValue(queryWith({ modifiedCount: 1 }));
	});

	it("rejects an ambiguous verified email instead of selecting a privileged role", async () => {
		const admin = makeEntity("admin");
		const tutor = makeEntity("tutor");
		const user = makeEntity("user");
		modelMocks.adminFindOne.mockReturnValue(queryWith(admin));
		modelMocks.tutorFindOne.mockReturnValue(queryWith(tutor));
		modelMocks.userFindOne.mockReturnValue(queryWith(user));

		await expect(resolveExternalIdentityAccount({
			email: "shared@example.com",
			provider: "google",
			subject: "google-subject"
		})).rejects.toEqual(
			expect.objectContaining<
				Partial<InstanceType<typeof ExternalIdentityAccountError>>
			>({ code: "identity_conflict" })
		);

		expect(modelMocks.externalCreate).not.toHaveBeenCalled();
	});

	it("links one matching account without retaining provider PII", async () => {
		const tutor = makeEntity("tutor");
		modelMocks.tutorFindOne.mockReturnValue(queryWith(tutor));

		const candidate = await resolveExternalIdentityAccount({
			email: "shared@example.com",
			provider: "google",
			subject: "google-subject"
		});

		expect(candidate.role).toBe("tutor");
		expect(candidate.entity).toBe(tutor);
		expect(modelMocks.externalCreate).toHaveBeenCalledWith({
			accountID: tutor._id,
			accountRole: "tutor",
			lastLoginAt: expect.any(Date),
			provider: "google",
			subject: externalIdentitySubjectHash("google", "google-subject")
		});
		expect(modelMocks.externalCreate.mock.calls[0]?.[0])
			.not.toHaveProperty("emailAtLink");
		expect(modelMocks.externalCreate.mock.calls[0]?.[0].subject)
			.not.toBe("google-subject");
	});

	it("uses the stable provider subject after linking even if the provider email changes", async () => {
		const tutor = makeEntity("tutor");
		const identity = {
			_id: new Types.ObjectId(),
			accountID: tutor._id,
			accountRole: "tutor"
		};
		modelMocks.externalFindOne.mockReturnValue(queryWith(identity));
		modelMocks.tutorFindById.mockReturnValue(queryWith(tutor));

		const candidate = await resolveExternalIdentityAccount({
			email: "new-address@example.com",
			provider: "apple",
			subject: "stable-apple-subject"
		});

		expect(candidate.role).toBe("tutor");
		expect(candidate.entity).toBe(tutor);
		expect(modelMocks.adminFindOne).not.toHaveBeenCalled();
		expect(modelMocks.tutorFindOne).not.toHaveBeenCalled();
		expect(modelMocks.userFindOne).not.toHaveBeenCalled();
		expect(modelMocks.externalCreate).not.toHaveBeenCalled();
		expect(modelMocks.externalUpdateOne).toHaveBeenCalledWith(
			{ _id: identity._id },
			{
				$set: {
					lastLoginAt: expect.any(Date)
				},
				$unset: { emailAtLink: 1 }
			}
		);
	});

	it("can use an existing stable subject if Apple omits email on a later login", async () => {
		const tutor = makeEntity("tutor");
		const identity = {
			_id: new Types.ObjectId(),
			accountID: tutor._id,
			accountRole: "tutor"
		};
		modelMocks.externalFindOne.mockReturnValue(queryWith(identity));
		modelMocks.tutorFindById.mockReturnValue(queryWith(tutor));

		const candidate = await resolveExternalIdentityAccount({
			email: null,
			provider: "apple",
			subject: "stable-apple-subject"
		});

		expect(candidate.role).toBe("tutor");
		expect(modelMocks.externalUpdateOne).toHaveBeenCalledWith(
			{ _id: identity._id },
			{
				$set: { lastLoginAt: expect.any(Date) },
				$unset: { emailAtLink: 1 }
			}
		);
	});

	it("migrates a legacy raw provider subject to its hash on login", async () => {
		const tutor = makeEntity("tutor");
		const identity = {
			_id: new Types.ObjectId(),
			accountID: tutor._id,
			accountRole: "tutor"
		};
		modelMocks.externalFindOne
			.mockReturnValueOnce(queryWith(null))
			.mockReturnValueOnce(queryWith(identity));
		modelMocks.tutorFindById.mockReturnValue(queryWith(tutor));

		await resolveExternalIdentityAccount({
			email: null,
			provider: "apple",
			subject: "legacy-raw-apple-subject"
		});

		expect(modelMocks.externalFindOne).toHaveBeenNthCalledWith(1, {
			provider: "apple",
			subject: externalIdentitySubjectHash(
				"apple",
				"legacy-raw-apple-subject"
			)
		});
		expect(modelMocks.externalFindOne).toHaveBeenNthCalledWith(2, {
			provider: "apple",
			subject: "legacy-raw-apple-subject"
		});
		expect(modelMocks.externalUpdateOne).toHaveBeenCalledWith(
			{ _id: identity._id },
			{
				$set: {
					lastLoginAt: expect.any(Date),
					subject: externalIdentitySubjectHash(
						"apple",
						"legacy-raw-apple-subject"
					)
				},
				$unset: { emailAtLink: 1 }
			}
		);
	});

	it("does not create an incomplete account when no existing email matches", async () => {
		await expect(resolveExternalIdentityAccount({
			email: "unknown@example.com",
			provider: "google",
			subject: "unknown-subject"
		})).rejects.toEqual(
			expect.objectContaining<Partial<InstanceType<typeof ExternalIdentityAccountError>>>({
				code: "account_not_found"
			})
		);
		expect(modelMocks.externalCreate).not.toHaveBeenCalled();
	});
});
