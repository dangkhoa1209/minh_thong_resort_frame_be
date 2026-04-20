const express = require("express");
const { requireAuth } = require("../../middleware/auth.middleware");
const { uploadProjectImage } = require("./upload.middleware");
const { uploadProjectImageController } = require("./media.controller");

const router = express.Router();

router.post("/upload-project", requireAuth, (req, res, next) => {
  uploadProjectImage(req, res, (error) => {
    if (error) {
      if (error.code === "LIMIT_FILE_SIZE") {
        const maxUploadMb = Number(process.env.MAX_UPLOAD_MB || 10);
        return res.status(422).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: `File too large. Max ${maxUploadMb}MB`,
          },
        });
      }
      return res.status(422).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: error.message },
      });
    }
    return uploadProjectImageController(req, res, next);
  });
});

module.exports = router;
