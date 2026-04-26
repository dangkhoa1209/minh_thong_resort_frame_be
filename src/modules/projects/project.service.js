const { Project } = require("./project.model");

function projectToPublicPath(slug) {
  return `/pages/project/${slug}.html`;
}

async function listProjects(query) {
  const { page, limit, search } = query;
  const filter = {};
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Project.find(filter)
      .select("slug title short_description image_1 updated_at")
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
  const updated = await Project.findByIdAndUpdate(id, payload, { returnDocument: "after" }).lean();
  if (!updated) {
    return null;
  }
  return { id: updated._id.toString(), ...updated };
}

async function deleteProject(id) {
  const deleted = await Project.findByIdAndDelete(id).lean();
  if (!deleted) {
    return null;
  }
  return { id: deleted._id.toString() };
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
  deleteProject,
  getProjectDetailBySlug,
  getOtherProjects,
};
