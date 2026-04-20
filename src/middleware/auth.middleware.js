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

module.exports = { requireAuth };
