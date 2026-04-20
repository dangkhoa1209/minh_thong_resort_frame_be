const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AdminUser } = require("./auth.model");

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
      role: user.role,
      is_active: user.is_active,
    },
  };
}

module.exports = { login };
