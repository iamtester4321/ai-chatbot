import { Archive, Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { archiveChat } from "../../actions/chat.actions";
import {
  updateDislikeStatus,
  updateLikeStatus,
} from "../../actions/message.actions";
import useToast from "../../hooks/useToast";
import { ChatResponseProps } from "../../lib/types";
import { setIsArchived } from "../../store/features/chat/chatSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import MarkdownRenderer from "../../utils/responseRenderer";
import StreamLoader from "../Loaders/StreamLoader";
import PromptInput from "./PromptInput";

const ChatResponse = ({
  messages,
  chatResponse,
  isLoading,
  chatName,
  input,
  handleInputChange,
  handleFormSubmit,
  chatId,
  shareId,
  isMobile,
  sourceChatId,
}: ChatResponseProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showResponseActions, setShowResponseActions] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const isArchived = useAppSelector((state) => state.chat.isArchived);
  const user = useAppSelector((state) => state.user.user);
  const showToast = useToast();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [messages, chatResponse]);

  useEffect(() => {
    if (!isLoading && chatResponse) {
      setShowResponseActions(true);
    } else {
      setShowResponseActions(false);
    }
  }, [isLoading, chatResponse]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleRestoreChat = async (chatId: string) => {
    try {
      const result = await archiveChat(chatId);

      if (result.success) {
        dispatch(setIsArchived(false));
        showToast.success("Chat restored");
      } else {
        showToast.error(result.message || "Failed to restore chat");
      }
    } catch (error) {
      showToast.error("An error occurred while restoring chat");
      console.error("Error restoring chat:", error);
    }
  };

  const [likedMessages, setLikedMessages] = useState<{
    [key: string]: boolean;
  }>({});
  const [dislikedMessages, setDislikedMessages] = useState<{
    [key: string]: boolean;
  }>({});

  const handleLike = async (messageId: string | undefined) => {
    if (!messageId) return;
    try {
      const currentLiked = !likedMessages[messageId];
      const result = await updateLikeStatus(messageId, currentLiked);

      if (result) {
        setLikedMessages((prev) => ({
          ...prev,
          [messageId]: currentLiked,
        }));
        if (currentLiked && dislikedMessages[messageId]) {
          setDislikedMessages((prev) => ({
            ...prev,
            [messageId]: false,
          }));
        }
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  const handleDislike = async (messageId: string | undefined) => {
    if (!messageId) return;
    try {
      const currentDisliked = !dislikedMessages[messageId];
      const result = await updateDislikeStatus(messageId, currentDisliked);

      if (result) {
        setDislikedMessages((prev) => ({
          ...prev,
          [messageId]: currentDisliked,
        }));
        if (currentDisliked && likedMessages[messageId]) {
          setLikedMessages((prev) => ({
            ...prev,
            [messageId]: false,
          }));
        }
      }
    } catch (error) {
      console.error("Error updating dislike status:", error);
    }
  };

  useEffect(() => {
    const newLikedMessages: { [key: string]: boolean } = {};
    const newDislikedMessages: { [key: string]: boolean } = {};

    messages.forEach((msg) => {
      if (msg.id) {
        newLikedMessages[msg.id] = msg.isLiked || false;
        newDislikedMessages[msg.id] = msg.isDisliked || false;
      }
    });

    setLikedMessages(newLikedMessages);
    setDislikedMessages(newDislikedMessages);
  }, [messages]);

  const { mode } = useAppSelector((state) => state.chat);

  return (
    <div className="w-full min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
          {chatName && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal mb-4 sm:mb-6 pt-2 sm:pt-4 
              text-center md:text-left">
              {chatName}
            </h2>
          )}

          <div className="space-y-6 sm:space-y-8">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              if (isUser) {
                return (
                  <div key={index} className="flex justify-end">
                    <div className="space-y-2">
                      <div className="bg-[var(--color-muted)] px-3 sm:px-4 py-1 rounded-2xl 
                        max-w-[280px] sm:max-w-xs md:max-w-md break-words">
                        {msg.content}
                      </div>
                      <div className="flex justify-end">
                        <button
                          className="p-1 text-[var(--color-disabled-text)] hover:text-[var(--color-text)] cursor-pointer"
                          aria-label="Copy to clipboard"
                          onClick={() => copyToClipboard(msg.content, index)}
                        >
                          {copiedIndex === index ? <Check size={isMobile ? 16 : 20} /> : <Copy size={isMobile ? 16 : 20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="space-y-2">
                    <div className="max-w-none markdown-body [&.markdown-body]:!bg-transparent prose prose-invert p-2">
                      {/* Use MarkdownRenderer here */}
                      <MarkdownRenderer
                        content={msg.content}
                        flag={mode === "chart" ? true : false}
                      />
                    </div>
                    <div className="flex items-center space-x-3 text-[var(--color-disabled-text)]">
                      <button
                        className="p-1 hover:text-[var(--color-text)] cursor-pointer"
                        aria-label="Copy to clipboard"
                        onClick={() => copyToClipboard(msg.content, index)}
                      >
                        {copiedIndex === index ? <Check size={isMobile ? 16 : 20} /> : <Copy size={isMobile ? 16 : 20} />}
                      </button>
                      {user && (
                        <>
                          {msg?.id && (
                            <button
                              className={`p-1 transition-colors ${
                                !(
                                  likedMessages[msg.id] ||
                                  dislikedMessages[msg.id]
                                )
                                  ? "hover:text-[var(--color-text)]"
                                  : ""
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                              aria-label="Like"
                              onClick={() => handleLike(msg.id)}
                              disabled={
                                likedMessages[msg.id] ||
                                dislikedMessages[msg.id]
                              }
                            >
                              <ThumbsUp
                                size={isMobile ? 16 : 20}
                                fill={likedMessages[msg.id] ? "currentColor" : "none"}
                                color="currentColor"
                              />
                            </button>
                          )}

                          {msg?.id && (
                            <button
                              className={`p-1 transition-colors ${
                                !(
                                  likedMessages[msg.id] ||
                                  dislikedMessages[msg.id]
                                )
                                  ? "hover:text-[var(--color-text)]"
                                  : ""
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                              aria-label="Dislike"
                              onClick={() => handleDislike(msg.id)}
                              disabled={
                                likedMessages[msg.id] ||
                                dislikedMessages[msg.id]
                              }
                            >
                              <ThumbsDown
                                size={isMobile ? 16 : 20}
                                fill={dislikedMessages[msg.id] ? "currentColor" : "none"}
                                color="currentColor"
                              />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              }
            })}

            {/* Current AI response */}
            {chatResponse && (
              <div className="space-y-2">
                <div className="prose prose-invert max-w-none">
                  {/* Use MarkdownRenderer for AI response */}
                  <MarkdownRenderer content={chatResponse} flag={true} />
                </div>

                {/* Action buttons */}
                {showResponseActions && (
                  <div className="flex items-center space-x-3 text-[var(--color-disabled-text)]">
                    <button
                      className="p-1 hover:text-[var(--color-text)]"
                      aria-label="Copy to clipboard"
                      onClick={() => copyToClipboard(chatResponse, -1)}
                    >
                      {copiedIndex === -1 ? <Check /> : <Copy />}
                    </button>
                    {user && (
                      <>
                        <button
                          className="p-1 hover:text-[var(--color-text)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Like"
                          disabled={
                            likedMessages[chatResponse] ||
                            dislikedMessages[chatResponse]
                          }
                        >
                          <ThumbsUp
                            size={isMobile ? 16 : 20}
                            fill={likedMessages[chatResponse] ? "currentColor" : "none"}
                            color="currentColor"
                          />
                        </button>
                        <button
                          className="p-1 hover:text-[var(--color-text)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Dislike"
                          disabled={
                            likedMessages[chatResponse] ||
                            dislikedMessages[chatResponse]
                          }
                        >
                          <ThumbsDown
                            size={isMobile ? 16 : 20}
                            fill={dislikedMessages[chatResponse] ? "currentColor" : "none"}
                            color="currentColor"
                          />
                        </button>
                      </>
                    )}
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
      <div className="sticky bottom-0 bg-[var(--color-bg)] px-4 py-4 border-t border-[var(--color-border)] z-10">
        {isArchived ? (
          <div className="text-center text-[var(--color-text)]">
            <p className="mb-4">
              This conversation is archived. To continue, please unarchive it
              first.
            </p>
            <button
              onClick={() => {
                handleRestoreChat(chatId);
              }}
              className="bg-[var(--color-primary)] text-[var(--color-button-text)] px-6 py-2 rounded-full font-semibold hover:bg-[var(--color-primary-hover)] transition cursor-pointer"
            >
              <span className="flex items-center">
                <Archive size={16} className="mr-2" />
                Unarchive
              </span>
            </button>
          </div>
        ) : (
          <>
            <PromptInput
              input={input}
              isLoading={isLoading}
              handleInputChange={handleInputChange}
              handleFormSubmit={handleFormSubmit}
              chatId={chatId}
              shareId={shareId}
              sourceChatId={sourceChatId}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatResponse;