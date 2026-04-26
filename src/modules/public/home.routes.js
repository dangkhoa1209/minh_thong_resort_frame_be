const express = require("express");
const {
  getHomeProjectsController,
  getSlideProjectsController,
  getPublicProjectsController,
  getProjectBySlugController,
  getOtherProjectsController,
} = require("./home.controller");

const router = express.Router();

router.get("/home/projects", getHomeProjectsController);
router.get("/home/slide-projects", getSlideProjectsController);
router.get("/projects", getPublicProjectsController);
router.get("/projects/:slug", getProjectBySlugController);
router.get("/projects/:slug/other-projects", getOtherProjectsController);

module.exports = router;
