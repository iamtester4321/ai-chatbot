import { useChat } from "@ai-sdk/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import useToast from "../hooks/useToast";
import {
  ARCHIVE_CHAT,
  DELETE_CHAT,
  GET_CHAT_MESSAGES,
  GET_CHAT_NAMES,
  GET_SHARE_CHAT_MESSAGES,
  RENAME_CHAT,
  SHARE_CHAT,
  STREAM_CHAT_RESPONSE,
  TOGGLE_FAVORITE_CHAT,
} from "../lib/apiUrl";
import {
  addMessage,
  resetChat,
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
  const showToast = useToast();
  const navigate = useNavigate();

  const { input, handleInputChange, handleSubmit, status } = useChat({
    api: STREAM_CHAT_RESPONSE,
    id: chatId,
    onResponse: async () => {
      const moderationResult = await moderationCheck(input);
      if (moderationResult.flagged) {
        showToast.warning(
          "Your message contains language that may violate our content guidelines. Please revise and try again."
        );
        navigate("/");
        dispatch(resetChat());
      } else {
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
    const response = await axios.get(`${GET_CHAT_MESSAGES}/${chatId}`, {
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching messages:",
        error.response?.data || error.message
      );
    } else {
      console.error("An unknown error occurred:", error);
    }
    return { success: false, error: "Error fetching messages" };
  }
};

export const fetchMessagesByShareId = async (shareId: string) => {
  try {
    const response = await axios.get(`${GET_SHARE_CHAT_MESSAGES(shareId)}`, {
      withCredentials: true,
    });

    return { success: true, data: response.data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching messages:",
        error.response?.data || error.message
      );
    } else {
      console.error("An unknown error occurred:", error);
    }
    return { success: false, error: "Error fetching messages" };
  }
};

export const fetchChatNames = async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(GET_CHAT_NAMES, {
      withCredentials: true,
    });

    if (response.status === 200) {
      dispatch(setChatList(response.data));
      return { success: true, data: response.data };
    } else {
      console.error("Failed to fetch chat names");
      return { success: false, error: "Failed to fetch chat names" };
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching chat names:",
        error.response?.data || error.message
      );
    } else {
      console.error("An unknown error occurred:", error);
    }
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
    const response = await axios.delete(DELETE_CHAT(chatId), {
      withCredentials: true,
    });

    if (response.status !== 200) {
      const message = response.data.message || "Failed to delete chat";
      return {
        success: false,
        message: message,
      };
    }

    window.dispatchEvent(new Event("chat-deleted"));

    return {
      success: true,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error deleting chat:",
        error.response?.data || error.message
      );
    } else {
      console.error("An unknown error occurred:", error);
    }
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
    const response = await axios.patch(
      TOGGLE_FAVORITE_CHAT(chatId),
      {},
      {
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      return {
        success: false,
        message: response.data.message || "Failed to toggle favorite status",
      };
    }

    window.dispatchEvent(new Event("chat-favorite-toggled"));

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error: unknown) {
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
    const response = await axios.patch(
      RENAME_CHAT(chatId),
      { newName },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      return {
        success: false,
        message: response.data.message || "Failed to rename chat",
      };
    }

    window.dispatchEvent(new Event("chat-renamed"));

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error: unknown) {
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
    const response = await axios.patch(
      ARCHIVE_CHAT(chatId),
      {},
      {
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      return {
        success: false,
        message: response.data.message || "Failed to archive chat",
      };
    }

    window.dispatchEvent(new Event("chat-archived"));

    return {
      success: true,
      message: response.data.message || "Chat archived successfully",
    };
  } catch (error: unknown) {
    console.error("Error archiving chat:", error);
    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
};

export async function generateShareId(chatId: string) {
  try {
    const response = await axios.post(
      SHARE_CHAT,
      {
        chatId,
        id: uuidv4(),
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: response.status === 200,
      shareId: response.data.shareId,
      message: response.data.message,
    };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, message: "Network error" };
  }
}

export const moderationCheck = async (input: string) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/moderations",
      { input },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
      }
    );

    const results = response?.data?.results?.[0];

    const profanityThreshold = 0.1;

    const isOffensive =
      results?.category_scores?.sexual > profanityThreshold ||
      results?.category_scores?.hate > profanityThreshold ||
      results?.category_scores?.harassment > profanityThreshold ||
      results?.category_scores?.violence > profanityThreshold ||
      results?.flagged;

    return {
      flagged: isOffensive,
      apiResult: results,
      categories: results?.categories,
      categoryScores: results?.category_scores,
    };
  } catch (error) {
    console.error("Moderation API error:", error);
    return { flagged: false, categories: {}, categoryScores: {} };
  }
};
