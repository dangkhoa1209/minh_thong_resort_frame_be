const mongoose = require("mongoose");

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
    description: { type: String, trim: true, default: "" },
    source: {
      type: String,
      enum: ["contact_page", "footer", "unknown"],
      default: "unknown",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
    mail_sent: { type: Boolean, default: false },
    mail_error: { type: String, default: "" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

contactSubmissionSchema.index({ status: 1, created_at: -1 });
contactSubmissionSchema.index({ email: 1 });
contactSubmissionSchema.index({ source: 1, created_at: -1 });

const ContactSubmission = mongoose.model("ContactSubmission", contactSubmissionSchema);

module.exports = { ContactSubmission };
