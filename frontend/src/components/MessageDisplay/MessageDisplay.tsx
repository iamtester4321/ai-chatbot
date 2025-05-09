import { formatMarkdownResponse } from "../../utils/responseRenderer";

interface MessageDisplayProps {
  messages: Array<{ role: string; content: string }>;
  chatResponse: string;
  isLoading: boolean;
}

const MessageDisplay = ({ messages, chatResponse, isLoading }: MessageDisplayProps) => {
  const lastUserMessage = messages
    .filter((msg) => msg.role === "user")
    .slice(-1)[0];

  return (
    <div className="w-full pt-4 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-normal mb-6 pt-4 text-white">
          {lastUserMessage?.content}
        </h2>

        <div className="markdown-body prose prose-invert max-w-none">
          {messages
            .filter((msg) => msg.role === "assistant")
            .map((msg, index) => (
              <div
                key={index}
                className="text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: formatMarkdownResponse(msg.content),
                }}
              />
            ))}
          {isLoading && (
            <span className="inline-block w-2 h-4 ml-1 bg-[#20b8cd] animate-pulse">
              |
            </span>
          )}
        </div>
        {chatResponse && (
          <div className="mt-6 text-gray-300">
            <div
              className="markdown-body prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: formatMarkdownResponse(chatResponse),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageDisplay;