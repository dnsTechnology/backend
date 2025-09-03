import mongoose from "mongoose";
import TeamMember from "../models/teamMember.js";
import { sendRes } from "../utils/utils.js";

// helpers
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// CREATE
export const createTeamMember = async (req, res) => {
  try {
    const user = req?.user;
    if (!user) return sendRes("User not found", "", 404, false, res);

    const {
      name,
      email,
      role,
      qualification,
      linkedin,
      portfolio,
      intro,
      status,
      image,
    } = req.body;
    console.log(req.body);

    if (!name || !email || !role) {
      return sendRes("Name, email, and role are required", "", 400, false, res);
    }

    const existing = await TeamMember.findOne({ email: email.toLowerCase() });
    if (existing) return sendRes("Email already exists", "", 409, false, res);

    const member = await TeamMember.create({
      name,
      email,
      role,
      qualification,
      linkedin,
      portfolio,
      intro,
      status: status || "active",
      image,
      author: new mongoose.Types.ObjectId(user._id),
    });

    return sendRes("Team member created successfully", member, 201, true, res);
  } catch (err) {
    console.error(err);
    return sendRes(err.message, "", 500, false, res);
  }
};

// READ ALL (with pagination, search, status filter)
export const getTeamMembers = async (req, res) => {
  try {
    const allteam = await TeamMember.find().sort({
      createdAt: -1,
    });

    return sendRes("Team members fetched", allteam, 200, true, res);
  } catch (err) {
    console.error(err);
    return sendRes(err.message, "", 500, false, res);
  }
};

// READ ONE
export const getTeamMemberById = async (req, res) => {
  try {
    const user = req?.user;
    if (!user) return sendRes("User not found", "", 404, false, res);

    const { id } = req.params;
    if (!isValidObjectId(id))
      return sendRes("Invalid member ID", "", 400, false, res);

    const member = await TeamMember.findById(id).lean();
    if (!member) return sendRes("Team member not found", "", 404, false, res);

    return sendRes("Team member fetched", member, 200, true, res);
  } catch (err) {
    console.error(err);
    return sendRes(err.message, "", 500, false, res);
  }
};

// UPDATE
export const updateTeamMember = async (req, res) => {
  try {
    const user = req?.user;
    if (!user) return sendRes("User not found", "", 404, false, res);
    if (user.role !== "admin")
      return sendRes("Admin access required", "", 403, false, res);

    const { id } = req.params;
    if (!isValidObjectId(id))
      return sendRes("Invalid member ID", "", 400, false, res);

    const payload = { ...req.body };
    if (payload.email) {
      const exists = await TeamMember.findOne({
        email: payload.email.toLowerCase(),
        _id: { $ne: id },
      });
      if (exists)
        return sendRes(
          "Email already used by another member",
          "",
          409,
          false,
          res
        );
    }

    if (payload.status && !["active", "inactive"].includes(payload.status)) {
      return sendRes("Invalid status value", "", 400, false, res);
    }

    const updated = await TeamMember.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true, runValidators: true }
    );
    if (!updated) return sendRes("Team member not found", "", 404, false, res);

    return sendRes("Team member updated successfully", updated, 200, true, res);
  } catch (err) {
    console.error(err);
    return sendRes(err.message, "", 500, false, res);
  }
};

// DELETE
export const deleteTeamMember = async (req, res) => {
  try {
    const user = req?.user;
    if (!user) return sendRes("User not found", "", 404, false, res);
    if (user.role !== "admin")
      return sendRes("Admin access required", "", 403, false, res);

    const { id } = req.params;
    if (!isValidObjectId(id))
      return sendRes("Invalid member ID", "", 400, false, res);

    const deleted = await TeamMember.findByIdAndDelete(id);
    if (!deleted) return sendRes("Team member not found", "", 404, false, res);

    return sendRes("Team member deleted successfully", deleted, 200, true, res);
  } catch (err) {
    console.error(err);
    return sendRes(err.message, "", 500, false, res);
  }
};

// OPTIONAL: Toggle status quickly
export const toggleTeamMemberStatus = async (req, res) => {
  try {
    const user = req?.user;
    if (!user) return sendRes("User not found", "", 404, false, res);
    if (user.role !== "admin")
      return sendRes("Admin access required", "", 403, false, res);

    const { id } = req.params;
    if (!isValidObjectId(id))
      return sendRes("Invalid member ID", "", 400, false, res);

    const member = await TeamMember.findById(id);
    if (!member) return sendRes("Team member not found", "", 404, false, res);

    member.status = member.status === "active" ? "inactive" : "active";
    await member.save();

    return sendRes("Status toggled", member, 200, true, res);
  } catch (err) {
    console.error(err);
    return sendRes(err.message, "", 500, false, res);
  }
};
