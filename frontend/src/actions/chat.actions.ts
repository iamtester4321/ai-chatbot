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
import { DeleteChatResponse } from "../lib/types";
import {
  addMessage,
  resetChat,
  setChatList,
  setChatName,
  setCurrentResponse,
} from "../store/features/chat/chatSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { AppDispatch, store } from "../store/store";
import {
  decryptChunk,
  decryptWithAesKey,
  encryptWithAesKey,
  performHandshake,
} from "../utils/helpers/e2e";

export const useChatActions = ({
  chatId,
  onResponseUpdate,
}: {
  chatId: string;
  onResponseUpdate?: (text: string) => void;
}) => {
  const dispatch = useAppDispatch();
  const { messages, mode } = useAppSelector((s) => s.chat);
  const showToast = useToast();
  const navigate = useNavigate();
  const modeStr = mode === "chart" ? "?mode=chart" : "";

  const {
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    status,
  } = useChat({
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
        return;
      }

      if (moderationResult.flagged) {
        showToast.warning(
          "Your message may violate our content guidelines. Please revise and try again."
        );
        navigate("/");
        dispatch(resetChat());
        return;
      }

      // If moderation passes, run all main chat logic
      try {
        const { aesKey } = await performHandshake();

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

        const response = await fetch(STREAM_CHAT_RESPONSE(modeStr), {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userMessageId,
            assistantMessageId,
            prompt: await encryptWithAesKey(aesKey, input),
            messages,
            chatId,
          }),
        });

        if (!response.ok || !response.body) {
          throw new Error("Streaming API failed");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulated = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const parts = buffer.split("\n\n");
            buffer = parts.pop() || "";

            for (const part of parts) {
              const m = part.match(/^data:\s*(.+)$/m);
              if (!m) continue;
              const encryptedB64 = m[1].trim();

              try {
                const decrypted = await decryptChunk(aesKey, encryptedB64);
                accumulated += decrypted;
                dispatch(setCurrentResponse(accumulated));
                onResponseUpdate?.(accumulated);
              } catch (e) {
                console.error("decryptChunk error:", e);
              }
            }
          }
        } finally {
          reader.releaseLock();
        }

        dispatch(
          addMessage({
            id: assistantMessageId,
            role: "assistant",
            content: accumulated,
            createdAt: new Date().toISOString(),
          })
        );
        dispatch(setCurrentResponse(""));
        onResponseUpdate?.("");

        await fetchChatNames(dispatch);

        if (chatId) {
          const updated = await fetchMessages(chatId);
          if (updated.success && updated.data) {
            dispatch(setChatName(updated.data.name));
          }
        }
      } catch (err) {
        console.error("Error during chat operation:", err);
        showToast.error("Something went wrong. Please try again.");
      }
    },
  });

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading: status === "submitted",
  };
};


export const fetchMessages = async (chatId: string) => {
  try {
    // 2. Get encrypted messages from API
    const response = await axios.get(`${GET_CHAT_MESSAGES}/${chatId}`, {
      withCredentials: true,
    });

    const encryptedMessages = response.data.messages;
    const aesKeyBase64 = response.data.encryptedAesKey;

    const aesKeyRaw = Uint8Array.from(atob(aesKeyBase64), (c) =>
      c.charCodeAt(0)
    );
    const aesKey = await crypto.subtle.importKey(
      "raw",
      aesKeyRaw,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    // 3. Decrypt each message
    const decryptedMessages = await Promise.all(
      encryptedMessages.map(async (msg: any) => ({
        ...msg,
        content: await decryptWithAesKey(aesKey, msg.content),
      }))
    );

    const decryptedName = decryptWithAesKey(aesKey, response.data.name);

    return {
      success: true,
      data: {
        ...response.data,
        messages: decryptedMessages,
        name: decryptedName,
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

    // Decrypt chat names
    const returnData = await Promise.all(
      response.data.map(async (x: any) => {
        const aesKeyBase64 = x.encryptedAesKey;

        const aesKeyRaw = Uint8Array.from(atob(aesKeyBase64), (c) =>
          c.charCodeAt(0)
        );
        const aesKey = await crypto.subtle.importKey(
          "raw",
          aesKeyRaw,
          { name: "AES-GCM" },
          false,
          ["decrypt"]
        );

        const decryptedName = await decryptWithAesKey(aesKey, x.name);
        return { ...x, name: decryptedName };
      })
    );

    if (response.status === 200) {
      dispatch(setChatList(returnData));
      return { success: true, data: returnData };
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
