import fs from "fs";

export function appendData(filePath, newData) {
  let existingData = [];

  // Check if file exists and read existing data
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    try {
      existingData = JSON.parse(fileContent);
      if (!Array.isArray(existingData)) {
        throw new Error("Existing data is not an array!");
      }
    } catch (error) {
      console.error("Error parsing existing JSON data:", error);
      return;
    }
  }

  // Append new data
  existingData.push(newData);

  // Write updated data back to file
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf-8");

  console.log(`Data appended to ${filePath}`);
}
