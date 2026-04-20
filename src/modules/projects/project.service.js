const { Project } = require("./project.model");

function projectToPublicPath(slug) {
  return `/pages/project/${slug}.html`;
}

async function listProjects(query) {
  const { page, limit, search, is_home_visible, is_slide_visible } = query;
  const filter = {};

  if (typeof is_home_visible === "boolean") {
    filter.is_home_visible = is_home_visible;
  }
  if (typeof is_slide_visible === "boolean") {
    filter.is_slide_visible = is_slide_visible;
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Project.find(filter)
      .select("slug title short_description image_1 is_home_visible is_slide_visible updated_at")
      .sort({ updated_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Project.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => ({
      id: item._id.toString(),
      ...item,
    })),
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

async function createProject(payload) {
  const created = await Project.create(payload);
  return created._id.toString();
}

async function getProjectById(id) {
  const item = await Project.findById(id).lean();
  if (!item) {
    return null;
  }
  return { id: item._id.toString(), ...item };
}

async function updateProject(id, payload) {
  const updated = await Project.findByIdAndUpdate(id, payload, { new: true }).lean();
  if (!updated) {
    return null;
  }
  return { id: updated._id.toString(), ...updated };
}

async function updateProjectDisplay(id, payload) {
  const updated = await Project.findByIdAndUpdate(
    id,
    { is_home_visible: payload.is_home_visible, is_slide_visible: payload.is_slide_visible },
    { new: true }
  ).lean();
  if (!updated) {
    return null;
  }
  return {
    id: updated._id.toString(),
    is_home_visible: updated.is_home_visible,
    is_slide_visible: updated.is_slide_visible,
  };
}

async function getHomeProjects() {
  const items = await Project.find({ is_home_visible: true })
    .select("slug title short_description image_1")
    .sort({ updated_at: -1 })
    .limit(100)
    .lean();

  return items.map((item) => ({
    slug: item.slug,
    title: item.title,
    short_description: item.short_description,
    image_1: item.image_1,
    project_url: projectToPublicPath(item.slug),
  }));
}

async function getSlideProjects() {
  const items = await Project.find({ is_slide_visible: true })
    .select("slug title image_1")
    .sort({ updated_at: -1 })
    .limit(100)
    .lean();

  return items.map((item) => ({
    slug: item.slug,
    title: item.title,
    image_1: item.image_1,
    project_url: projectToPublicPath(item.slug),
  }));
}

async function getProjectDetailBySlug(slug) {
  const item = await Project.findOne({ slug })
    .select("slug title short_description content banner_image banner_title banner_subtitle image_1 image_rows")
    .lean();
  if (!item) {
    return null;
  }
  return item;
}

async function getOtherProjects(slug, limit = 6) {
  const items = await Project.find({ slug: { $ne: slug } })
    .select("slug title short_description image_1")
    .sort({ updated_at: -1 })
    .limit(limit)
    .lean();

  return items.map((item) => ({
    slug: item.slug,
    title: item.title,
    short_description: item.short_description,
    image_1: item.image_1,
    project_url: projectToPublicPath(item.slug),
  }));
}

module.exports = {
  listProjects,
  createProject,
  getProjectById,
  updateProject,
  updateProjectDisplay,
  getHomeProjects,
  getSlideProjects,
  getProjectDetailBySlug,
  getOtherProjects,
};
