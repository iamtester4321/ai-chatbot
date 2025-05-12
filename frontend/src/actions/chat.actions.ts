import { useChat } from "@ai-sdk/react";
import { DELETE_CHAT, GET_CHAT_MESSAGES, STREAM_CHAT_RESPONSE, TOGGLE_FAVORITE_CHAT, GET_CHAT_NAMES } from "../lib/apiUrl";
import {
  addMessage,
  setCurrentResponse,
  setChatList
} from "../store/features/chat/chatSlice";
import { useAppDispatch } from "../store/hooks";
import { AppDispatch } from "../store/store";

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
    const response = await fetch(`${GET_CHAT_MESSAGES}/${chatId}`, {
      method: "GET",
      credentials: "include",
    });

    const text = await response.text();

    if (response.ok) {
      const data = JSON.parse(text);
      // Dispatch updated data to Redux store
      window.dispatchEvent(new CustomEvent('chat-data-updated', { detail: { chatId, data } }));
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

export const fetchChatNames = async (dispatch: AppDispatch) => {
  try {
    const response = await fetch(GET_CHAT_NAMES, {
      method: "GET",
      credentials: "include",
    });

    const text = await response.text();

    if (response.ok) {
      const data = JSON.parse(text);
      dispatch(setChatList(data));
      // Dispatch event for real-time updates
      window.dispatchEvent(new CustomEvent('chat-names-updated', { detail: { data } }));
      return { success: true, data };
    } else {
      console.error("Failed to fetch chat names");
      return { success: false, error: "Failed to fetch chat names" };
    }
  } catch (error) {
    console.error("Error fetching chat names:", error);
    return { success: false, error: "Error fetching chat names" };
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

    // Dispatch event to trigger sidebar update
    window.dispatchEvent(new Event('chat-deleted'));

    return {
      success: true,
    };
  } catch (error) {
    console.error(error)
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

    // Dispatch event to trigger sidebar update
    window.dispatchEvent(new Event('chat-favorite-toggled'));

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Network error. Please try again later.',
    };
  }
};

