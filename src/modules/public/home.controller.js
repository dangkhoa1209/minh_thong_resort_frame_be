const Joi = require("joi");
const {
  getHomeProjects,
  getSlideProjects,
  getProjectDetailBySlug,
  getOtherProjects,
} = require("../projects/project.service");

async function getHomeProjectsController(_req, res, next) {
  try {
    const data = await getHomeProjects();
    return res.json({ success: true, data, message: "OK" });
  } catch (error) {
    return next(error);
  }
}

async function getSlideProjectsController(_req, res, next) {
  try {
    const data = await getSlideProjects();
    return res.json({ success: true, data, message: "OK" });
  } catch (error) {
    return next(error);
  }
}

async function getProjectBySlugController(req, res, next) {
  try {
    const data = await getProjectDetailBySlug(req.params.slug);
    if (!data) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Project not found" },
      });
    }
    return res.json({ success: true, data, message: "OK" });
  } catch (error) {
    return next(error);
  }
}

async function getOtherProjectsController(req, res, next) {
  try {
    const { value } = Joi.object({
      limit: Joi.number().integer().min(1).max(20).default(6),
    }).validate(req.query, { stripUnknown: true });

    const data = await getOtherProjects(req.params.slug, value.limit);
    return res.json({ success: true, data, message: "OK" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getHomeProjectsController,
  getSlideProjectsController,
  getProjectBySlugController,
  getOtherProjectsController,
};
