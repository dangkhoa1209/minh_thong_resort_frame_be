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
  getHomePartnersAdminController,
  updateHomePartnersAdminController,
  getHomePartnersPublicController,
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
adminRouter.get("/home-partners", getHomePartnersAdminController);
adminRouter.put("/home-partners", updateHomePartnersAdminController);

publicRouter.get("/logo", getLogoPublicController);
publicRouter.get("/contact", getContactPublicController);
publicRouter.get("/home-banner", getHomeBannerPublicController);
publicRouter.get("/home-partners", getHomePartnersPublicController);

module.exports = { adminSettingRouter: adminRouter, publicSettingRouter: publicRouter };
