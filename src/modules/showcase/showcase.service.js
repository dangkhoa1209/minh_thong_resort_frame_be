const mongoose = require("mongoose");
const { ShowcaseItem } = require("./showcase.model");
const { Project } = require("../projects/project.model");

const SHOWCASE_TYPES = {
  home: "home_highlight",
  slide: "hero_slide",
};

const PROJECT_STATIC_SLUG_ALIASES = {
  "resort-spa-ana-mandara-villas": "ana-mandara-villas-dalat",
  "resort-binh-an-village": "binh-an-village-dalat",
  "resort-spa-renaissance": "marriott-renaissance-hoi-an",
  "hotel-mercure-vung-tau": "mercure-hotel-vung-tau",
  "resort-citadines-pearl-hoi-an": "pear-hoi-an",
};

const CUSTOM_PROJECT_SLUGS = new Set([
  "ana-mandara-villas-dalat",
  "binh-an-village-dalat",
  "four-seasons-resort-the-nam-hai",
  "marriott-renaissance-hoi-an",
  "mercure-hotel-vung-tau",
  "pear-hoi-an",
]);

function projectToPublicPath(slug) {
  const staticSlug = PROJECT_STATIC_SLUG_ALIASES[slug] || slug;
  if (CUSTOM_PROJECT_SLUGS.has(staticSlug)) {
    return `/pages/project/${staticSlug}.html`;
  }
  return `/pages/project/project-detail.html?slug=${encodeURIComponent(slug)}`;
}

function getProjectCoverImage(project = {}, fallback = "") {
  return project.banner_image || project.image_1 || fallback || "";
}

async function fetchProjectsMap(projectIds) {
  if (!projectIds.length) {
    return new Map();
  }

  const projects = await Project.find({ _id: { $in: projectIds } })
    .select("slug title name short_description banner_image image_1 is_active")
    .lean();

  return new Map(projects.map((item) => [item._id.toString(), item]));
}

async function listShowcaseItems(type, query) {
  const { page, limit, search, is_active } = query;
  const filter = { type };

  if (typeof is_active === "boolean") {
    filter.is_active = is_active;
  }

  if (search) {
    const matchedProjects = await Project.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ],
    })
      .select("_id")
      .limit(500)
      .lean();

    const projectIds = matchedProjects.map((item) => item._id);
    if (!projectIds.length) {
      return {
        items: [],
        pagination: { page, limit, total: 0, total_pages: 1 },
      };
    }
    filter.project_id = { $in: projectIds };
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    ShowcaseItem.find(filter)
      .select("type project_id display_image sort_order is_active updated_at")
      .sort({ sort_order: 1, updated_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ShowcaseItem.countDocuments(filter),
  ]);

  const projectsMap = await fetchProjectsMap(items.map((item) => item.project_id));

  return {
    items: items
      .map((item) => {
        const project = projectsMap.get(item.project_id.toString());
        if (!project) return null;
        return {
          id: item._id.toString(),
          project_id: item.project_id.toString(),
          project_slug: project.slug,
          project_title: project.title,
          project_name: project.name || "",
          display_image: getProjectCoverImage(project, item.display_image),
          sort_order: item.sort_order,
          is_active: item.is_active,
          updated_at: item.updated_at,
        };
      })
      .filter(Boolean),
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

async function getExistingProject(projectId) {
  const project = await Project.findById(projectId).select("banner_image image_1").lean();
  if (!project) {
    const error = new Error("Project not found");
    error.code = "PROJECT_NOT_FOUND";
    throw error;
  }
  return project;
}

async function createShowcaseItem(type, payload) {
  await getExistingProject(payload.project_id);
  const created = await ShowcaseItem.create({
    type,
    project_id: new mongoose.Types.ObjectId(payload.project_id),
    display_image: payload.display_image || "",
    sort_order: payload.sort_order,
    is_active: payload.is_active,
  });
  return created._id.toString();
}

async function getShowcaseItemById(type, id) {
  const item = await ShowcaseItem.findOne({ _id: id, type }).lean();
  if (!item) return null;

  const project = await Project.findById(item.project_id).select("slug title name banner_image image_1").lean();
  if (!project) return null;

  return {
    id: item._id.toString(),
    project_id: item.project_id.toString(),
    project_slug: project.slug,
    project_title: project.title,
    project_name: project.name || "",
    display_image: getProjectCoverImage(project, item.display_image),
    sort_order: item.sort_order,
    is_active: item.is_active,
    updated_at: item.updated_at,
  };
}

async function updateShowcaseItem(type, id, payload) {
  await getExistingProject(payload.project_id);
  const updated = await ShowcaseItem.findOneAndUpdate(
    { _id: id, type },
    {
      project_id: new mongoose.Types.ObjectId(payload.project_id),
      display_image: payload.display_image || "",
      sort_order: payload.sort_order,
      is_active: payload.is_active,
    },
    { returnDocument: "after" }
  ).lean();

  if (!updated) return null;
  return { id: updated._id.toString() };
}

async function deleteShowcaseItem(type, id) {
  const deleted = await ShowcaseItem.findOneAndDelete({ _id: id, type }).lean();
  if (!deleted) return null;
  return { id: deleted._id.toString() };
}

async function getPublicHomeHighlights() {
  const items = await ShowcaseItem.find({ type: SHOWCASE_TYPES.home, is_active: true })
    .select("project_id display_image sort_order")
    .sort({ sort_order: 1, updated_at: -1 })
    .limit(100)
    .lean();

  const projectsMap = await fetchProjectsMap(items.map((item) => item.project_id));

  return items
    .map((item) => {
      const project = projectsMap.get(item.project_id.toString());
        if (!project || project.is_active === false) return null;
      return {
        slug: project.slug,
        title: project.title,
        name: project.name || "",
        short_description: project.short_description || project.title || "",
        image_1: getProjectCoverImage(project, item.display_image),
        project_url: projectToPublicPath(project.slug),
      };
    })
    .filter(Boolean);
}

async function getPublicHeroSlides() {
  const items = await ShowcaseItem.find({ type: SHOWCASE_TYPES.slide, is_active: true })
    .select("project_id display_image sort_order")
    .sort({ sort_order: 1, updated_at: -1 })
    .limit(100)
    .lean();

  const projectsMap = await fetchProjectsMap(items.map((item) => item.project_id));

  return items
    .map((item) => {
      const project = projectsMap.get(item.project_id.toString());
        if (!project || project.is_active === false) return null;
      return {
        slug: project.slug,
        title: project.title,
        name: project.name || "",
        image_1: getProjectCoverImage(project, item.display_image),
        project_url: projectToPublicPath(project.slug),
      };
    })
    .filter(Boolean);
}

module.exports = {
  SHOWCASE_TYPES,
  listShowcaseItems,
  createShowcaseItem,
  getShowcaseItemById,
  updateShowcaseItem,
  deleteShowcaseItem,
  getPublicHomeHighlights,
  getPublicHeroSlides,
};
