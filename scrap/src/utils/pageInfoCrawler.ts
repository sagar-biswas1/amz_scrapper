export const pageInfoCrawler = async (page) => {
  try{
    await page.waitForSelector("#detailBulletsWrapper_feature_div");

  const details = await page.evaluate(() => {
    const data: Record<string, string> = {};
    const d = document.querySelector("#detailBulletsWrapper_feature_div");
    // Select all <li> elements inside detail bullet lists
    d?.querySelectorAll(".detail-bullet-list > li").forEach((li) => {
      const keyElement = li.querySelector(".a-text-bold");
      const valueElement = keyElement?.nextSibling; // Value is the next text node
      //console.log(keyElement,valueElement)

      const key = keyElement?.textContent?.trim().replace(/[\s:‎]+$/, ""); // Remove extra spaces & colons
      const value = valueElement?.textContent?.trim();
      if (key && value) data[key] = value;
    });

    // Extract Customer Reviews (Rating + Count)
    const ratingElement = d?.querySelector("#acrPopover .a-size-base");
    const reviewCountElement = d?.querySelector("#acrCustomerReviewText");

    if (ratingElement)
      data["Customer Rating"] = ratingElement.textContent?.trim();
    if (reviewCountElement)
      data["Customer Reviews"] = reviewCountElement.textContent?.trim();

    return data;
  });

  console.log(details);
  return details;
  }catch(err){
    return null
  }
};
