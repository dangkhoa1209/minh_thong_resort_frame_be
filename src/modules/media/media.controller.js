function uploadProjectImageController(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "File is required" },
    });
  }

  return res.status(201).json({
    success: true,
    data: {
      file_name: req.file.filename,
      url: `/uploads/projects/${req.file.filename}`,
      size: req.file.size,
      mime_type: req.file.mimetype,
    },
    message: "Upload thanh cong",
  });
}

module.exports = { uploadProjectImageController };
