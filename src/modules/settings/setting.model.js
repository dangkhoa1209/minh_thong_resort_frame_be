const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// settingSchema.index({ key: 1 }, { unique: true });

const Setting = mongoose.model("Setting", settingSchema);

module.exports = { Setting };
