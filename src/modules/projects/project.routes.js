const express = require("express");
const { requireAuth } = require("../../middleware/auth.middleware");
const { validate } = require("../../middleware/validate.middleware");
const {
  projectPayloadSchema,
  projectQuerySchema,
  projectActiveSchema,
} = require("./project.validation");
const {
  listProjectsController,
  createProjectController,
  getProjectDetailController,
  updateProjectController,
  updateProjectActiveController,
  deleteProjectController,
} = require("./project.controller");

const router = express.Router();

router.use(requireAuth);
router.get("/", validate(projectQuerySchema, "query"), listProjectsController);
router.post("/", validate(projectPayloadSchema), createProjectController);
router.get("/:id", getProjectDetailController);
router.put("/:id", validate(projectPayloadSchema), updateProjectController);
router.patch("/:id/active", validate(projectActiveSchema), updateProjectActiveController);
router.delete("/:id", deleteProjectController);

module.exports = router;
