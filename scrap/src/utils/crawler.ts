import puppeteer, { Browser, Page } from "puppeteer";
import * as path from "node:path";
import fs from "fs";

// // Launch Puppeteer with authentication
// let browser: Browser | null = null;

// export async function launchBrowser(): Promise<Browser> {
//   try {
//     const dataDir = path.resolve("dataDir");

//     console.log("browser", browser);
//     // Clear dataDir if SingletonLock exists and the browser isn't running
//     // if (fs.existsSync(path.join(dataDir, "SingletonLock")) && !browser) {
//     //   console.warn("SingletonLock exists. Clearing dataDir...");
//     //   fs.rmSync(dataDir, { recursive: true, force: true });
//     // }
//     // Launch browser with proper options
//     if (!browser) {
//       browser = await puppeteer.launch({
//         userDataDir: "dataDir",
//         headless: process.env.HEADLESS === "true", // Dynamic headless mode
//         args: [
//           // "--no-sandbox",
//           // "--disable-setuid-sandbox",
//           // "--disable-dev-shm-usage",
//           // "--disable-gpu",
//           "--no-sandbox",
//           "--disable-setuid-sandbox",
//           "--disable-dev-shm-usage",
//           "--disable-gpu",
//           "--disable-extensions",
//           "--disable-features=InfiniteSessionRestore",
//           "--no-default-browser-check",
//         ],
//       });
//     }

//     return browser;
//   } catch (error) {
//     console.error("An error occurred:", error.message);
//     // if (browser) await browser.close();
//     throw error; // Re-throw error for upstream handling
//   }
// }

// export async function closeBrowserInstance(): Promise<void> {
//   if (browser) {
//     await browser.close();
//     browser = null;
//   }
// }



class BrowserFactory {
  private static instance: Browser | null = null;
  private static readonly dataDir = path.resolve("dataDir");
  private static readonly singletonLockPath = path.join(
    BrowserFactory.dataDir,
    "SingletonLock"
  );

  private constructor() {} // Prevent direct instantiation

  // Get or create the browser instance
  public static async getBrowser(): Promise<Browser> {
    // Clean stale SingletonLock if necessary
    if (fs.existsSync(BrowserFactory.singletonLockPath)) {
      console.warn("Stale SingletonLock detected. Removing...");
      fs.rmSync(BrowserFactory.singletonLockPath, { force: true });
    }

    // Create a new browser instance if it doesn't exist
    if (!BrowserFactory.instance) {
      BrowserFactory.instance = await puppeteer.launch({
        userDataDir: BrowserFactory.dataDir,
        headless: true, // process.env.HEADLESS === "true", // Toggle headless mode
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--disable-extensions",
          "--disable-features=InfiniteSessionRestore",
          "--no-default-browser-check",
        ],
      });

      console.log("Browser launched");
    }

    return BrowserFactory.instance;
  }

  // Close the browser instance
  public static async closeBrowser(): Promise<void> {
    if (BrowserFactory.instance) {
      await BrowserFactory.instance.close();
      BrowserFactory.instance = null;
      console.log("Browser closed");
    }
  }
}

export default BrowserFactory;



export async function scrapeReviewData(page) {
  try {
    const dialog = await page.waitForSelector('[role="alertdialog"]', {
      timeout: 5000, // Timeout for waiting
    });
    if (dialog) {
      await page.click('[data-action-type="DISMISS"]');
    }
  } catch (e) {
    console.log("No dialog detected or error handling dialog:", e.message);
  }

  try {
    // Wait for the dropdown label and click it
    await page.waitForSelector('[data-a-class="cm-cr-dp-filter-dropdown"]', {
      visible: true,
      timeout: 5000,
    });
    await page.click('[data-a-class="cm-cr-dp-filter-dropdown"]');

    // Wait for the dropdown option to appear and select the desired option
    await page.waitForSelector("#cm-cr-sort-dropdown_1", {
      visible: true,
      timeout: 5000,
    });
    await page.click("#cm-cr-sort-dropdown_1");

    // // Alternatively, wait for network idle (useful for loading API-driven content)
    // await page.waitForNetworkIdle({ idleTime: 1000 });
    await page.waitForSelector(
      '[data-hook="cr-widget-FocalReviews"] .a-row .a-spacing-medium .aok-hidden'
    );
    console.log("Content loaded successfully after sorting.");
  } catch (e) {
    console.log(e);
    console.error(
      "Error interacting with the sort dropdown or waiting for content:",
      e.message
    );
  }

  const reviews = await page.evaluate(() => {
    const reviewElements = document.querySelectorAll(
      '[data-hook="cr-widget-FocalReviews"] [data-hook="review"]'
    );
    return Array.from(reviewElements).map((element) => {
      const title = element
        .querySelector('[data-hook="review-title"]')
        ?.textContent?.trim();
      const rating = element
        .querySelector('[data-hook="review-star-rating"]')
        ?.textContent?.trim();
      const date = element
        .querySelector('[data-hook="review-date"]')
        ?.textContent?.trim();
      const body = element
        .querySelector('[data-hook="review-body"]')
        ?.textContent?.trim();

      return { title, rating, date, body };
    });
  });
  // Take a screenshot
  await page.screenshot({
    path: path.join(__dirname, "..", "..", "screenshots", "screenshot.png"),
  });
  return reviews;
}
