import puppeteer from "puppeteer";
import { PuppeteerBlocker } from '@ghostery/adblocker-puppeteer';


(async () => {
 
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1980,
      height: 1020,
    },
    // executablePath: "/usr/bin/google-chrome",
    // headless: false,
  });

  const page = await browser.newPage();
  const blocker= await PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch)

  await blocker.enableBlockingInPage(page)

  await page.goto("https://adblock-tester.com/", {
    waitUntil: "networkidle2",
  });

  await page.addStyleTag({
    content: `
    
    [aria-label='Cookie Consent Banner'] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }`,
  });

  await page.evaluate(() => {
    const element = document.querySelector(
      "#hs_cos_wrapper_widget_1679679257918 > section.stacked-hero-section > div > hgroup > div.heading.stacked-hero > h1 > span"
    );
    if (element) {
      element.textContent = "Doing the Right Thing";
    }
  });
  await page.screenshot({ path: "screenshot.png" });
  // Close the browser
  await browser.close();
})();
