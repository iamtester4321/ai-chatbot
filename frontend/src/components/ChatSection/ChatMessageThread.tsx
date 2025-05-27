import { Check, Copy, ThumbsDown, ThumbsUp, Loader2 } from "lucide-react";
import { useAppSelector } from "../../store/hooks";
import MarkdownRenderer from "../../utils/responseRenderer";
import { ChatMessageThreadProps } from "../../lib/types";
import { useState } from "react";

type LoadingState = {
  [msgId: string]: {
    like?: boolean;
    dislike?: boolean;
    copy?: boolean;
  };
};

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

  const [loadingMessages, setLoadingMessages] = useState<LoadingState>({});

  const handleLike = async (msgId: string) => {
    setLoadingMessages((prev) => ({
      ...prev,
      [msgId]: { ...prev[msgId], like: true },
    }));
    try {
      await onLike(msgId);
    } finally {
      setLoadingMessages((prev) => ({
        ...prev,
        [msgId]: { ...prev[msgId], like: false },
      }));
    }
  };

  const handleDislike = async (msgId: string) => {
    setLoadingMessages((prev) => ({
      ...prev,
      [msgId]: { ...prev[msgId], dislike: true },
    }));
    try {
      await onDislike(msgId);
    } finally {
      setLoadingMessages((prev) => ({
        ...prev,
        [msgId]: { ...prev[msgId], dislike: false },
      }));
    }
  };

  const handleCopy = async (msg: string, index: number, msgId?: string) => {
    if (msgId) {
      setLoadingMessages((prev) => ({
        ...prev,
        [msgId]: { ...prev[msgId], copy: true },
      }));
    }
    try {
      await onCopy(msg, index);
    } finally {
      if (msgId) {
        setLoadingMessages((prev) => ({
          ...prev,
          [msgId]: { ...prev[msgId], copy: false },
        }));
      }
    }
  };

  return (
    <>
      {messages.map((msg, index) => {
        const isUser = msg.role === "user";
        const loading = loadingMessages[msg.id || ""] || {};
        const isLiking = loading.like;
        const isDisliking = loading.dislike;
        const isCopying = loading.copy;

        return isUser ? (
          <div key={index} className="flex justify-end">
            <div className="space-y-2">
              <div className="bg-[var(--color-muted)] px-3 sm:px-4 py-1 rounded-2xl max-w-[280px] sm:max-w-xs md:max-w-md break-words">
                {msg.content}
              </div>
              <div className="flex justify-end">
                <button
                  className="p-1 text-[var(--color-disabled-text)] hover:text-[var(--color-text)] cursor-pointer"
                  onClick={() => handleCopy(msg.content, index, msg.id)}
                  disabled={isCopying}
                >
                  {isCopying ? (
                    <Loader2
                      size={isMobile ? 16 : 20}
                      className="animate-spin"
                      color="currentColor"
                    />
                  ) : copiedIndex === index ? (
                    <Check size={isMobile ? 16 : 20} />
                  ) : (
                    <Copy size={isMobile ? 16 : 20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div key={index} className="space-y-2">
            <div className="max-w-none markdown-body prose prose-invert">
              <MarkdownRenderer content={msg.content} flag={mode === "chart"} />
            </div>
            <div className="flex items-center space-x-3 text-[var(--color-disabled-text)]">
              <button
                className="p-1 hover:text-[var(--color-text)] cursor-pointer"
                onClick={() => handleCopy(msg.content, index, msg.id)}
                disabled={isCopying}
              >
                {isCopying ? (
                  <Loader2
                    size={isMobile ? 16 : 20}
                    className="animate-spin"
                    color="currentColor"
                  />
                ) : copiedIndex === index ? (
                  <Check size={isMobile ? 16 : 20} />
                ) : (
                  <Copy size={isMobile ? 16 : 20} />
                )}
              </button>

              {user && msg?.id && (
                <>
                  {!dislikedMessages[msg.id] && (
                    <button
                      className={`p-1 transition-colors ${
                        !likedMessages[msg.id]
                          ? "hover:text-[var(--color-text)]"
                          : ""
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      onClick={() => handleLike(msg.id!)}
                      disabled={!!likedMessages[msg.id] || isLiking}
                    >
                      {isLiking ? (
                        <Loader2
                          size={isMobile ? 16 : 20}
                          className="animate-spin"
                          color="currentColor"
                        />
                      ) : (
                        <ThumbsUp
                          size={isMobile ? 16 : 20}
                          fill={likedMessages[msg.id] ? "currentColor" : "none"}
                          color="currentColor"
                        />
                      )}
                    </button>
                  )}

                  {!likedMessages[msg.id] && (
                    <button
                      className={`p-1 transition-colors ${
                        !dislikedMessages[msg.id]
                          ? "hover:text-[var(--color-text)]"
                          : ""
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      onClick={() => handleDislike(msg.id!)}
                      disabled={!!dislikedMessages[msg.id] || isDisliking}
                    >
                      {isDisliking ? (
                        <Loader2
                          size={isMobile ? 16 : 20}
                          className="animate-spin"
                          color="currentColor"
                        />
                      ) : (
                        <ThumbsDown
                          size={isMobile ? 16 : 20}
                          fill={dislikedMessages[msg.id] ? "currentColor" : "none"}
                          color="currentColor"
                        />
                      )}
                    </button>
                  )}
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
