import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { suggestionPrompt } from "../lib/prompts/suggestionPrompt";

export const getSuggestionsService = async (searchText: string) => {
  const model = google("gemini-2.0-flash");

  const prompt = suggestionPrompt(searchText);

  const { text } = await generateText({ model, prompt });

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};
