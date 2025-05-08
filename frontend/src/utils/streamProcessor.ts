export const fetcher = async (url: string, prompt: string) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: prompt, messages: [], chatId: "50" }),
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  if (!response.body) {
    throw new Error("Response body is empty");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  const processStream = async (onChunk: (text: string) => void) => {
    try {
      let accumulatedText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        onChunk(accumulatedText);
      }
    } finally {
      reader.releaseLock();
    }
  };

  return processStream;
};
