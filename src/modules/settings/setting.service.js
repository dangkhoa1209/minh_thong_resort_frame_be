const { Setting } = require("./setting.model");

async function getSettingValue(key, fallback = {}) {
  const item = await Setting.findOne({ key }).lean();
  return item ? item.value : fallback;
}

async function upsertSettingValue(key, value) {
  await Setting.updateOne(
    { key },
    { $set: { value } },
    { upsert: true }
  );
  return value;
}

module.exports = { getSettingValue, upsertSettingValue };
