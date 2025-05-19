// import { google } from "@ai-sdk/google";
// import { generateText } from "ai";

// export const generateSuggestions = async (searchText: string) => {
//   const model = google("gemini-2.0-flash");
  
//   const prompt = `
//     You are a helpful AI assistant. Provide 3-5 relevant suggestions based on the following input.
//     Keep each suggestion concise and under 50 characters.
//     Return only the suggestions, one per line.
//     Input: ${searchText}
//   `.trim();

//   const response = await generateText({model,prompt});
//   return response;
// };