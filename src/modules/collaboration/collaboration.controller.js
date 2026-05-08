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

const collaborationContentFallback = {
  title: "Visual Campaign",
  subtitle: "Architecture, Atmosphere & the Art of Hospitality",
  content:
    "**At Abel Dang Production**, we see every resort as a living narrative told through its architecture, the emotions it stirs, the spaces it defines, and the sensory journeys it offers, both physical and emotional.\n\nThrough aerial perspectives and cinematic imagery, we highlight the architectural soul of each resort - where regional culture is thoughtfully woven into the landscape of hospitality.\n\n**Each photoset is designed to:**\n- Highlight signature spaces and architectural identity with a cinematic lens.\n- Reflect authentic guest experiences and resort level service offerings.\n- Support resorts in multi platform brand communications: website, social media, brochures, and beyond.\n\nThis campaign is active and evolving, with new resort collaborations shaped monthly through shared creative vision.\n\nPlease contact us via email [abeldang@dangvuproduction.com](mailto:abeldang@dangvuproduction.com).",
};

const collaborationImagesSchema = Joi.object({
  title: Joi.string().allow("").default(""),
  subtitle: Joi.string().allow("").default(""),
  content: Joi.string().allow("").default(""),
  images: Joi.array().items(Joi.string().allow("")).max(8).default([]),
});

function normalizeContent(value, useFallback = false) {
  const title = String(value?.title || "").trim();
  const subtitle = String(value?.subtitle || "").trim();
  const content = String(value?.content || "").trim();

  return {
    title: title || (useFallback ? collaborationContentFallback.title : ""),
    subtitle: subtitle || (useFallback ? collaborationContentFallback.subtitle : ""),
    content: content || (useFallback ? collaborationContentFallback.content : ""),
  };
}

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
    const normalizedContent = normalizeContent(value, true);
    return res.json({
      success: true,
      data: {
        ...normalizedContent,
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
      ...normalizeContent(value, false),
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
    const normalizedContent = normalizeContent(value, true);
    return res.json({
      success: true,
      data: {
        ...normalizedContent,
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
