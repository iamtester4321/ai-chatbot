import { useChat } from "@ai-sdk/react";
import { v4 as uuidv4 } from "uuid";
import {
  ARCHIVE_CHAT,
  DELETE_CHAT,
  GET_CHAT_MESSAGES,
  GET_CHAT_NAMES,
  RENAME_CHAT,
  SHARE_CHAT,
  STREAM_CHAT_RESPONSE,
  TOGGLE_FAVORITE_CHAT
} from "../lib/apiUrl";
import {
  addMessage,
  setChatList,
  setChatName,
  setCurrentResponse,
} from "../store/features/chat/chatSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { AppDispatch } from "../store/store";

interface ChatHookProps {
  chatId?: string;
  onResponseUpdate?: (text: string) => void;
}

export const useChatActions = ({ chatId, onResponseUpdate }: ChatHookProps) => {
  const dispatch = useAppDispatch();
  const { messages } = useAppSelector((state) => state.chat);

  const { input, handleInputChange, handleSubmit, status } = useChat({
    api: STREAM_CHAT_RESPONSE,
    id: chatId,
    onResponse: async () => {
      const userMessageId = uuidv4();
      const assistantMessageId = uuidv4();
      
      dispatch(
        addMessage({
          id: userMessageId,
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
          userMessageId,
          assistantMessageId,
          prompt: input,
          messages: messages,
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
            id: assistantMessageId,
            role: "assistant",
            content: accumulatedText,
            createdAt: new Date().toISOString(),
          })
        );
        dispatch(setCurrentResponse(""));
        onResponseUpdate?.("");

        await fetchChatNames(dispatch);
        if (!chatId) return;
        const updatedChat = await fetchMessages(chatId);
        if (updatedChat.success && updatedChat.data) {
          dispatch(setChatName(updatedChat.data.name));
        }
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

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    const data = await response.json();
    return { success: true, data };
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

export const deleteChat = async (
  chatId: string
): Promise<DeleteChatResponse> => {
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

    window.dispatchEvent(new Event("chat-deleted"));

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
};

export const toggleFavoriteChat = async (
  chatId: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(TOGGLE_FAVORITE_CHAT(chatId), {
      method: "PATCH",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to toggle favorite status",
      };
    }

    window.dispatchEvent(new Event("chat-favorite-toggled"));

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
};

export const renameChat = async (
  chatId: string,
  newName: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(RENAME_CHAT(chatId), {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newName }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to rename chat",
      };
    }

    window.dispatchEvent(new Event("chat-renamed"));

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
};

export const archiveChat = async (
  chatId: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(ARCHIVE_CHAT(chatId), {
      method: "PATCH",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to archive chat",
      };
    }

    window.dispatchEvent(new Event("chat-archived"));

    return {
      success: true,
      message: result.message || "Chat archived successfully",
    };
  } catch (error) {
    console.error("Error archiving chat:", error);
    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
};


export async function generateShareId(chatId: string) {
  try {
    const response = await fetch(SHARE_CHAT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        chatId,
        id: uuidv4(),
      }),
    });

    const data = await response.json();
    return {
      success: response.ok,
      shareId: data.shareId,
      message: data.message,
    };
  } catch (error) {
    console.error(error)
    return { success: false, message: "Network error" };
  }
}
