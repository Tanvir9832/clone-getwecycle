import { IVerificationSession } from "@tanbel/homezz/types";
import { Schema, model } from "mongoose";

const verificationSessionSchema = new Schema<IVerificationSession>(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		token: {
			type: String,
			required: true,
		},
		expireDate: {
			type: Date,
			required: true,
		},
	}
);

export const VerificationSession = model("VerificationSession", verificationSessionSchema);

export default VerificationSession;
