import sanitizeHtml from "sanitize-html";
import stopword from "stopword";

// Preprocess text by sanitizing, removing stopwords, and normalizing whitespace
export function preprocessText(text: string): string {
  return sanitizeHtml(text)
    .replace(/[\u{1F600}-\u{1F64F}]/gu, "") // Remove emojis
    .replace(/[^a-zA-Z0-9\s.,!?']/g, "") // Remove special characters (retain contractions)
    .replace(/\s+/g, " ") // Normalize whitespace
    .toLowerCase() // Convert to lowercase
    .split(" ")
    .map((word, i, arr) => {
      if (["not", "never", "no"].includes(word) && arr[i + 1]) {
        return `NOT_${arr[i + 1]}`;
      }
      return word;
    })
    .filter((word) => !stopword?.en?.includes(word)) // Remove stop words
    .join(" ")
    .trim();
}
