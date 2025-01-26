import * as path from "node:path";
import { saveData } from "../scrap/utils";

import { readData } from "./utils/readData";
import { preprocessText } from "./utils/preprocess";
import { analyzeSentiment } from "./utils/analyzer";

// Example Usage

const filePath = path.join(__dirname, "..", "data", "reviews.json");
const reviewsData = readData(filePath);

const analyzedData = reviewsData.map((r) => {
  const review = r.body;
  const cleanReview = preprocessText(review);
  const sentimentResult = analyzeSentiment(cleanReview);

  return {
    ...r,
    sentimentResult,
  };
});

saveData(filePath, analyzedData);

// Assigning numeric values to sentiment types
const sentimentMapping = {
  Positive: 1,
  Neutral: 0,
  Negative: -1,
};

// Calculate the weighted sentiment score (using the sentiment score directly)
let totalSentimentScore = 0;

analyzedData.forEach((review) => {
  totalSentimentScore += sentimentMapping[review.sentimentResult.sentiment]; // Directly use the score from sentimentResult
});

const averageSentimentScore = totalSentimentScore / analyzedData.length;

// Determine the overall sentiment
let overallSentiment;
if (averageSentimentScore > 0.2) {
  overallSentiment = "Positive";
} else if (averageSentimentScore < -0.2) {
  overallSentiment = "Negative";
} else {
  overallSentiment = "Neutral";
}

console.log(
  totalSentimentScore,
  `Average Sentiment Score: ${averageSentimentScore.toFixed(2)}`
);
console.log(`Overall Sentiment: ${overallSentiment}`);
