import "dotenv/config";
import { connectDB } from "./db.js";
import scrapeCategories from "./categoryScraper.js";
import scrapeProducts from "./scraper.js";

const MODE = "products"; // 👉 change to "categories" or "products"

function structureCategories(links) {
  const map = {};

  links.forEach((item) => {
    const url = item.href;
    const match = url.match(/myntra\.com\/(men|women|kids|home|beauty)/i);

    if (!match) return;

    const mainCategory = match[1].toLowerCase();

    if (!map[mainCategory]) {
      map[mainCategory] = {
        category: mainCategory,
        subcategories: [],
      };
    }

    map[mainCategory].subcategories.push({
      name: item.text,
      url: item.href,
    });
  });

  return Object.values(map);
}

function getRandomSubcategory(categories) {
  const validCategories = categories.filter(
    (cat) => cat.subcategories && cat.subcategories.length > 0,
  );

  const randomCategory =
    validCategories[Math.floor(Math.random() * validCategories.length)];

  const randomSub =
    randomCategory.subcategories[
      Math.floor(Math.random() * randomCategory.subcategories.length)
    ];

  return {
    category: randomCategory.category,
    subcategory: randomSub.name,
    url: randomSub.url,
  };
}

(async () => {
  try {
    const db = await connectDB();

    // 🔹 PHASE 1
    if (MODE === "categories") {
      const links = await scrapeCategories();
      const structured = structureCategories(links);

      await db.collection("categories").deleteMany({});
      await db.collection("categories").insertMany(structured);

      console.log("✅ Categories saved");
    }

    // 🔹 PHASE 2
    if (MODE === "products") {
      const categories = await db.collection("categories").find().toArray();

      if (!categories.length) {
        throw new Error("Run MODE='categories' first");
      }

      const selected = getRandomSubcategory(categories);

      console.log("Selected:", selected);

      const products = await scrapeProducts(selected.url);

      console.log("Scraped:", products.length);

      await db.collection("products").insertMany(
        products.map((p) => ({
          ...p,
          category: selected.category,
          subcategory: selected.subcategory,
        })),
      );

      console.log("✅ Products saved");
    }
  } catch (err) {
    console.error("ERROR:", err);
  }
})();
