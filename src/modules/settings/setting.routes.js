const express = require("express");
const { requireAuth } = require("../../middleware/auth.middleware");
const {
  getLogoAdminController,
  updateLogoAdminController,
  getContactAdminController,
  updateContactAdminController,
  getLogoPublicController,
  getContactPublicController,
  getHomeBannerAdminController,
  updateHomeBannerAdminController,
  getHomeBannerPublicController,
} = require("./setting.controller");

const adminRouter = express.Router();
const publicRouter = express.Router();

adminRouter.use(requireAuth);
adminRouter.get("/logo", getLogoAdminController);
adminRouter.put("/logo", updateLogoAdminController);
adminRouter.get("/contact", getContactAdminController);
adminRouter.put("/contact", updateContactAdminController);
adminRouter.get("/home-banner", getHomeBannerAdminController);
adminRouter.put("/home-banner", updateHomeBannerAdminController);

publicRouter.get("/logo", getLogoPublicController);
publicRouter.get("/contact", getContactPublicController);
publicRouter.get("/home-banner", getHomeBannerPublicController);

module.exports = { adminSettingRouter: adminRouter, publicSettingRouter: publicRouter };
