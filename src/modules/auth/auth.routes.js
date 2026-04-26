const express = require("express");
const {
  loginController,
  meController,
  changePasswordController,
  listUsersController,
  createUserController,
  updateUserController,
} = require("./auth.controller");
const { validate } = require("../../middleware/validate.middleware");
const { loginRateLimit } = require("../../middleware/rate-limit.middleware");
const {
  loginSchema,
  changePasswordSchema,
  listUsersQuerySchema,
  createUserSchema,
  updateUserSchema,
} = require("./auth.validation");
const { requireAuth, requireRoles } = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/login", loginRateLimit, validate(loginSchema), loginController);
router.get("/me", requireAuth, meController);
router.post("/change-password", requireAuth, validate(changePasswordSchema), changePasswordController);
router.get("/users", requireAuth, requireRoles(["owner"]), validate(listUsersQuerySchema, "query"), listUsersController);
router.post("/users", requireAuth, requireRoles(["owner"]), validate(createUserSchema), createUserController);
router.patch("/users/:id", requireAuth, requireRoles(["owner"]), validate(updateUserSchema), updateUserController);

module.exports = router;
