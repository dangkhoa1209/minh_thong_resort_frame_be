const path = require("path");
const multer = require("multer");
const maxUploadMb = Number(process.env.MAX_UPLOAD_MB || 10);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), "uploads/projects")),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.toLowerCase().replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

function fileFilter(_req, file, cb) {
  const allowed = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
  ]);
  if (!allowed.has(file.mimetype)) {
    return cb(new Error("Invalid file type"));
  }
  return cb(null, true);
}

const uploadProjectImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: Math.max(1, maxUploadMb) * 1024 * 1024 },
}).single("file");

module.exports = { uploadProjectImage };
