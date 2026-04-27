const { Project } = require("./project.model");

const PROJECT_STATIC_SLUG_ALIASES = {
  "resort-spa-ana-mandara-villas": "ana-mandara-villas-dalat",
  "resort-binh-an-village": "binh-an-village-dalat",
  "four-seasons-resort-the-nam-hai": "four-seasons-resort-the-nam-hai",
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

function getProjectCoverImage(item = {}) {
  return item.banner_image || item.image_1 || "";
}

function normalizeProjectPayload(payload = {}) {
  const normalized = {
    ...payload,
    image_1: payload.banner_image || payload.image_1 || "",
  };
  if (Object.prototype.hasOwnProperty.call(payload, "is_active")) {
    normalized.is_active = payload.is_active !== false;
  }
  return normalized;
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
      .select("slug title name location year short_description banner_image image_1 is_active updated_at")
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Project.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => ({
      id: item._id.toString(),
      ...item,
      is_active: item.is_active !== false,
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

async function updateProjectActive(id, isActive) {
  const updated = await Project.findByIdAndUpdate(
    id,
    { is_active: isActive !== false },
    { returnDocument: "after" }
  )
    .select("is_active")
    .lean();
  if (!updated) {
    return null;
  }
  return {
    id: updated._id.toString(),
    is_active: updated.is_active !== false,
  };
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
    .select("slug title name location year short_description content banner_image banner_title banner_subtitle image_1 image_rows is_active")
    .lean();
  if (!item || item.is_active === false) {
    return null;
  }
  return item;
}

async function getOtherProjects(slug, limit = 6) {
  const items = await Project.find({ slug: { $ne: slug }, is_active: { $ne: false } })
    .select("slug title name short_description banner_image image_1 is_active")
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
    Project.find({ is_active: { $ne: false } })
      .select("slug title name location year short_description banner_image image_1 updated_at is_active")
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Project.countDocuments({ is_active: { $ne: false } }),
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
  updateProjectActive,
  deleteProject,
  getProjectDetailBySlug,
  getOtherProjects,
};
