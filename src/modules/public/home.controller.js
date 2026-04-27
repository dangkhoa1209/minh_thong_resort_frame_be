const Joi = require("joi");
const fs = require("fs/promises");
const path = require("path");
const { getProjectDetailBySlug, getOtherProjects, listPublicProjects } = require("../projects/project.service");
const { getPublicHomeHighlights, getPublicHeroSlides } = require("../showcase/showcase.service");

const projectDetailHtmlPath = path.join(
  process.env.PUBLIC_SITE_ROOT || path.resolve(__dirname, "../../../../minh_thong_resort_frame"),
  "pages/project/project-detail.html"
);

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function stripHtml(value) {
  return String(value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function escapeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function getPublicOrigin(req) {
  const forwardedProto = String(req.get("x-forwarded-proto") || "").split(",")[0].trim();
  const proto = forwardedProto || req.protocol;
  return `${proto}://${req.get("host")}`;
}

function toAbsoluteUrl(req, value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const normalized = raw.startsWith("/") ? raw : `/${raw}`;
  return `${getPublicOrigin(req)}${normalized}`;
}

function replaceTag(html, matcher, replacement) {
  if (matcher.test(html)) {
    return html.replace(matcher, replacement);
  }
  return html.replace("</head>", `${replacement}\n</head>`);
}

function injectProjectMeta(html, data, req) {
  const titleText = [data.title, data.name].filter(Boolean).join(" | ") || "Resort Project";
  const fullTitle = `${titleText} | Abel Dang Production`;
  const summary = stripHtml(data.short_description || data.content);
  const location = data.location ? ` in ${data.location}` : "";
  const year = data.year ? ` (${data.year})` : "";
  const description =
    summary ||
    `Project ${titleText}${location}${year} by Abel Dang Production, specializing in premium resort and hotel photography.`;
  const canonicalUrl = `${getPublicOrigin(req)}${req.originalUrl}`;
  const imageUrl = toAbsoluteUrl(req, data.banner_image || data.image_1);
  const safeTitle = escapeHtml(fullTitle);
  const safeDescription = escapeHtml(description);
  const safeCanonicalUrl = escapeHtml(canonicalUrl);
  const safeImageUrl = escapeHtml(imageUrl);
  const schema = escapeJsonLd({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: titleText,
    description,
    url: canonicalUrl,
    creator: {
      "@type": "Organization",
      name: "Abel Dang Production",
    },
    image: imageUrl || undefined,
    datePublished: data.year ? String(data.year) : undefined,
  });

  let nextHtml = html;
  nextHtml = nextHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);
  nextHtml = replaceTag(nextHtml, /<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${safeDescription}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${safeTitle}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${safeDescription}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${safeCanonicalUrl}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${safeTitle}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${safeDescription}" />`);
  nextHtml = replaceTag(nextHtml, /<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${safeCanonicalUrl}" />`);
  if (safeImageUrl) {
    nextHtml = replaceTag(nextHtml, /<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${safeImageUrl}" />`);
    nextHtml = replaceTag(nextHtml, /<meta\s+name=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${safeImageUrl}" />`);
  }
  nextHtml = nextHtml.replace(
    /<script\s+type=["']application\/ld\+json["']\s+id=["']project-schema["']>[\s\S]*?<\/script>/i,
    `<script type="application/ld+json" id="project-schema">${schema}</script>`
  );

  return nextHtml;
}

async function getHomeProjectsController(_req, res, next) {
  try {
    const data = await getPublicHomeHighlights();
    return res.json({ success: true, data, message: "OK" });
  } catch (error) {
    return next(error);
  }
}

async function getSlideProjectsController(_req, res, next) {
  try {
    const data = await getPublicHeroSlides();
    return res.json({ success: true, data, message: "OK" });
  } catch (error) {
    return next(error);
  }
}

async function getPublicProjectsController(req, res, next) {
  try {
    const { value } = Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(50).default(6),
    }).validate(req.query, { stripUnknown: true });

    const data = await listPublicProjects(value);
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

async function renderProjectDetailPageController(req, res, next) {
  try {
    const { error, value } = Joi.object({
      slug: Joi.string().pattern(/^[a-z0-9-]+$/).required(),
    }).validate(req.query, { stripUnknown: true });
    if (error) {
      return res.status(400).send("Missing or invalid project slug");
    }

    const data = await getProjectDetailBySlug(value.slug);
    if (!data) {
      return res.status(404).send("Project not found");
    }

    const html = await fs.readFile(projectDetailHtmlPath, "utf8");
    return res
      .type("html")
      .set("Cache-Control", "public, max-age=300")
      .send(injectProjectMeta(html, data, req));
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
  getPublicProjectsController,
  getProjectBySlugController,
  renderProjectDetailPageController,
  getOtherProjectsController,
};
