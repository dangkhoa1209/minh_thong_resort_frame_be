const {
  listProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} = require("./project.service");

async function listProjectsController(req, res, next) {
  try {
    const result = await listProjects(req.query);
    return res.json({ success: true, data: result, message: "OK" });
  } catch (error) {
    return next(error);
  }
}

async function createProjectController(req, res, next) {
  try {
    const id = await createProject(req.body);
    return res.status(201).json({
      success: true,
      data: { id },
      message: "Tao project thanh cong",
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: { code: "CONFLICT", message: "Slug already exists" },
      });
    }
    return next(error);
  }
}

async function getProjectDetailController(req, res, next) {
  try {
    const item = await getProjectById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Project not found" },
      });
    }
    return res.json({ success: true, data: item, message: "OK" });
  } catch (error) {
    return next(error);
  }
}

async function updateProjectController(req, res, next) {
  try {
    const item = await updateProject(req.params.id, req.body);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Project not found" },
      });
    }
    return res.json({
      success: true,
      data: { id: item.id },
      message: "Cap nhat project thanh cong",
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: { code: "CONFLICT", message: "Slug already exists" },
      });
    }
    return next(error);
  }
}

async function deleteProjectController(req, res, next) {
  try {
    const item = await deleteProject(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Project not found" },
      });
    }
    return res.json({
      success: true,
      data: item,
      message: "Xoa project thanh cong",
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listProjectsController,
  createProjectController,
  getProjectDetailController,
  updateProjectController,
  deleteProjectController,
};
