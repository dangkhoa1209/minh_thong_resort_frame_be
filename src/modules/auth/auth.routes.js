const express = require("express");
const { loginController, meController } = require("./auth.controller");
const { validate } = require("../../middleware/validate.middleware");
const { loginRateLimit } = require("../../middleware/rate-limit.middleware");
const { loginSchema } = require("./auth.validation");
const { requireAuth } = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/login", loginRateLimit, validate(loginSchema), loginController);
router.get("/me", requireAuth, meController);

module.exports = router;
