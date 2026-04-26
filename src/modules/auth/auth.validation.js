const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const changePasswordSchema = Joi.object({
  current_password: Joi.string().min(8).required(),
  new_password: Joi.string().min(8).required().invalid(Joi.ref("current_password")),
  confirm_password: Joi.string().required().valid(Joi.ref("new_password")),
});

const listUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().allow(""),
});

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("owner", "editor").default("editor"),
  is_active: Joi.boolean().default(true),
});

const updateUserSchema = Joi.object({
  role: Joi.string().valid("owner", "editor"),
  is_active: Joi.boolean(),
  password: Joi.string().min(8),
}).min(1);

module.exports = {
  loginSchema,
  changePasswordSchema,
  listUsersQuerySchema,
  createUserSchema,
  updateUserSchema,
};
