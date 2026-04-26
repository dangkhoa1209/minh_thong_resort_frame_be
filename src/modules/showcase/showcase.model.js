const mongoose = require("mongoose");

const showcaseItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["home_highlight", "hero_slide"],
      required: true,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    display_image: {
      type: String,
      trim: true,
      default: "",
    },
    sort_order: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

showcaseItemSchema.index({ type: 1, sort_order: 1, updated_at: -1 });
showcaseItemSchema.index({ type: 1, project_id: 1 }, { unique: true });

const ShowcaseItem = mongoose.model("ShowcaseItem", showcaseItemSchema);

module.exports = { ShowcaseItem };
