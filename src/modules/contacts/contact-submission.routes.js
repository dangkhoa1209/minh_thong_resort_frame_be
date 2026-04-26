const express = require("express");
const { requireAuth } = require("../../middleware/auth.middleware");
const { validate } = require("../../middleware/validate.middleware");
const {
  contactSubmissionQuerySchema,
  updateContactSubmissionStatusSchema,
} = require("./contact-submission.validation");
const {
  listContactSubmissionsController,
  updateContactSubmissionStatusController,
} = require("./contact-submission.controller");

const router = express.Router();

router.use(requireAuth);
router.get("/", validate(contactSubmissionQuerySchema, "query"), listContactSubmissionsController);
router.patch("/:id/status", validate(updateContactSubmissionStatusSchema), updateContactSubmissionStatusController);

module.exports = router;
