const required = ["MONGO_URI", "JWT_SECRET"];

function getEnv() {
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required env: ${key}`);
    }
  }

  return {
    port: Number(process.env.PORT || 3001),
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
    adminEmail: process.env.SEED_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "",
    adminPassword: process.env.SEED_ADMIN_PASSWORD || "",
    corsOrigin: process.env.CORS_ORIGIN || "*",
  };
}

module.exports = { getEnv };
