const { ContactSubmission } = require("./contact-submission.model");

function normalizeSource(source) {
  if (source === "contact_page" || source === "footer") {
    return source;
  }
  return "unknown";
}

async function createContactSubmission(payload) {
  const created = await ContactSubmission.create({
    name: payload.name || "",
    email: payload.email || "",
    description: payload.description || "",
    source: normalizeSource(payload.source),
  });

  return created;
}

async function markContactSubmissionMailResult(id, result) {
  await ContactSubmission.findByIdAndUpdate(id, {
    mail_sent: Boolean(result.success),
    mail_error: result.success ? "" : String(result.error || ""),
  });
}

async function listContactSubmissions(query) {
  const { page, limit, search, status } = query;
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    ContactSubmission.find(filter)
      .select("name email description source status mail_sent mail_error created_at updated_at")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ContactSubmission.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => ({ id: item._id.toString(), ...item })),
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

async function updateContactSubmissionStatus(id, status) {
  const updated = await ContactSubmission.findByIdAndUpdate(
    id,
    { status },
    { returnDocument: "after" }
  ).lean();

  if (!updated) {
    return null;
  }

  return { id: updated._id.toString(), status: updated.status };
}

async function getContactSubmissionStats() {
  const [total, newCount, contactedCount, closedCount, recentItems] = await Promise.all([
    ContactSubmission.countDocuments({}),
    ContactSubmission.countDocuments({ status: "new" }),
    ContactSubmission.countDocuments({ status: "contacted" }),
    ContactSubmission.countDocuments({ status: "closed" }),
    ContactSubmission.find({})
      .select("name email description source status created_at")
      .sort({ created_at: -1 })
      .limit(5)
      .lean(),
  ]);

  return {
    total,
    new: newCount,
    contacted: contactedCount,
    closed: closedCount,
    recent_items: recentItems.map((item) => ({ id: item._id.toString(), ...item })),
  };
}

module.exports = {
  createContactSubmission,
  markContactSubmissionMailResult,
  listContactSubmissions,
  updateContactSubmissionStatus,
  getContactSubmissionStats,
};
