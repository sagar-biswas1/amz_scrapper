import { Page } from "puppeteer";
import BrowserFactory, { scrapeReviewData } from "./src/utils/crawler.ts";

import * as path from "node:path";
import { scrapePage } from "./src/utils/bestSellerItemsCrawler.ts";
import { pageInfoCrawler } from "./src/utils/pageInfoCrawler.ts";
import { appendData } from "./src/utils/saveData.js";

// // Returns: 'myfile.html')

const collectDetails = async (url) => {
  const browser = await BrowserFactory.getBrowser();

  const page: Page = await browser.newPage();
  // Navigate to the URL with error handling

  await page.setViewport({ width: 1280, height: 800 });

  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

  try {
    await pageInfoCrawler(page);
    const reviews = await scrapeReviewData(page, url);

    console.log(reviews);
    appendData(path.join(__dirname, "..", "data", "reviews.json"), reviews);
  } catch (error) {
    console.error("Error during crawling:", error);
  } finally {
    await browser.close();
  }
};

// collectDetails('https://www.amazon.com/Futricy-Beginner-Traveler-Emergency-Accessories/dp/B0BXKB7QF6/ref=zg_bs_c_arts-crafts_d_sccl_5/134-8915425-9255066?pd_rd_w=bj2iY&content-id=amzn1.sym.7379aab7-0dd8-4729-b0b5-2074f1cb413d&pf_rd_p=7379aab7-0dd8-4729-b0b5-2074f1cb413d&pf_rd_r=R93HJYDRQJCFH1SM4JKV&pd_rd_wg=Hg0ao&pd_rd_r=9b45083c-4743-4eab-9265-32b4e24dec9c&pd_rd_i=B0BXKB7QF6&th=1')

(async () => {
  const storeURL =
    "https://www.amazon.com/stores/Coquimbo/page/9E1432F5-45BE-4E2A-A652-F02E7B55204D?ref_=ast_bln&store_ref=bl_ast_dp_brandLogo_sto";
  const products = await scrapePage(storeURL);

  await Promise.all(products.map((product) => collectDetails(product.link)));

  await BrowserFactory.closeBrowser();
})();

// process.on("exit", async () => {
//   await closeBrowserInstance();
// });
