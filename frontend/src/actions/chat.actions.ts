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
  PROMPT_SUGGESTION,
  RENAME_CHAT,
  SHARE_CHAT,
  STREAM_CHAT_RESPONSE,
  TOGGLE_FAVORITE_CHAT,
} from "../lib/apiUrl";
import { ChatHookProps, DeleteChatResponse } from "../lib/types";
import {
  addMessage,
  resetChat,
  setChatList,
  setChatName,
  setCurrentResponse
} from "../store/features/chat/chatSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { AppDispatch, store } from "../store/store";
import { encryptMessage, decryptMessage } from "../utils/encryption.utils";

export const useChatActions = ({ chatId, onResponseUpdate }: ChatHookProps) => {
  const dispatch = useAppDispatch();
  const { messages } = useAppSelector((state) => state.chat);
  const showToast = useToast();
  const navigate = useNavigate();
  const { mode } = useAppSelector((state) => state.chat);

  let modeStr = "";
  if (mode === "chart") modeStr = "?mode=chart";

  const { input, handleInputChange, handleSubmit, status } = useChat({
    api: STREAM_CHAT_RESPONSE(modeStr),
    id: chatId,
    onResponse: async () => {
      const moderationResult = await moderationCheck(input);
      if (moderationResult.xssDetected) {
        showToast.error(
          "Potential security risk detected in your input. Please remove any unsafe code and try again."
        );
        navigate("/");
        dispatch(resetChat());
      } else if (moderationResult.flagged) {
        showToast.warning(
          "Your message contains language that may violate our content guidelines. Please revise and try again."
        );
        navigate("/");
        dispatch(resetChat());
      } else {
        const userMessageId = uuidv4();
      const assistantMessageId = uuidv4();
      const encryptedUser = await encryptMessage(input);
      dispatch(
        addMessage({
          id: userMessageId,
          role: "user",
          content: input,
          createdAt: new Date().toISOString(),
        })
      );
      const response = await fetch(STREAM_CHAT_RESPONSE(modeStr), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessageId,
          assistantMessageId,
          prompt: encryptedUser,
          messages,
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
        const decryptedAssistantMessage = await decryptMessage(accumulatedText);
        dispatch(
          addMessage({
            id: assistantMessageId,
            role: "assistant",
            content: decryptedAssistantMessage,
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

    const decryptedMessages = await Promise.all(
      response.data.messages.map(async (msg: any) => ({
        ...msg,
        content: await decryptMessage(msg.content),
      }))
    );

    return {
      success: true,
      data: {
        ...response.data,
        messages: decryptedMessages,
        name: response.data.name,
      },
    };
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

    // No decryption
    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching shared messages:",
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
    if (response.status !== 200) {
      console.error("Failed to fetch chat names");
      return { success: false, error: "Failed to fetch chat names" };
    }

    const decryptedList = await Promise.all(
      response.data.map(async (chat: any) => ({
        ...chat,
        name: await decryptMessage(chat.name),
      }))
    );
    dispatch(setChatList(decryptedList));

    return { success: true, data: response.data };
  } catch (error: unknown) {
    console.error(
      "Error fetching chat names:",
      axios.isAxiosError(error) ? error.response?.data || error.message : error
    );
    return { success: false, error: "Error fetching chat names" };
  }
};

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

    const updatedChats = await fetchChatNames(store.dispatch);
    store.dispatch(setChatList(updatedChats.data));

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

    const updatedChats = await fetchChatNames(store.dispatch);
    store.dispatch(setChatList(updatedChats.data));

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
    // Always encrypt the new name before sending
    const encryptedName = await encryptMessage(newName);

    const response = await axios.patch(
      RENAME_CHAT(chatId),
      { newName: encryptedName },
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

    const updatedChats = await fetchChatNames(store.dispatch);
    store.dispatch(setChatList(updatedChats.data));

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

    const updatedChats = await fetchChatNames(store.dispatch);
    store.dispatch(setChatList(updatedChats.data));

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
    const xssPattern =
      /<script[\s\S]*?>[\s\S]*?<\/script\s*>|on\w+\s*=\s*["'][\s\S]*?["']|javascript:|<.*?\s+on\w+\s*=\s*["'][^"']*["'].*?>|<iframe[\s\S]*?>|<img[\s\S]*?on\w+[\s\S]*?>/gi;

    const xssDetected = xssPattern.test(input);

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
      flagged: isOffensive || xssDetected,
      xssDetected,
      apiResult: results,
      categories: results?.categories,
      categoryScores: results?.category_scores,
    };
  } catch (error) {
    console.error("Moderation API error:", error);
    return {
      flagged: false,
      xssDetected: false,
      categories: {},
      categoryScores: {},
    };
  }
};

export const fetchSuggestions = async (
  query: string
): Promise<{ success: boolean; suggestions: string[] }> => {
  try {
    const response = await axios.get(PROMPT_SUGGESTION(query));

    if (response.data.success) {
      return {
        success: true,
        suggestions: response.data.suggestions,
      };
    }

    return { success: false, suggestions: [] };
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return { success: false, suggestions: [] };
  }
};
