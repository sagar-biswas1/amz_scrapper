// export default BrowserFactory;
import puppeteer, { Browser, Page } from "puppeteer";
import * as path from "node:path";
import fs from "fs";

class BrowserFactory {
  private static browserInstance: Browser | null = null;
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
    if (!BrowserFactory.browserInstance) {
      BrowserFactory.browserInstance = await puppeteer.launch({
        // userDataDir: BrowserFactory.dataDir,
        headless: process.env.HEADLESS === "true", // Toggle headless mode
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

    return BrowserFactory.browserInstance;
  }

  // Close the browser instance
  public static async closeBrowser(): Promise<void> {
    if (BrowserFactory.browserInstance) {
      await BrowserFactory.browserInstance.close();
      BrowserFactory.browserInstance = null;
      console.log("Browser closed");
    }
  }

  // Get a new page from the browser
  public static async getNewPage(): Promise<Page> {
    const browser = await BrowserFactory.getBrowser(); // Ensure the browser is running
    const page = await browser.newPage(); // Create a new page
    console.log("New page created");
    return page;
  }
}

export default BrowserFactory;
