const Joi = require("joi");
const { getCollaborationValue, upsertCollaborationValue } = require("./collaboration.service");

const collaborationImagesFallback = {
  images: [
    "/uploads/default/collaboration/1.webp",
    "/uploads/default/collaboration/2.webp",
    "/uploads/default/collaboration/3.webp",
    "/uploads/default/collaboration/4.webp",
    "/uploads/default/collaboration/5.webp",
    "/uploads/default/collaboration/6.webp",
    "/uploads/default/collaboration/7.webp",
    "/uploads/default/collaboration/8.webp",
  ],
};

const collaborationImagesSchema = Joi.object({
  images: Joi.array().items(Joi.string().allow("")).max(8).default([]),
});

function normalizeCollaborationImages(images, useFallback = false) {
  const source = Array.isArray(images) ? images : [];
  return collaborationImagesFallback.images.map((fallbackUrl, index) => {
    const value = String(source[index] || "").trim();
    return value || (useFallback ? fallbackUrl : "");
  });
}

async function getCollaborationImagesAdminController(_req, res, next) {
  try {
    const value = await getCollaborationValue();
    return res.json({
      success: true,
      data: {
        images: normalizeCollaborationImages(value.images, false),
      },
      message: "OK",
    });
  } catch (error) {
    return next(error);
  }
}

async function updateCollaborationImagesAdminController(req, res, next) {
  try {
    const { error, value } = collaborationImagesSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: error.details[0].message },
      });
    }

    const normalized = {
      images: normalizeCollaborationImages(value.images, false),
    };

    const updated = await upsertCollaborationValue(normalized);
    return res.json({ success: true, data: updated, message: "Cap nhat collaboration images thanh cong" });
  } catch (error) {
    return next(error);
  }
}

async function getCollaborationImagesPublicController(_req, res, next) {
  try {
    const value = await getCollaborationValue();
    return res.json({
      success: true,
      data: {
        images: normalizeCollaborationImages(value.images, true),
      },
      message: "OK",
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getCollaborationImagesAdminController,
  updateCollaborationImagesAdminController,
  getCollaborationImagesPublicController,
};
