const { Project } = require("./project.model");

function projectToPublicPath(slug) {
  return `/pages/project/${slug}.html`;
}

function getProjectCoverImage(item = {}) {
  return item.banner_image || item.image_1 || "";
}

function normalizeProjectPayload(payload = {}) {
  return {
    ...payload,
    image_1: payload.banner_image || payload.image_1 || "",
  };
}

async function listProjects(query) {
  const { page, limit, search } = query;
  const filter = {};
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Project.find(filter)
      .select("slug title name location year short_description banner_image image_1 updated_at")
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
      image_1: getProjectCoverImage(item),
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
  const created = await Project.create(normalizeProjectPayload(payload));
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
  const updated = await Project.findByIdAndUpdate(
    id,
    normalizeProjectPayload(payload),
    { returnDocument: "after" }
  ).lean();
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
    .select("slug title name location year short_description content banner_image banner_title banner_subtitle image_1 image_rows")
    .lean();
  if (!item) {
    return null;
  }
  return item;
}

async function getOtherProjects(slug, limit = 6) {
  const items = await Project.find({ slug: { $ne: slug } })
    .select("slug title name short_description banner_image image_1")
    .sort({ updated_at: -1 })
    .limit(limit)
    .lean();

  return items.map((item) => ({
    slug: item.slug,
    title: item.title,
    name: item.name || "",
    short_description: item.short_description,
    image_1: getProjectCoverImage(item),
    banner_image: getProjectCoverImage(item),
    project_url: projectToPublicPath(item.slug),
  }));
}

async function listPublicProjects(query) {
  const page = Number(query?.page || 1);
  const limit = Number(query?.limit || 6);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Project.find({})
      .select("slug title name location year short_description banner_image image_1 updated_at")
      .sort({ updated_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Project.countDocuments({}),
  ]);

  return {
    items: items.map((item) => {
      const cover = getProjectCoverImage(item);
      return {
        slug: item.slug,
        title: item.title,
        name: item.name || "",
        location: item.location || "",
        year: item.year || "",
        short_description: item.short_description || "",
        banner_image: cover,
        image_1: cover,
        project_url: projectToPublicPath(item.slug),
        updated_at: item.updated_at,
      };
    }),
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

module.exports = {
  listProjects,
  listPublicProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectDetailBySlug,
  getOtherProjects,
};
