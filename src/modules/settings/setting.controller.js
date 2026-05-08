const Joi = require("joi");
const { getSettingValue, upsertSettingValue } = require("./setting.service");

const logoFallback = {
  logo_light_url: "/uploads/default/logo/logo-pro.svg",
  logo_dark_url: "/uploads/default/logo/logo-pro-dark.svg",
};

const logoSchema = Joi.object({
  logo_light_url: Joi.string().allow("").default(""),
  logo_dark_url: Joi.string().allow("").default(""),
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

const homeBannerFallback = {
  banner_image: "",
};

const homeBannerSchema = Joi.object({
  banner_image: Joi.string().allow("").default(""),
});

const homePartnersFallback = {
  logos: [
    "/uploads/default/partners/asset-2.svg",
    "/uploads/default/partners/asset-3.svg",
    "/uploads/default/partners/asset-4.svg",
    "/uploads/default/partners/asset-5.svg",
    "/uploads/default/partners/asset-6.svg",
  ],
};

const homePartnersSchema = Joi.object({
  logos: Joi.array().items(Joi.string().allow("")).default([]),
});


async function getLogoAdminController(_req, res, next) {
  try {
    const value = await getSettingValue("logo_active", logoFallback);
    return res.json({
      success: true,
      data: {
        ...logoFallback,
        ...value,
      },
      message: "OK",
    });
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
    const normalized = {
      logo_light_url: value.logo_light_url || logoFallback.logo_light_url,
      logo_dark_url: value.logo_dark_url || logoFallback.logo_dark_url,
    };
    const updated = await upsertSettingValue("logo_active", normalized);
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
    const value = await getSettingValue("logo_active", logoFallback);
    return res.json({
      success: true,
      data: {
        ...logoFallback,
        ...value,
      },
      message: "OK",
    });
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

async function getHomeBannerAdminController(_req, res, next) {
  try {
    const value = await getSettingValue("home_banner", homeBannerFallback);
    return res.json({
      success: true,
      data: {
        ...homeBannerFallback,
        ...value,
      },
      message: "OK",
    });
  } catch (error) {
    return next(error);
  }
}

async function updateHomeBannerAdminController(req, res, next) {
  try {
    const { error, value } = homeBannerSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: error.details[0].message },
      });
    }
    const normalized = {
      banner_image: value.banner_image || "",
    };
    const updated = await upsertSettingValue("home_banner", normalized);
    return res.json({ success: true, data: updated, message: "Cap nhat home banner thanh cong" });
  } catch (error) {
    return next(error);
  }
}

async function getHomeBannerPublicController(_req, res, next) {
  try {
    const value = await getSettingValue("home_banner", homeBannerFallback);
    return res.json({
      success: true,
      data: {
        ...homeBannerFallback,
        ...value,
      },
      message: "OK",
    });
  } catch (error) {
    return next(error);
  }
}

async function getHomePartnersAdminController(_req, res, next) {
  try {
    const value = await getSettingValue("home_partners", homePartnersFallback);
    return res.json({
      success: true,
      data: {
        ...homePartnersFallback,
        ...value,
      },
      message: "OK",
    });
  } catch (error) {
    return next(error);
  }
}

async function updateHomePartnersAdminController(req, res, next) {
  try {
    const { error, value } = homePartnersSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: error.details[0].message },
      });
    }
    const normalized = {
      logos: (value.logos || []).filter((item) => String(item || "").trim() !== ""),
    };
    const updated = await upsertSettingValue("home_partners", normalized);
    return res.json({ success: true, data: updated, message: "Cap nhat partner logos thanh cong" });
  } catch (error) {
    return next(error);
  }
}

async function getHomePartnersPublicController(_req, res, next) {
  try {
    const value = await getSettingValue("home_partners", homePartnersFallback);
    return res.json({
      success: true,
      data: {
        ...homePartnersFallback,
        ...value,
      },
      message: "OK",
    });
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
  getHomeBannerAdminController,
  updateHomeBannerAdminController,
  getHomeBannerPublicController,
  getHomePartnersAdminController,
  updateHomePartnersAdminController,
  getHomePartnersPublicController,
};
