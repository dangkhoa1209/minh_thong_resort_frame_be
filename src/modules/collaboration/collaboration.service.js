const { Collaboration } = require("./collaboration.model");
const { Setting } = require("../settings/setting.model");

const DEFAULT_SCOPE = "default";
const LEGACY_SETTING_KEY = "collaboration_images";

async function migrateLegacyIfNeeded() {
  const existing = await Collaboration.findOne({ scope: DEFAULT_SCOPE }).lean();
  if (existing) return existing;

  const legacy = await Setting.findOne({ key: LEGACY_SETTING_KEY }).lean();
  const legacyImages = Array.isArray(legacy?.value?.images) ? legacy.value.images : [];

  if (legacyImages.length > 0) {
    const doc = await Collaboration.findOneAndUpdate(
      { scope: DEFAULT_SCOPE },
      { $set: { images: legacyImages } },
      { upsert: true, new: true }
    ).lean();
    return doc;
  }

  return null;
}

async function getCollaborationValue() {
  const migrated = await migrateLegacyIfNeeded();
  if (migrated) {
    return {
      title: String(migrated.title || "").trim(),
      subtitle: String(migrated.subtitle || "").trim(),
      content: String(migrated.content || "").trim(),
      images: Array.isArray(migrated.images) ? migrated.images : [],
    };
  }

  const item = await Collaboration.findOne({ scope: DEFAULT_SCOPE }).lean();
  return {
    title: String(item?.title || "").trim(),
    subtitle: String(item?.subtitle || "").trim(),
    content: String(item?.content || "").trim(),
    images: Array.isArray(item?.images) ? item.images : [],
  };
}

async function upsertCollaborationValue(value) {
  const title = String(value?.title || "").trim();
  const subtitle = String(value?.subtitle || "").trim();
  const content = String(value?.content || "").trim();
  const images = Array.isArray(value?.images) ? value.images : [];
  await Collaboration.updateOne(
    { scope: DEFAULT_SCOPE },
    { $set: { title, subtitle, content, images } },
    { upsert: true }
  );
  return { title, subtitle, content, images };
}

module.exports = { getCollaborationValue, upsertCollaborationValue };
