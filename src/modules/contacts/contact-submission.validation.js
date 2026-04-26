const Joi = require("joi");

const contactSubmissionQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().allow("").default(""),
  status: Joi.string().valid("new", "contacted", "closed", "").default(""),
});

const updateContactSubmissionStatusSchema = Joi.object({
  status: Joi.string().valid("new", "contacted", "closed").required(),
});

module.exports = {
  contactSubmissionQuerySchema,
  updateContactSubmissionStatusSchema,
};
