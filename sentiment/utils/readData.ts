
import * as fs from "fs";
export const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");

    return JSON.parse(data);
  } catch (e) {
    console.error(e);
    return null;
  }
};