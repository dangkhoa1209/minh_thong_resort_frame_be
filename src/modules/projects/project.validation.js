const Joi = require("joi");

const imageItemSchema = Joi.object({
  url: Joi.string().required(),
  crop_ratio: Joi.string().allow("").optional(),
  crop_mode: Joi.string().valid("preset", "custom", "free", "").optional(),
});

const imageRowSchema = Joi.object({
  layout: Joi.number().valid(1, 2).required(),
  ratio: Joi.string().allow("").optional(),
  images: Joi.array().items(imageItemSchema).required(),
}).custom((value, helpers) => {
  if (!Array.isArray(value.images) || value.images.length !== value.layout) {
    return helpers.message(`images.length must equal layout (${value.layout})`);
  }
  return value;
});

const projectPayloadSchema = Joi.object({
  slug: Joi.string().pattern(/^[a-z0-9-]+$/).required(),
  title: Joi.string().max(200).required(),
  name: Joi.string().max(200).required(),
  location: Joi.string().max(200).allow("").optional(),
  year: Joi.string().max(50).allow("").optional(),
  short_description: Joi.string().max(500).allow("").optional(),
  content: Joi.string().allow("").optional(),
  banner_image: Joi.string().allow("").optional(),
  banner_title: Joi.string().max(200).allow("").optional(),
  banner_subtitle: Joi.string().max(200).allow("").optional(),
  image_1: Joi.string().allow("").optional(),
  image_rows: Joi.array().items(imageRowSchema).max(20).default([]),
});

const projectQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().allow("").default(""),
});

module.exports = {
  projectPayloadSchema,
  projectQuerySchema,
};
