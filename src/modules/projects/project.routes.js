const express = require("express");
const { requireAuth } = require("../../middleware/auth.middleware");
const { validate } = require("../../middleware/validate.middleware");
const {
  projectPayloadSchema,
  projectDisplaySchema,
  projectQuerySchema,
} = require("./project.validation");
const {
  listProjectsController,
  createProjectController,
  getProjectDetailController,
  updateProjectController,
  updateProjectDisplayController,
} = require("./project.controller");

const router = express.Router();

router.use(requireAuth);
router.get("/", validate(projectQuerySchema, "query"), listProjectsController);
router.post("/", validate(projectPayloadSchema), createProjectController);
router.get("/:id", getProjectDetailController);
router.put("/:id", validate(projectPayloadSchema), updateProjectController);
router.patch("/:id/display", validate(projectDisplaySchema), updateProjectDisplayController);

module.exports = router;
