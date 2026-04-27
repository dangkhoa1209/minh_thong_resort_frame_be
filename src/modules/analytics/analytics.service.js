const { ProjectView } = require("./project-view.model");

async function trackProjectView(payload, req) {
  if (!payload.project_slug) {
    return null;
  }

  return ProjectView.create({
    project_slug: payload.project_slug,
    path: payload.path || "",
    user_agent: req.get("user-agent") || "",
    ip: req.ip || "",
  });
}

async function getProjectViewStats() {
  const totalViews = await ProjectView.countDocuments({});
  return { total_views: totalViews };
}

module.exports = { trackProjectView, getProjectViewStats };
