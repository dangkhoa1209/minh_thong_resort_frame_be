require("dotenv").config();
const { connectDatabase } = require("../src/config/database");
const { Setting } = require("../src/modules/settings/setting.model");
const { Project } = require("../src/modules/projects/project.model");

const contactData = {
  company_name: "Abel Dang Production",
  email: "contact@example.com",
  phone: "+84 901 234 567",
  address: "Hoi An, Quang Nam, Vietnam",
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  website: "https://example.com",
};

const logoData = {
  logo_url: "/uploads/default/banner/Asset 1610.svg",
};

function buildProject({
  slug,
  title,
  name,
  location,
  year,
  content,
  bannerImage,
  imageRows,
  isHomeVisible,
  isSlideVisible,
}) {
  return {
    slug,
    title,
    name,
    location,
    year,
    short_description: title,
    content,
    banner_image: bannerImage,
    banner_title: title,
    banner_subtitle: name,
    image_1: bannerImage,
    image_rows: imageRows,
    is_home_visible: isHomeVisible,
    is_slide_visible: isSlideVisible,
  };
}

function row(layout, ratio, ...urls) {
  return {
    layout,
    ratio,
    images: urls.map((url) => ({ url, crop_ratio: "", crop_mode: "free" })),
  };
}

function buildProjectsData() {
  return [
    buildProject({
      slug: "ana-mandara-villas-dalat",
      title: "RESORT & SPA",
      name: "ANA MANDARA VILLAS",
      location: "Da Lat, Vietnam",
      year: "2024",
      content:
        "Tucked among pine-covered hills and winding stone paths, Ana Mandara Villas Da Lat is one of the few places where the soul of old Da Lat quietly endures. Built between the 1920s and 1930s, the seventeen villas reflect a time when the French colonial administration envisioned this mountain town as the future heart of Indochina. Each villa tells a different story, shaped by distinct architectural influences, from Normandie to Provence, honoring the original design principle that no two homes should be the same. Inside, old fireplaces, wooden shutters, high ceilings, and gently worn staircases evoke the charm of a forgotten French film set high in the Central Highlands.",
      bannerImage: "/uploads/default/ana-mandara/5.webp",
      imageRows: [
        row(2, "4:3", "/uploads/default/ana-mandara/2.webp", "/uploads/default/ana-mandara/4.webp"),
        row(2, "4:3", "/uploads/default/ana-mandara/3.webp", "/uploads/default/ana-mandara/1.webp"),
      ],
      isHomeVisible: true,
      isSlideVisible: true,
    }),
    buildProject({
      slug: "binh-an-village-dalat",
      title: "RESORT",
      name: "BINH AN VILLAGE",
      location: "Da Lat, Vietnam",
      year: "2024",
      content:
        "With an idyllic location on Vietnam's culturally rich central coast, our luxury Five-Star beach Resort offers a portal to three extraordinary UNESCO World Heritage sites and a breezy respite on the country's most elebrated beach. You'll have a chance to reconnect with your loved ones - whether you take to the East Sea by kayak, explore the glory of imperial Hue or simply savour quiet moments in your own tranquil villa at our luxury Resort in Hoi An, Vietnam.",
      bannerImage: "/uploads/default/binh-an/1.webp",
      imageRows: [
        row(2, "4:3", "/uploads/default/binh-an/2.webp", "/uploads/default/binh-an/3.webp"),
        row(2, "3:4", "/uploads/default/binh-an/4.webp", "/uploads/default/binh-an/5.webp"),
      ],
      isHomeVisible: true,
      isSlideVisible: true,
    }),
    buildProject({
      slug: "four-seasons-resort-the-nam-hai",
      title: "Four seasons resort",
      name: "The nam hai",
      location: "Hoi An, Viet Nam",
      year: "2024",
      content:
        "Nestled along Vietnam's culturally rich central coast, Four Seasons Resort The Nam Hai is a sanctuary of barefoot luxury and soulful discovery. Set on the nation's most celebrated stretch of shoreline, the resort offers a gateway to three UNESCO World Heritage sites, Hoi An Ancient Town, the Imperial City of Hue, and the sacred ruins of My Son. Whether gliding across the East Sea by kayak, tracing history's footsteps through imperial cities, or savoring stillness in your own private villa, every moment invites reconnection with loved ones, with heritage, and with the rhythms of nature.",
      bannerImage: "/uploads/default/four-seasons-resort-the-nam-hai/1.webp",
      imageRows: [
        row(2, "3:4", "/uploads/default/four-seasons-resort-the-nam-hai/2.webp", "/uploads/default/four-seasons-resort-the-nam-hai/3.webp"),
        row(1, "3:4", "/uploads/default/four-seasons-resort-the-nam-hai/4.webp"),
        row(1, "16:9", "/uploads/default/four-seasons-resort-the-nam-hai/5.webp"),
        row(2, "4:3", "/uploads/default/four-seasons-resort-the-nam-hai/6.webp", "/uploads/default/four-seasons-resort-the-nam-hai/7.webp"),
        row(2, "4:3", "/uploads/default/four-seasons-resort-the-nam-hai/8.webp", "/uploads/default/four-seasons-resort-the-nam-hai/9.webp"),
        row(2, "4:3", "/uploads/default/four-seasons-resort-the-nam-hai/10.webp", "/uploads/default/four-seasons-resort-the-nam-hai/11.webp"),
        row(1, "16:9", "/uploads/default/four-seasons-resort-the-nam-hai/12.webp"),
        row(2, "4:3", "/uploads/default/four-seasons-resort-the-nam-hai/13.webp", "/uploads/default/four-seasons-resort-the-nam-hai/14.webp"),
      ],
      isHomeVisible: true,
      isSlideVisible: true,
    }),
    buildProject({
      slug: "marriott-renaissance-hoi-an",
      title: "RESORT & SPA",
      name: "RENAISSANCE",
      location: "Hoi An, Viet Nam",
      year: "2024",
      content:
        "Bathed in the amber hush of twilight, the resort glows with the romance of sun warmed walls and sea kissed air. From the edge of the infinity pool, time lingers as the sky blushes over Nghinh Phong Cape and the rhythm of the city softens into a gentle hush. Just steps from the shoreline, the open-air seafood restaurant welcomes guests to dine beneath swaying palms and an open sky. As twilight deepens, every meal becomes part of the poetry, the kind written slowly, with salt on the breeze and the hush of water nearby.",
      bannerImage: "/uploads/default/marriott-renaissance-hoi-an/1.webp",
      imageRows: [
        row(2, "4:3", "/uploads/default/marriott-renaissance-hoi-an/2.webp", "/uploads/default/marriott-renaissance-hoi-an/3.webp"),
        row(1, "16:9", "/uploads/default/marriott-renaissance-hoi-an/4.webp"),
        row(2, "4:3", "/uploads/default/marriott-renaissance-hoi-an/5.webp", "/uploads/default/marriott-renaissance-hoi-an/6.webp"),
        row(2, "4:3", "/uploads/default/marriott-renaissance-hoi-an/7.webp", "/uploads/default/marriott-renaissance-hoi-an/8.webp"),
        row(2, "4:3", "/uploads/default/marriott-renaissance-hoi-an/9.webp", "/uploads/default/marriott-renaissance-hoi-an/10.webp"),
        row(2, "855:1068", "/uploads/default/marriott-renaissance-hoi-an/11.jpg", "/uploads/default/marriott-renaissance-hoi-an/12.jpg"),
        row(2, "4:3", "/uploads/default/marriott-renaissance-hoi-an/13.jpg", "/uploads/default/marriott-renaissance-hoi-an/14.jpg"),
      ],
      isHomeVisible: true,
      isSlideVisible: true,
    }),
    buildProject({
      slug: "pear-hoi-an",
      title: "RESORT citadines",
      name: "PEARL HOI AN",
      location: "Hoi An, Viet Nam",
      year: "2024",
      content:
        "Carved like a brushstroke across Cua Dai's golden shore, the pool ripples in sculptural curves, wrapped in the shadows of coconut trees and morning light. Local stone and pale wood lend the space a quiet strength, softened by the hush of sea breeze. This is a tranquil canvas where architecture flows with the tide, and every moment reflects the rhythm of the coast. Inside, sunlight filters through sheer linen drapes, casting soft silhouettes on sand toned interiors. Each suite opens to wide horizons, where the sea is never out of sight and serenity is always within reach. Steps away, Hoi An's cultural tapestry unfolds silk lanterns, ancestral temples, and the enduring art of the handmade. At Citadines Pearl, modern ease lives in harmony with the timeless soul of Vietnam's central coast.",
      bannerImage: "/uploads/default/pear-hoi-an/1.webp",
      imageRows: [
        row(2, "4:3", "/uploads/default/pear-hoi-an/2.webp", "/uploads/default/pear-hoi-an/3.webp"),
        row(1, "16:9", "/uploads/default/pear-hoi-an/4.webp"),
        row(2, "4:5", "/uploads/default/pear-hoi-an/5.webp", "/uploads/default/pear-hoi-an/6.webp"),
        row(1, "16:9", "/uploads/default/pear-hoi-an/7.webp"),
        row(2, "4:3", "/uploads/default/pear-hoi-an/8.webp", "/uploads/default/pear-hoi-an/9.webp"),
        row(2, "4:3", "/uploads/default/pear-hoi-an/10.webp", "/uploads/default/pear-hoi-an/11.webp"),
        row(1, "16:9", "/uploads/default/pear-hoi-an/14.webp"),
        row(2, "4:3", "/uploads/default/pear-hoi-an/15.jpg", "/uploads/default/pear-hoi-an/16.webp"),
        row(2, "4:3", "/uploads/default/pear-hoi-an/17.webp", "/uploads/default/pear-hoi-an/18.jpg"),
        row(2, "4:3", "/uploads/default/pear-hoi-an/19.jpg", "/uploads/default/pear-hoi-an/20.jpg"),
      ],
      isHomeVisible: true,
      isSlideVisible: true,
    }),
    buildProject({
      slug: "mercure-hotel-vung-tau",
      title: "HOTEL",
      name: "MERCURE VUNG TAU",
      location: "Vung Tau, Vietnam",
      year: "2024",
      content:
        "Bathed in the amber hush of twilight, the resort glows with the romance of sun warmed walls and sea kissed air. From the edge of the infinity pool, time lingers as the sky blushes over Nghinh Phong Cape and the rhythm of the city softens into a gentle hush. Just steps from the shoreline, the open-air seafood restaurant welcomes guests to dine beneath swaying palms and an open sky. As twilight deepens, every meal becomes part of the poetry, the kind written slowly, with salt on the breeze and the hush of water nearby.",
      bannerImage: "/uploads/default/mercure-hotel/1.webp",
      imageRows: [
        row(2, "4:3", "/uploads/default/mercure-hotel/2.webp", "/uploads/default/mercure-hotel/3.webp"),
        row(1, "16:9", "/uploads/default/mercure-hotel/4.webp"),
      ],
      isHomeVisible: true,
      isSlideVisible: true,
    }),
  ];
}

async function upsertSettings() {
  await Setting.bulkWrite(
    [
      {
        updateOne: {
          filter: { key: "logo_active" },
          update: { $set: { value: logoData } },
          upsert: true,
        },
      },
      {
        updateOne: {
          filter: { key: "contact_info" },
          update: { $set: { value: contactData } },
          upsert: true,
        },
      },
    ],
    { ordered: false }
  );
}

async function upsertProjects(projectsData) {
  const allowedSlugs = projectsData.map((item) => item.slug);

  await Project.bulkWrite(
    projectsData.map((payload) => ({
      updateOne: {
        filter: { slug: payload.slug },
        update: { $set: payload },
        upsert: true,
      },
    })),
    { ordered: false }
  );

  await Project.updateMany(
    { slug: { $nin: allowedSlugs } },
    { $set: { is_home_visible: false, is_slide_visible: false } }
  );
}

async function run() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("Please set MONGO_URI");
  }

  await connectDatabase(mongoUri);
  const projectsData = buildProjectsData();
  await upsertSettings();
  await upsertProjects(projectsData);

  console.log("Init project data completed");
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
