const { Project } = require("../projects/project.model");
const { ShowcaseItem } = require("../showcase/showcase.model");
const { getContactSubmissionStats } = require("../contacts/contact-submission.service");

async function getDashboardSummaryController(_req, res, next) {
  try {
    const [projectTotal, projectActive, homeActive, slideActive, contactStats, recentProjects] = await Promise.all([
      Project.countDocuments({}),
      Project.countDocuments({ is_active: { $ne: false } }),
      ShowcaseItem.countDocuments({ type: "home_highlight", is_active: true }),
      ShowcaseItem.countDocuments({ type: "hero_slide", is_active: true }),
      getContactSubmissionStats(),
      Project.find({})
        .select("title name banner_image image_1 updated_at")
        .sort({ updated_at: -1 })
        .limit(5)
        .lean(),
    ]);

    return res.json({
      success: true,
      data: {
        projects: {
          total: projectTotal,
          active: projectActive,
          recent_items: recentProjects.map((item) => ({
            id: item._id.toString(),
            ...item,
            image_1: item.banner_image || item.image_1 || "",
          })),
        },
        showcase: {
          home_highlights_active: homeActive,
          hero_slides_active: slideActive,
        },
        contacts: contactStats,
      },
      message: "OK",
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getDashboardSummaryController };
