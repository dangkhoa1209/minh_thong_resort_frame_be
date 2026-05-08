const express = require("express");
const { requireAuth } = require("../../middleware/auth.middleware");
const {
  getCollaborationImagesAdminController,
  updateCollaborationImagesAdminController,
  getCollaborationImagesPublicController,
} = require("./collaboration.controller");

const adminRouter = express.Router();
const publicRouter = express.Router();

adminRouter.use(requireAuth);
adminRouter.get("/", getCollaborationImagesAdminController);
adminRouter.put("/", updateCollaborationImagesAdminController);

publicRouter.get("/", getCollaborationImagesPublicController);

module.exports = { adminCollaborationRouter: adminRouter, publicCollaborationRouter: publicRouter };
