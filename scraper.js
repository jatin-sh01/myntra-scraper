import { chromium } from "playwright";

export default async function scrapeProducts(url) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // open page
  await page.goto(url);

  // wait a bit (important for anti-bot)
  await page.waitForTimeout(3000);

  // scroll to load products
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(2000 + Math.random() * 2000);
  }

  // extract products
  const products = await page.$$eval(".product-base", items =>
    items.slice(0, 50).map(item => ({
      name: item.querySelector(".product-product")?.innerText,
      brand: item.querySelector(".product-brand")?.innerText,
      price: item.querySelector(".product-discountedPrice")?.innerText,
      link: item.querySelector("a")?.href,
      image: item.querySelector("img")?.src
    }))
  );

  await browser.close();

  return products;
}