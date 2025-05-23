import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { useAppSelector } from "../../store/hooks";
import MarkdownRenderer from "../../utils/responseRenderer";
import { ChatMessageThreadProps } from "../../lib/types";

const ChatMessageThread = ({
  messages,
  isMobile,
  onCopy,
  copiedIndex,
  likedMessages,
  dislikedMessages,
  onLike,
  onDislike,
}: ChatMessageThreadProps) => {
  const { user } = useAppSelector((state) => state.user);
  const { mode } = useAppSelector((state) => state.chat);

  return (
    <>
      {messages.map((msg, index) => {
        const isUser = msg.role === "user";

        return isUser ? (
          <div key={index} className="flex justify-end">
            <div className="space-y-2">
              <div className="bg-[var(--color-muted)] px-3 sm:px-4 py-1 rounded-2xl max-w-[280px] sm:max-w-xs md:max-w-md break-words">
                {msg.content}
              </div>
              <div className="flex justify-end">
                <button
                  className="p-1 text-[var(--color-disabled-text)] hover:text-[var(--color-text)] cursor-pointer"
                  onClick={() => onCopy(msg.content, index)}
                >
                  {copiedIndex === index ? <Check size={isMobile ? 16 : 20} /> : <Copy size={isMobile ? 16 : 20} />}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div key={index} className="space-y-2">
            <div className="max-w-none markdown-body prose prose-invert p-2">
              <MarkdownRenderer content={msg.content} flag={mode === "chart"} />
            </div>
            <div className="flex items-center space-x-3 text-[var(--color-disabled-text)]">
              <button
                className="p-1 hover:text-[var(--color-text)] cursor-pointer"
                onClick={() => onCopy(msg.content, index)}
              >
                {copiedIndex === index ? <Check size={isMobile ? 16 : 20} /> : <Copy size={isMobile ? 16 : 20} />}
              </button>
              {user && msg?.id && (
                <>
                  <button
                    className={`p-1 transition-colors ${
                      !(likedMessages[msg.id] || dislikedMessages[msg.id]) ? "hover:text-[var(--color-text)]" : ""
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    onClick={() => onLike(msg.id)}
                    disabled={likedMessages[msg.id] || dislikedMessages[msg.id]}
                  >
                    <ThumbsUp
                      size={isMobile ? 16 : 20}
                      fill={likedMessages[msg.id] ? "currentColor" : "none"}
                      color="currentColor"
                    />
                  </button>
                  <button
                    className={`p-1 transition-colors ${
                      !(likedMessages[msg.id] || dislikedMessages[msg.id]) ? "hover:text-[var(--color-text)]" : ""
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    onClick={() => onDislike(msg.id)}
                    disabled={likedMessages[msg.id] || dislikedMessages[msg.id]}
                  >
                    <ThumbsDown
                      size={isMobile ? 16 : 20}
                      fill={dislikedMessages[msg.id] ? "currentColor" : "none"}
                      color="currentColor"
                    />
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ChatMessageThread;

