const {
  listShowcaseItems,
  createShowcaseItem,
  getShowcaseItemById,
  updateShowcaseItem,
  deleteShowcaseItem,
} = require("./showcase.service");

function buildShowcaseController(type, title) {
  async function listController(req, res, next) {
    try {
      const result = await listShowcaseItems(type, req.query);
      return res.json({ success: true, data: result, message: "OK" });
    } catch (error) {
      return next(error);
    }
  }

  async function createController(req, res, next) {
    try {
      const id = await createShowcaseItem(type, req.body);
      return res.status(201).json({
        success: true,
        data: { id },
        message: `${title} created successfully`,
      });
    } catch (error) {
      if (error && error.code === 11000) {
        return res.status(409).json({
          success: false,
          error: { code: "CONFLICT", message: "This project is already added" },
        });
      }
      if (error && error.code === "PROJECT_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          error: { code: "NOT_FOUND", message: "Project not found" },
        });
      }
      return next(error);
    }
  }

  async function detailController(req, res, next) {
    try {
      const item = await getShowcaseItemById(type, req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          error: { code: "NOT_FOUND", message: `${title} not found` },
        });
      }
      return res.json({ success: true, data: item, message: "OK" });
    } catch (error) {
      return next(error);
    }
  }

  async function updateController(req, res, next) {
    try {
      const item = await updateShowcaseItem(type, req.params.id, req.body);
      if (!item) {
        return res.status(404).json({
          success: false,
          error: { code: "NOT_FOUND", message: `${title} not found` },
        });
      }
      return res.json({
        success: true,
        data: item,
        message: `${title} updated successfully`,
      });
    } catch (error) {
      if (error && error.code === 11000) {
        return res.status(409).json({
          success: false,
          error: { code: "CONFLICT", message: "This project is already added" },
        });
      }
      if (error && error.code === "PROJECT_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          error: { code: "NOT_FOUND", message: "Project not found" },
        });
      }
      return next(error);
    }
  }

  async function deleteController(req, res, next) {
    try {
      const item = await deleteShowcaseItem(type, req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          error: { code: "NOT_FOUND", message: `${title} not found` },
        });
      }
      return res.json({
        success: true,
        data: item,
        message: `${title} deleted successfully`,
      });
    } catch (error) {
      return next(error);
    }
  }

  return {
    listController,
    createController,
    detailController,
    updateController,
    deleteController,
  };
}

module.exports = { buildShowcaseController };
