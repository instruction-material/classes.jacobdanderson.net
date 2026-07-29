import type { Types } from "mongoose";

export const externalIdentityProviders = ["apple", "google"] as const;
export type ExternalIdentityProvider
	= (typeof externalIdentityProviders)[number];
export type ExternalIdentityAccountRole = "admin" | "tutor" | "user";

export interface IExternalIdentity {
	_id: Types.ObjectId;
	accountID: Types.ObjectId;
	accountRole: ExternalIdentityAccountRole;
	emailAtLink?: string;
	lastLoginAt: Date;
	provider: ExternalIdentityProvider;
	subject: string;
	createdAt: Date;
	updatedAt: Date;
}
