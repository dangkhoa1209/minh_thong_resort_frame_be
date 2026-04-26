const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

function requireAuth(req, res, next) {
  if (!jwtSecret) {
    return res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "JWT_SECRET is not configured" },
    });
  }

  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Missing bearer token" },
    });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Invalid token" },
    });
  }
}

function normalizeRole(role) {
  const value = String(role || "").trim().toLowerCase();
  if (value === "admin") return "owner";
  return value;
}

function requireRoles(allowedRoles = []) {
  const normalizedAllowedRoles = new Set(
    (Array.isArray(allowedRoles) ? allowedRoles : [])
      .map((role) => normalizeRole(role))
      .filter(Boolean)
  );

  return (req, res, next) => {
    const role = normalizeRole(req?.user?.role);
    if (!role || !normalizedAllowedRoles.has(role)) {
      return res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN", message: "You do not have permission to perform this action" },
      });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRoles, normalizeRole };
