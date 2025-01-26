import natural from "natural";
import { preprocessText } from "./preprocess";

// Sentiment Analysis using AFINN-based Tokenizer
export function analyzeSentiment(text: string) {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(preprocessText(text));

  const analyzer = new natural.SentimentAnalyzer(
    "English", // Language
    natural.PorterStemmer, // Stemming algorithm
    "afinn" // Lexicon (AFINN-111)
  );

  const score = analyzer.getSentiment(tokens);

  return {
    sentiment: score > 0 ? "Positive" : score < 0 ? "Negative" : "Neutral",
    score, // Sentiment score
  };
}
