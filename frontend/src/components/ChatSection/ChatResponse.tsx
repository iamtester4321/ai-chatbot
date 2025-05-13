import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatMarkdownResponse } from "../../utils/responseRenderer";
import StreamLoader from "../StreamLoader/StreamLoader";
import { ChatResponseProps } from "../../lib/types";
import PromptInput from "./PromptInput";

const ChatResponse = ({
  messages,
  chatResponse,
  isLoading,
  chatName,
    input,
  handleInputChange,
  handleFormSubmit,
}: ChatResponseProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showResponseActions, setShowResponseActions] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatResponse]);

  useEffect(() => {
    if (!isLoading && chatResponse) {
      setShowResponseActions(true);
    } else {
      setShowResponseActions(false);
    }
  }, [isLoading, chatResponse]);

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] text-white flex flex-col">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-4 md:px-8 py-10">
          {chatName && (
            <h2 className="text-3xl md:text-4xl font-normal mb-6 pt-4 text-white text-center md:text-left">
              {chatName}
            </h2>
          )}

          <div className="space-y-8">
            {/* All messages */}
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";

              if (isUser) {
                return (
                  <div key={index} className="flex justify-end">
                    <div className="bg-[#2b2b2b] text-white px-4 py-2 rounded-2xl max-w-full sm:max-w-xs md:max-w-md">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              return (
                <div key={index} className="space-y-2">
                  <div
                    className="max-w-none markdown-body [&.markdown-body]:!bg-transparent prose prose-invert p-2"
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdownResponse(msg.content),
                    }}
                  />
                  <div className="flex items-center space-x-3 text-gray-400">
                    <button
                      className="p-1 hover:text-white"
                      aria-label="Copy to clipboard"
                    >
                      <Copy />
                    </button>
                    <button className="p-1 hover:text-white" aria-label="Like">
                      <ThumbsUp />
                    </button>
                    <button
                      className="p-1 hover:text-white"
                      aria-label="Dislike"
                    >
                      <ThumbsDown />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Current AI response */}
            {chatResponse && (
              <div className="space-y-2">
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: formatMarkdownResponse(chatResponse),
                  }}
                />

                {/* Action buttons */}
                {showResponseActions && (
                  <div className="flex items-center space-x-3 text-gray-400">
                    <button
                      className="p-1 hover:text-white"
                      aria-label="Copy to clipboard"
                    >
                      <Copy />
                    </button>
                    <button className="p-1 hover:text-white" aria-label="Like">
                      <ThumbsUp />
                    </button>
                    <button
                      className="p-1 hover:text-white"
                      aria-label="Dislike"
                    >
                      <ThumbsDown />
                    </button>
                  </div>
                )}
              </div>
            )}

            {isLoading && <StreamLoader />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Sticky input bar */}
      <div className="sticky bottom-0 bg-[#1a1a1a] px-4 py-4 border-t border-[#2a2a2a] z-10">
        <PromptInput
          input={input}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
        />
      </div>
    </div>
  );
};

export default ChatResponse;
