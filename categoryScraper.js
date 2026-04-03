import { chromium } from "playwright";

export default async function scrapeCategories() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.myntra.com", {
    waitUntil: "domcontentloaded",
  });

  await page.waitForTimeout(4000);

  const links = await page.$$eval("a", (anchors) =>
    anchors
      .map((a) => ({
        text: a.textContent?.trim(),
        href: a.href,
      }))
      .filter(
        (item) =>
          item.text &&
          item.href &&
          item.href.includes("myntra.com") &&
          !item.href.includes("account") &&
          !item.href.includes("help") &&
          !item.href.includes("contact") &&
          !item.href.includes("giftcard") &&
          !item.href.includes("orders")
      )
  );

  // remove duplicates
  const unique = Array.from(
    new Map(links.map((item) => [item.href, item])).values()
  );

  console.log("FILTERED LINKS:", unique.length);

  await browser.close();

  return unique;
}