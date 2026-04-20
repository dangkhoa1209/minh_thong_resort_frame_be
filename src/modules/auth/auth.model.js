const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    role: { type: String, default: "admin" },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

adminUserSchema.index({ email: 1 }, { unique: true });

const AdminUser = mongoose.model("AdminUser", adminUserSchema);

module.exports = { AdminUser };
