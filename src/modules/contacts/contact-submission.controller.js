const {
  listContactSubmissions,
  updateContactSubmissionStatus,
} = require("./contact-submission.service");

async function listContactSubmissionsController(req, res, next) {
  try {
    const data = await listContactSubmissions(req.query);
    return res.json({ success: true, data, message: "OK" });
  } catch (error) {
    return next(error);
  }
}

async function updateContactSubmissionStatusController(req, res, next) {
  try {
    const data = await updateContactSubmissionStatus(req.params.id, req.body.status);
    if (!data) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Contact submission not found" },
      });
    }
    return res.json({ success: true, data, message: "Status updated successfully" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listContactSubmissionsController,
  updateContactSubmissionStatusController,
};
