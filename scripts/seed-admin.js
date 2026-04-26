require("dotenv").config();
const bcrypt = require("bcrypt");
const { connectDatabase } = require("../src/config/database");
const { AdminUser } = require("../src/modules/auth/auth.model");

async function run() {
  const mongoUri = process.env.MONGO_URI;
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!mongoUri || !email || !password) {
    throw new Error("Please set MONGO_URI, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD");
  }

  await connectDatabase(mongoUri);

  const existing = await AdminUser.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await AdminUser.create({
    email: email.toLowerCase(),
    password_hash: passwordHash,
    role: "owner",
    is_active: true,
  });

  console.log("Admin seeded successfully");
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
