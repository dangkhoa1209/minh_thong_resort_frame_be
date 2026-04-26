const express = require("express");
const { requireAuth } = require("../../middleware/auth.middleware");
const { getDashboardSummaryController } = require("./dashboard.controller");

const router = express.Router();

router.use(requireAuth);
router.get("/summary", getDashboardSummaryController);

module.exports = router;
