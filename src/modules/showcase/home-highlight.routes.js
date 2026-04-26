const express = require("express");
const { requireAuth } = require("../../middleware/auth.middleware");
const { validate } = require("../../middleware/validate.middleware");
const { showcasePayloadSchema, showcaseQuerySchema } = require("./showcase.validation");
const { buildShowcaseController } = require("./showcase.controller");
const { SHOWCASE_TYPES } = require("./showcase.service");

const router = express.Router();
const controller = buildShowcaseController(SHOWCASE_TYPES.home, "home highlight");

router.use(requireAuth);
router.get("/", validate(showcaseQuerySchema, "query"), controller.listController);
router.post("/", validate(showcasePayloadSchema), controller.createController);
router.get("/:id", controller.detailController);
router.put("/:id", validate(showcasePayloadSchema), controller.updateController);
router.delete("/:id", controller.deleteController);

module.exports = router;
