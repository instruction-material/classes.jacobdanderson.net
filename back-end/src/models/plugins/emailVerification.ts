import type { Schema } from "mongoose";

export function emailVerificationPlugin(schema: Schema) {
	schema.add({
		emailChange: { type: Object, select: false, default: undefined }
	});
}
