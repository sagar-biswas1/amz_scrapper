import { Page } from "puppeteer";
import BrowserFactory, { scrapeReviewData } from "./src/utils/crawler.ts";
import { saveData } from "./src/utils/saveData.js";
import * as path from "node:path";
import { scrapePage } from "./src/utils/bestSellerItemsCrawler.ts";
import { pageInfoCrawler } from "./src/utils/pageInfoCrawler.ts";

// // Returns: 'myfile.html')

(async () => {
  const browser = await BrowserFactory.getBrowser();

  const page: Page = await browser.newPage();
  // Navigate to the URL with error handling
  const url =
    "https://www.amazon.com/SEVEGO-Joggers-Lightweight-Sweatpants-Athletic/dp/B0CRHJ9DQZ?ref_=ast_sto_dp&th=1&psc=1";

  await page.setViewport({ width: 1280, height: 800 });

  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

  try {
   await pageInfoCrawler(page);
    const reviews = await scrapeReviewData(page);

    console.log(reviews);
    saveData(path.join(__dirname, "..", "data", "reviews.json"), reviews);
  } catch (error) {
    console.error("Error during crawling:", error);
  } finally {
    await browser.close();
  }
})();

// (async()=>{
//   const storeURL='https://www.amazon.com/stores/SEVEGO/page/F39FD0D5-16B2-4D94-8BF6-8202708FA4AA?ref_=ast_bln&store_ref=bl_ast_dp_brandLogo_sto'
//   const products= await  scrapePage(
//    storeURL
//   );
//   console.log(products)
//   await BrowserFactory.closeBrowser()
// })()

// process.on("exit", async () => {
//   await closeBrowserInstance();
// });
