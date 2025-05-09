import { useChat } from "@ai-sdk/react";
import { STREAM_CHAT_RESPONSE } from "../lib/apiUrl";
import { fetcher } from "../utils/streamProcessor";

interface ChatHookProps {
  chatId?: string;
  onResponseUpdate?: (text: string) => void;
}

export const useChatActions = ({ chatId, onResponseUpdate }: ChatHookProps) => {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: STREAM_CHAT_RESPONSE,
    id: chatId,
    onResponse: async () => {
      const processStream = await fetcher(STREAM_CHAT_RESPONSE, input, chatId || '');
      processStream((text: string) => {
        onResponseUpdate?.(text);
      });
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