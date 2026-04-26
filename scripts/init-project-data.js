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
  shortDescription,
  content,
  bannerTitle,
  bannerSubtitle,
  bannerImage,
  image1,
  imageRows,
  isHomeVisible,
  isSlideVisible,
}) {
  return {
    slug,
    title,
    short_description: shortDescription,
    content,
    banner_image: bannerImage,
    banner_title: bannerTitle,
    banner_subtitle: bannerSubtitle,
    image_1: image1,
    image_rows: imageRows,
    is_home_visible: isHomeVisible,
    is_slide_visible: isSlideVisible,
  };
}

function row(layout, ratio, ...urls) {
  return {
    layout,
    ratio,
    images: urls.map((url) => ({ url, crop_ratio: ratio, crop_mode: "preset" })),
  };
}

function buildProjectsData() {
  return [
    buildProject({
      slug: "ana-mandara-villas-dalat",
      title: "RESORT & SPA ANA MANDARA VILLAS",
      shortDescription: "Ana Mandara Villas Da Lat - resort & spa visual story.",
      content:
        "Tucked among pine-covered hills and winding stone paths, Ana Mandara Villas Da Lat is one of the few places where the soul of old Da Lat quietly endures. Built between the 1920s and 1930s, the seventeen villas reflect a time when the French colonial administration envisioned this mountain town as the future heart of Indochina.",
      bannerTitle: "RESORT & SPA",
      bannerSubtitle: "ANA MANDARA VILLAS",
      bannerImage: "/uploads/default/ana-mandara/5.webp",
      image1: "/uploads/default/ana-mandara/5.webp",
      imageRows: [
        row(2, "4:3", "/uploads/default/ana-mandara/2.webp", "/uploads/default/ana-mandara/4.webp"),
        row(2, "4:3", "/uploads/default/ana-mandara/3.webp", "/uploads/default/ana-mandara/1.webp"),
      ],
      isHomeVisible: true,
      isSlideVisible: true,
    }),
    buildProject({
      slug: "binh-an-village-dalat",
      title: "RESORT BINH AN VILLAGE",
      shortDescription: "Binh An Village Da Lat visual highlights.",
      content:
        "With an idyllic location on Vietnam's culturally rich central coast, this luxury five-star resort offers a portal to extraordinary heritage destinations and peaceful villa experiences.",
      bannerTitle: "RESORT",
      bannerSubtitle: "BINH AN VILLAGE",
      bannerImage: "/uploads/default/binh-an/1.webp",
      image1: "/uploads/default/binh-an/1.webp",
      imageRows: [
        row(2, "4:3", "/uploads/default/binh-an/2.webp", "/uploads/default/binh-an/3.webp"),
        row(2, "3:4", "/uploads/default/binh-an/4.webp", "/uploads/default/binh-an/5.webp"),
      ],
      isHomeVisible: true,
      isSlideVisible: true,
    }),
    buildProject({
      slug: "four-seasons-resort-the-nam-hai",
      title: "Four Seasons Resort The Nam Hai",
      shortDescription: "Cinematic hospitality storytelling.",
      content:
        "Nestled along Vietnam's culturally rich central coast, Four Seasons Resort The Nam Hai is a sanctuary of barefoot luxury and soulful discovery. Every moment invites reconnection with loved ones, with heritage, and with the rhythms of nature.",
      bannerTitle: "Four seasons resort",
      bannerSubtitle: "The nam hai",
      bannerImage: "/uploads/default/four-seasons-resort-the-nam-hai/1.webp",
      image1: "/uploads/default/four-seasons-resort-the-nam-hai/1.webp",
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
      title: "Resort & Spa Renaissance",
      shortDescription: "Architectural details and guest journey focus.",
      content:
        "Bathed in the amber hush of twilight, the resort glows with the romance of sun-warmed walls and sea-kissed air. Each meal and each frame becomes part of a quiet poetry by the shoreline.",
      bannerTitle: "RESORT & SPA",
      bannerSubtitle: "RENAISSANCE",
      bannerImage: "/uploads/default/marriott-renaissance-hoi-an/1.webp",
      image1: "/uploads/default/marriott-renaissance-hoi-an/1.webp",
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
      slug: "mercure-hotel-vung-tau",
      title: "HOTEL MERCURE VUNG TAU",
      shortDescription: "Mercure Vung Tau hotel visual set.",
      content:
        "Bathed in the amber hush of twilight, Mercure Vung Tau glows with the romance of sea-kissed air. The project captures architecture, dining ambiance, and coastal moments in one visual narrative.",
      bannerTitle: "HOTEL",
      bannerSubtitle: "MERCURE VUNG TAU",
      bannerImage: "/uploads/default/mercure-hotel/1.webp",
      image1: "/uploads/default/mercure-hotel/1.webp",
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
