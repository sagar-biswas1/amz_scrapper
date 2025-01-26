import puppeteer, { Browser, Page } from "puppeteer";

// Launch Puppeteer with authentication
export async function launchBrowser() {
  let browser: Browser | null = null;

  try {
    // Launch browser with proper options
    browser = await puppeteer.launch({
      userDataDir: "dataDir",
      headless: process.env.HEADLESS === "true", // Dynamic headless mode
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page: Page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to the URL with error handling
    const url =
      "https://www.amazon.com/Futricy-Beginner-Traveler-Emergency-Accessories/dp/B0BXKB7QF6/ref=zg_bs_c_arts-crafts_d_sccl_5/134-8915425-9255066?pd_rd_w=bj2iY&content-id=amzn1.sym.7379aab7-0dd8-4729-b0b5-2074f1cb413d&pf_rd_p=7379aab7-0dd8-4729-b0b5-2074f1cb413d&pf_rd_r=R93HJYDRQJCFH1SM4JKV&pd_rd_wg=Hg0ao&pd_rd_r=9b45083c-4743-4eab-9265-32b4e24dec9c&pd_rd_i=B0BXKB7QF6&th=1";

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    return { browser, page };
  } catch (error) {
    console.error("An error occurred:", error.message);
    if (browser) await browser.close();
    throw error; // Re-throw error for upstream handling
  }
}

export async function scrapeGroupData(page) {
  
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
    await page.waitForSelector('[data-hook="cr-widget-FocalReviews"] .a-row .a-spacing-medium .aok-hidden');
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
  await page.screenshot({ path: "screenshot.png" });
  return reviews;
}
