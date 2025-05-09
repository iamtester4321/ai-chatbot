import { useChat } from "@ai-sdk/react";
import { GET_CHAT_MESSAGES, STREAM_CHAT_RESPONSE } from "../lib/apiUrl";
import {
  addMessage,
  setCurrentResponse,
} from "../store/features/chat/chatSlice";
import { useAppDispatch } from "../store/hooks";

interface ChatHookProps {
  chatId?: string;
  onResponseUpdate?: (text: string) => void;
}

export const useChatActions = ({ chatId, onResponseUpdate }: ChatHookProps) => {
  const dispatch = useAppDispatch();

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: STREAM_CHAT_RESPONSE,
    id: chatId,
    onResponse: async () => {
      dispatch(
        addMessage({
          role: "user",
          content: input,
          createdAt: new Date().toISOString(),
        })
      );

      const response = await fetch(STREAM_CHAT_RESPONSE, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          messages: [],
          chatId: chatId || "",
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        let accumulatedText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;
          dispatch(setCurrentResponse(accumulatedText));
          onResponseUpdate?.(accumulatedText);
        }
        dispatch(
          addMessage({
            role: "assistant",
            content: accumulatedText,
            createdAt: new Date().toISOString(),
          })
        );
        dispatch(setCurrentResponse(""));
        onResponseUpdate?.("");
      } finally {
        reader.releaseLock();
      }
    },
  });

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: status === "submitted",
  };
};

export const fetchMessages = async (chatId: string) => {
  try {
    console.log("url::", `${GET_CHAT_MESSAGES}/${chatId}`);

    const response = await fetch(`${GET_CHAT_MESSAGES}/${chatId}`, {
      method: "GET",
      credentials: "include",
    });

    const text = await response.text();

    if (response.ok) {
      const data = JSON.parse(text);
      return { success: true, data };
    } else {
      console.error("Failed to fetch messages for chatId:", chatId);
      return { success: false, error: "Failed to fetch messages" };
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { success: false, error: "Error fetching messages" };
  }
};
