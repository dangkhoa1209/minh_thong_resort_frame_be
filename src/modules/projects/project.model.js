const mongoose = require("mongoose");

const imageItemSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    crop_ratio: { type: String, default: "" },
    crop_mode: { type: String, enum: ["preset", "custom", "free", ""], default: "" },
  },
  { _id: false }
);

const imageRowSchema = new mongoose.Schema(
  {
    layout: { type: Number, enum: [1, 2], required: true },
    ratio: { type: String, default: "4:3" },
    images: { type: [imageItemSchema], default: [] },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    short_description: { type: String, default: "", trim: true },
    content: { type: String, default: "" },
    banner_image: { type: String, default: "" },
    banner_title: { type: String, default: "", trim: true },
    banner_subtitle: { type: String, default: "", trim: true },
    image_1: { type: String, required: true },
    image_rows: { type: [imageRowSchema], default: [] },
    is_home_visible: { type: Boolean, default: false },
    is_slide_visible: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// projectSchema.index({ slug: 1 }, { unique: true });
projectSchema.index({ is_home_visible: 1, updated_at: -1 });
projectSchema.index({ is_slide_visible: 1, updated_at: -1 });

const Project = mongoose.model("Project", projectSchema);

module.exports = { Project };
