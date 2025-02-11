import BrowserFactory from "./page";
import * as path from "node:path";
import fs from "fs";

export async function scrapePage(url: string): Promise<{ title: string; link: string; }[]>  {
  const page = await BrowserFactory.getNewPage(); // Get a new page
  try {
    console.log(`Navigating to ${url}`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await page.setViewport({ width: 2000, height: 800 });
    const title = await page.title();
    console.log(`Page Title: ${title}`);

    await page.waitForSelector(
      '[data-testid="navigation"] [data-click-type="OTHER"]:last-child'
    );
    await page.click(
      '[data-testid="navigation"] [data-click-type="OTHER"]:last-child'
    );

    await page.waitForSelector('.enter-done[aria-label="Navigation List"]');

    const pageLinks = await page.evaluate(async () => {
      const links:string[] = [];
      const allLinksNode = document
        .querySelector('.enter-done[aria-label="Navigation List"]')
        ?.querySelectorAll("a");
      allLinksNode?.forEach((item) => {
        links.push(item?.href);
      });

      return links;
    });
    console.log(pageLinks);
    await page.screenshot({
      path: path.join(__dirname, "..", "..", "screenshots", "menuitems.png"),
    });

    const productPageDetailsLinks: { title: string; link: string }[] = [];

    const slicedPageLinks= pageLinks.slice(0,3)
    for (let i = 0; i < slicedPageLinks.length; i++) {
      console.log(`Navigating to: ${pageLinks[i]}`);

      // Navigate to the link
      await page.goto(pageLinks[i], { waitUntil: "networkidle2" });

      // Perform scrolling
      await page.evaluate(() => {
        return new Promise<void>((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });

      
      const productsLinks = await page.evaluate(async () => {
        const productLinks: { title: string; link: string }[] = [];
        document
          .querySelectorAll('[data-testid="product-showcase-title"]')
          .forEach((item) => {
            const anchor = item as HTMLAnchorElement
            productLinks.push({
              title: anchor?.title,
              link: anchor?.href,
            });
          });

          return productLinks
      });
      productPageDetailsLinks.push(...productsLinks);
    }

   

    return productPageDetailsLinks
  } catch (error) {
    console.error("Error while scraping the page:", error);
    return []
  } finally {
    await page.close(); // Close the page when done
    BrowserFactory.closeBrowser()
    console.log("Page closed");

  }
}

