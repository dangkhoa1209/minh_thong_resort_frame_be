function uploadProjectImageController(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "File is required" },
    });
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const filePath = `/uploads/projects/${req.file.filename}`;

  return res.status(201).json({
    success: true,
    data: {
      file_name: req.file.filename,
      url: `${baseUrl}${filePath}`,
      size: req.file.size,
      mime_type: req.file.mimetype,
    },
    message: "Upload thanh cong",
  });
}

module.exports = { uploadProjectImageController };
