const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AdminUser } = require("./auth.model");
const { normalizeRole } = require("../../middleware/auth.middleware");

function normalizeUserRoleForResponse(role) {
  const normalized = normalizeRole(role);
  return normalized === "owner" || normalized === "editor" ? normalized : "editor";
}

function toAdminUserDto(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    role: normalizeUserRoleForResponse(user.role),
    is_active: Boolean(user.is_active),
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

async function login(email, password) {
  const user = await AdminUser.findOne({ email: email.toLowerCase() }).lean();
  if (!user || !user.is_active) {
    return null;
  }

  const matched = await bcrypt.compare(password, user.password_hash);
  if (!matched) {
    return null;
  }

  const accessToken = jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  return {
    accessToken,
    user: {
      id: user._id.toString(),
      email: user.email,
      role: normalizeUserRoleForResponse(user.role),
      is_active: user.is_active,
    },
  };
}

async function changePassword(userId, currentPassword, nextPassword) {
  const user = await AdminUser.findById(userId).lean();
  if (!user || !user.is_active) return { ok: false, reason: "NOT_FOUND" };

  const matched = await bcrypt.compare(currentPassword, user.password_hash);
  if (!matched) return { ok: false, reason: "INVALID_CURRENT_PASSWORD" };

  const passwordHash = await bcrypt.hash(nextPassword, 10);
  await AdminUser.updateOne(
    { _id: userId },
    { $set: { password_hash: passwordHash } }
  );
  return { ok: true };
}

async function listAdminUsers({ page, limit, search }) {
  const filter = {};
  if (search) {
    filter.email = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    AdminUser.find(filter)
      .select("email role is_active created_at updated_at")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    AdminUser.countDocuments(filter),
  ]);

  return {
    items: items.map(toAdminUserDto),
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

async function createAdminUser(payload) {
  const normalizedEmail = String(payload.email || "").trim().toLowerCase();
  const existing = await AdminUser.findOne({ email: normalizedEmail }).lean();
  if (existing) {
    return { ok: false, reason: "EMAIL_EXISTS" };
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const created = await AdminUser.create({
    email: normalizedEmail,
    password_hash: passwordHash,
    role: payload.role || "editor",
    is_active: payload.is_active !== false,
  });

  return { ok: true, user: toAdminUserDto(created) };
}

async function updateAdminUser(userId, payload, actorUserId) {
  const current = await AdminUser.findById(userId).lean();
  if (!current) return { ok: false, reason: "NOT_FOUND" };

  const update = {};
  if (payload.role) update.role = payload.role;
  if (typeof payload.is_active === "boolean") update.is_active = payload.is_active;
  if (payload.password) {
    update.password_hash = await bcrypt.hash(payload.password, 10);
  }

  const currentRole = normalizeUserRoleForResponse(current.role);
  if (currentRole === "owner" && payload.is_active === false) {
    const ownerCount = await AdminUser.countDocuments({
      _id: { $ne: current._id },
      role: { $in: ["owner", "admin"] },
      is_active: true,
    });
    if (ownerCount === 0) {
      return { ok: false, reason: "LAST_OWNER" };
    }
  }

  if (currentRole === "owner" && payload.role === "editor") {
    const ownerCount = await AdminUser.countDocuments({
      _id: { $ne: current._id },
      role: { $in: ["owner", "admin"] },
      is_active: true,
    });
    if (ownerCount === 0) {
      return { ok: false, reason: "LAST_OWNER" };
    }
  }

  if (String(actorUserId || "") === String(userId) && payload.is_active === false) {
    return { ok: false, reason: "SELF_DEACTIVATE" };
  }

  if (String(actorUserId || "") === String(userId) && payload.role === "editor") {
    return { ok: false, reason: "SELF_DOWNGRADE" };
  }

  const updated = await AdminUser.findByIdAndUpdate(
    userId,
    { $set: update },
    { returnDocument: "after" }
  )
    .select("email role is_active created_at updated_at")
    .lean();

  return { ok: true, user: toAdminUserDto(updated) };
}

module.exports = {
  login,
  changePassword,
  listAdminUsers,
  createAdminUser,
  updateAdminUser,
};
