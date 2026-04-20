const Joi = require("joi");
const { getSettingValue, upsertSettingValue } = require("./setting.service");

const logoSchema = Joi.object({
  logo_url: Joi.string().required(),
});

const contactSchema = Joi.object({
  company_name: Joi.string().allow("").default(""),
  email: Joi.string().allow("").default(""),
  phone: Joi.string().allow("").default(""),
  address: Joi.string().allow("").default(""),
  facebook: Joi.string().allow("").default(""),
  instagram: Joi.string().allow("").default(""),
  website: Joi.string().allow("").default(""),
});

async function getLogoAdminController(_req, res, next) {
  try {
    const value = await getSettingValue("logo_active", { logo_url: "" });
    return res.json({ success: true, data: value, message: "OK" });
  } catch (error) {
    return next(error);
  }
}

async function updateLogoAdminController(req, res, next) {
  try {
    const { error, value } = logoSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: error.details[0].message },
      });
    }
    const updated = await upsertSettingValue("logo_active", value);
    return res.json({ success: true, data: updated, message: "Cap nhat logo thanh cong" });
  } catch (error) {
    return next(error);
  }
}

async function getContactAdminController(_req, res, next) {
  try {
    const value = await getSettingValue("contact_info", {});
    return res.json({ success: true, data: value, message: "OK" });
  } catch (error) {
    return next(error);
  }
}

async function updateContactAdminController(req, res, next) {
  try {
    const { error, value } = contactSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: error.details[0].message },
      });
    }
    const updated = await upsertSettingValue("contact_info", value);
    return res.json({ success: true, data: updated, message: "Cap nhat contact thanh cong" });
  } catch (error) {
    return next(error);
  }
}

async function getLogoPublicController(_req, res, next) {
  try {
    const value = await getSettingValue("logo_active", { logo_url: "" });
    return res.json({ success: true, data: value, message: "OK" });
  } catch (error) {
    return next(error);
  }
}

async function getContactPublicController(_req, res, next) {
  try {
    const value = await getSettingValue("contact_info", {});
    return res.json({ success: true, data: value, message: "OK" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getLogoAdminController,
  updateLogoAdminController,
  getContactAdminController,
  updateContactAdminController,
  getLogoPublicController,
  getContactPublicController,
};
