const express = require("express");
const { requireAuth } = require("../../middleware/auth.middleware");
const {
  getLogoAdminController,
  updateLogoAdminController,
  getContactAdminController,
  updateContactAdminController,
  getLogoPublicController,
  getContactPublicController,
} = require("./setting.controller");

const adminRouter = express.Router();
const publicRouter = express.Router();

adminRouter.use(requireAuth);
adminRouter.get("/logo", getLogoAdminController);
adminRouter.put("/logo", updateLogoAdminController);
adminRouter.get("/contact", getContactAdminController);
adminRouter.put("/contact", updateContactAdminController);

publicRouter.get("/logo", getLogoPublicController);
publicRouter.get("/contact", getContactPublicController);

module.exports = { adminSettingRouter: adminRouter, publicSettingRouter: publicRouter };
