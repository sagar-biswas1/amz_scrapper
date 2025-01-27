import { Page } from "puppeteer";
import BrowserFactory, { scrapeReviewData } from "./src/utils/crawler.ts";
import { saveData } from "./src/utils/saveData.js";
import * as path from "node:path";

// Returns: 'myfile.html')
(async () => {
  // Navigate to the URL with error handling
  const url =
    "https://www.amazon.com/Futricy-Beginner-Traveler-Emergency-Accessories/dp/B0BXKB7QF6/ref=zg_bs_c_arts-crafts_d_sccl_5/134-8915425-9255066?pd_rd_w=bj2iY&content-id=amzn1.sym.7379aab7-0dd8-4729-b0b5-2074f1cb413d&pf_rd_p=7379aab7-0dd8-4729-b0b5-2074f1cb413d&pf_rd_r=R93HJYDRQJCFH1SM4JKV&pd_rd_wg=Hg0ao&pd_rd_r=9b45083c-4743-4eab-9265-32b4e24dec9c&pd_rd_i=B0BXKB7QF6&th=1";
  const browser = await BrowserFactory.getBrowser();
  console.log(browser);

  const page: Page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

  try {
    const reviews = await scrapeReviewData(page);

    console.log(reviews);
    saveData(path.join(__dirname, "..", "data", "reviews.json"), reviews);
  } catch (error) {
    console.error("Error during crawling:", error);
  } finally {
    // await browser.close();
  }
})();

// process.on("exit", async () => {
//   await closeBrowserInstance();
// });
