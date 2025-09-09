import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  clients: [{ type: String, required: true }],
  tags: [{ type: String }],
  description: { type: String, required: true },
  services: [{ type: String, required: true }],
  image: { type: String, required: true },
});

const Project = mongoose.model("Project", ProjectSchema);

export default Project;
