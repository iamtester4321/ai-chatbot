import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useRef } from "react";
import { formatMarkdownResponse } from "../../utils/responseRenderer";

interface MessageDisplayProps {
  messages: Array<{ role: string; content: string; createdAt: string }>;
  chatResponse: string;
  isLoading: boolean;
  chatName: string;
}

const MessageDisplay = ({
  messages,
  chatResponse,
  isLoading,
  chatName,
}: MessageDisplayProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatResponse]);

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] text-white">
      {/* Messages Container */}
      <div className="mx-auto max-w-3xl px-4 md:px-8 py-10">
        {chatName && (
          <h2 className="text-3xl md:text-4xl font-normal mb-6 pt-4 text-white text-center md:text-left">
            {chatName}
          </h2>
        )}
        {/* Display messages */}
        <div className="space-y-8">
          {messages.map((msg, index) => {
            const isAssistant = msg.role === "assistant";
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

                {/* Action buttons */}
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
                  <button className="p-1 hover:text-white" aria-label="Like">
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
                <button className="p-1 hover:text-white" aria-label="Like">
                  <ThumbsDown />
                </button>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default MessageDisplay;
