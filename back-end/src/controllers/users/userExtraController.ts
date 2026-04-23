// src/controllers/users/userExtraController.ts
import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { User } from "../../models/schemas/User.js";

function getObjectIdParam(
	value: string | string[] | undefined,
	name: string,
	res: Parameters<RequestHandler>[1]
) {
	const normalizedValue = Array.isArray(value) ? value[0] : value;
	if (typeof normalizedValue !== "string" || !Types.ObjectId.isValid(normalizedValue)) {
		res.status(400).json({ message: `Invalid ${name}` });
		return null;
	}
	return normalizedValue;
}

export const getUsersOfTutor: RequestHandler = async (req, res) => {
	const tutorID = getObjectIdParam(req.params.tutorID, "tutor ID", res);
	if (!tutorID) return;
	const users = await User.find({ tutor: new Types.ObjectId(tutorID) });
	res.json(users);
};

export const assignTutorToUser: RequestHandler = async (req, res) => {
	const userID = getObjectIdParam(req.params.userID, "user ID", res);
	const tutorID = getObjectIdParam(req.params.tutorID, "tutor ID", res);
	if (!userID || !tutorID) return;
	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);
	user.tutor = new Types.ObjectId(tutorID);
	await user.save();
	res.sendStatus(200);
};

export const deleteUsersUnderTutor: RequestHandler = async (req, res) => {
	const tutorID = getObjectIdParam(req.params.tutorID, "tutor ID", res);
	if (!tutorID) return;
	await User.deleteMany({ tutor: new Types.ObjectId(tutorID) });
	res.sendStatus(200);
};
