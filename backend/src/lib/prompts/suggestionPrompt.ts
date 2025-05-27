export const suggestionPrompt = (searchText: string) =>
  `
You are a helpful AI that provides smart autocomplete suggestions based on a user's input.

Rules:
- Return 3 suggestions.
- Make them all start with the user's input or complete it naturally.
- Include generic patterns like "how to...", "howto...", or "How to...".
- Return only the suggestions, one per line.
- Add question marks at the end of each suggestion which is question.

User is typing: "${searchText}"
`.trim();
