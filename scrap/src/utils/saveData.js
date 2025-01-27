import fs from "fs";

export function saveData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Data saved to ${filePath}`);
}
