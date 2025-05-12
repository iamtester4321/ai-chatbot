import { useChat } from "@ai-sdk/react";
import { DELETE_CHAT, GET_CHAT_MESSAGES, STREAM_CHAT_RESPONSE, TOGGLE_FAVORITE_CHAT } from "../lib/apiUrl";
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


interface DeleteChatResponse {
  success: boolean;
  message?: string;
}

export const deleteChat = async (chatId: string): Promise<DeleteChatResponse> => {
  try {
    const response = await fetch(DELETE_CHAT(chatId), {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const result = await response.json();
      return {
        success: false,
        message: result.message || "Failed to delete chat",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
};

export const toggleFavoriteChat = async (chatId: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(TOGGLE_FAVORITE_CHAT(chatId), {
      method: 'PATCH',
      credentials: 'include',
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to toggle favorite status',
      };
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please try again later.',
    };
  }
};
