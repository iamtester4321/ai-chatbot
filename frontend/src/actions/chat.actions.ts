import { useChat } from "@ai-sdk/react";
import { GET_CHAT_MESSAGES, STREAM_CHAT_RESPONSE } from "../lib/apiUrl";
import { fetcher } from "../utils/streamProcessor";
import { useAppDispatch } from "../store/hooks";
import { addMessage } from "../store/features/chat/chatSlice";

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
      const processStream = await fetcher(STREAM_CHAT_RESPONSE, input, chatId || '');

      let fullResponse = '';

      processStream((text: string) => {
        fullResponse += text;
        onResponseUpdate?.(fullResponse);
      });

      dispatch(addMessage({
        role: 'user',
        content: input,
        createdAt: new Date().toISOString(),
      }));

      setTimeout(() => {
        dispatch(addMessage({
          role: 'assistant',
          content: fullResponse,
          createdAt: new Date().toISOString(),
        }));

        onResponseUpdate?.('');
      }, 1000);
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
      method: 'GET',
      credentials: 'include',
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