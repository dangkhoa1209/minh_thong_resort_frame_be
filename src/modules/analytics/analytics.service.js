const { ProjectView } = require("./project-view.model");
const { Project } = require("../projects/project.model");

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

async function getProjectViewStats(limit = 5) {
  const [totalViews, topProjectsRaw] = await Promise.all([
    ProjectView.countDocuments({}),
    ProjectView.aggregate([
      {
        $group: {
          _id: "$project_slug",
          views: { $sum: 1 },
          last_viewed_at: { $max: "$created_at" },
        },
      },
      { $sort: { views: -1, last_viewed_at: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          project_slug: "$_id",
          views: 1,
          last_viewed_at: 1,
        },
      },
    ]),
  ]);

  const slugs = topProjectsRaw.map((item) => item.project_slug).filter(Boolean);
  const projects = await Project.find({ slug: { $in: slugs } }).select("slug title name").lean();
  const projectMap = new Map(projects.map((item) => [item.slug, item]));

  const topProjects = topProjectsRaw.map((item) => {
    const project = projectMap.get(item.project_slug);
    return {
      ...item,
      title: project?.title || "",
      name: project?.name || "",
    };
  });

  return { total_views: totalViews, top_projects: topProjects };
}

module.exports = { trackProjectView, getProjectViewStats };
