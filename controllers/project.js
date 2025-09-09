import mongoose from "mongoose";
import Project from "../models/projects.js";
import { sendRes } from "../utils/utils.js";

// ===================== CREATE =====================
export const createProject = async (req, res) => {
  try {
    const { name, description, clients, services, tags, image } = req.body;

    if (!name || !description || !clients || !services || !image) {
      return sendRes(
        "Name, description, clients, services, and image are required",
        "",
        400,
        false,
        res
      );
    }

    const user = req?.user;
    if (!user) return sendRes("User not found", "", 404, false, res);

    const project = await Project.create({
      name,
      description,
      clients,
      services,
      tags: tags || [],
      image,
      author: new mongoose.Types.ObjectId(user._id), // optional ownership
    });

    return sendRes("Project created successfully", project, 201, true, res);
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};

// ===================== GET ALL =====================
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return sendRes("Projects fetched successfully", projects, 200, true, res);
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};

// ===================== GET BY ID =====================
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendRes("Invalid project ID", "", 400, false, res);
    }

    const project = await Project.findById(id);
    if (!project) return sendRes("Project not found", "", 404, false, res);

    return sendRes("Project fetched successfully", project, 200, true, res);
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};

// ===================== UPDATE =====================
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, clients, services, tags, image } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendRes("Invalid project ID", "", 400, false, res);
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { name, description, clients, services, tags, image },
      { new: true, runValidators: true }
    );

    if (!project) return sendRes("Project not found", "", 404, false, res);

    return sendRes("Project updated successfully", project, 200, true, res);
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};

// ===================== DELETE =====================
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendRes("Invalid project ID", "", 400, false, res);
    }

    const project = await Project.findByIdAndDelete(id);
    if (!project) return sendRes("Project not found", "", 404, false, res);

    return sendRes("Project deleted successfully", project, 200, true, res);
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};
