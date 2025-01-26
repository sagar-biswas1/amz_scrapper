import { launchBrowser, scrapeGroupData } from "./crawler.ts";
import { saveData } from "./utils.js";
import * as path from 'node:path';

// Returns: 'myfile.html')
(async () => {
  const { browser, page } = await launchBrowser();

  try {
    const reviews = await scrapeGroupData(page);

    console.log(reviews);
    saveData(path.join(__dirname,"..", 'data', 'reviews.json'), reviews);
  } catch (error) {
    console.error("Error during crawling:", error);
  } finally {
    await browser.close();
  }
})();
