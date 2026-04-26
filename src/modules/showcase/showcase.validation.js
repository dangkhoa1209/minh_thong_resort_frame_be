const Joi = require("joi");

const showcasePayloadSchema = Joi.object({
  project_id: Joi.string().length(24).hex().required(),
  display_image: Joi.string().allow("").optional(),
  sort_order: Joi.number().integer().min(0).default(0),
  is_active: Joi.boolean().default(true),
});

const showcaseQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().allow("").default(""),
  is_active: Joi.boolean().optional(),
});

module.exports = {
  showcasePayloadSchema,
  showcaseQuerySchema,
};
