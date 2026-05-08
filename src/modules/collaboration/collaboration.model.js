const mongoose = require("mongoose");

const collaborationSchema = new mongoose.Schema(
  {
    scope: { type: String, required: true, unique: true, trim: true, default: "default" },
    images: { type: [String], default: [] },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Collaboration = mongoose.model("Collaboration", collaborationSchema);

module.exports = { Collaboration };
