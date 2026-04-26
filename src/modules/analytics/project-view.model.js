const mongoose = require("mongoose");

const projectViewSchema = new mongoose.Schema(
  {
    project_slug: { type: String, required: true, trim: true },
    path: { type: String, default: "" },
    user_agent: { type: String, default: "" },
    ip: { type: String, default: "" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

projectViewSchema.index({ project_slug: 1, created_at: -1 });
projectViewSchema.index({ created_at: -1 });

const ProjectView = mongoose.model("ProjectView", projectViewSchema);

module.exports = { ProjectView };
