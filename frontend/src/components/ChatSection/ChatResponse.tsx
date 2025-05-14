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
import { formatMarkdownResponse } from "../../utils/responseRenderer";
import StreamLoader from "../StreamLoader/StreamLoader";
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
}: ChatResponseProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showResponseActions, setShowResponseActions] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const isArchived = useAppSelector((state) => state.chat.isArchived);
  const showToast = useToast();
  const dispatch = useAppDispatch();

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
                      className="p-1 hover:text-white cursor-pointer"
                      aria-label="Copy to clipboard"
                      onClick={() => copyToClipboard(msg.content, index)}
                    >
                      {copiedIndex === index ? <Check /> : <Copy />}
                    </button>
                    {!shareId && (
                      <>
                        {msg?.id && (
                          <button
                            className="p-1 hover:text-white transition-colors"
                            aria-label="Like"
                            onClick={() => handleLike(msg.id)}
                          >
                            <ThumbsUp
                              size={20}
                              fill={
                                likedMessages[msg.id] ? "currentColor" : "none"
                              }
                              color={
                                likedMessages[msg.id]
                                  ? "currentColor"
                                  : "currentColor"
                              }
                            />
                          </button>
                        )}

                        {msg?.id && (
                          <button
                            className="p-1 hover:text-white transition-colors"
                            aria-label="Dislike"
                            onClick={() => handleDislike(msg.id)}
                          >
                            <ThumbsDown
                              size={20}
                              fill={
                                dislikedMessages[msg.id]
                                  ? "currentColor"
                                  : "none"
                              }
                              color={
                                dislikedMessages[msg.id]
                                  ? "currentColor"
                                  : "currentColor"
                              }
                            />
                          </button>
                        )}
                      </>
                    )}
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
                      onClick={() => copyToClipboard(chatResponse, -1)}
                    >
                      {copiedIndex === -1 ? <Check /> : <Copy />}
                    </button>
                    {!shareId && (
                      <>
                        <button
                          className="p-1 hover:text-white transition-colors"
                          aria-label="Like"
                        >
                          <ThumbsUp
                            size={20}
                            fill={
                              likedMessages[chatResponse]
                                ? "currentColor"
                                : "none"
                            }
                            color={
                              likedMessages[chatResponse]
                                ? "currentColor"
                                : "currentColor"
                            }
                          />
                        </button>
                        <button
                          className="p-1 hover:text-white transition-colors"
                          aria-label="Dislike"
                        >
                          <ThumbsDown
                            size={20}
                            fill={
                              dislikedMessages[chatResponse]
                                ? "currentColor"
                                : "none"
                            }
                            color={
                              dislikedMessages[chatResponse]
                                ? "currentColor"
                                : "currentColor"
                            }
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
      <div className="sticky bottom-0 bg-[#1a1a1a] px-4 py-4 border-t border-[#2a2a2a] z-10">
        {isArchived ? (
          <div className="text-center text-white">
            <p className="mb-4">
              This conversation is archived. To continue, please unarchive it
              first.
            </p>
            <button
              onClick={() => {
                handleRestoreChat(chatId);
              }}
              className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition cursor-pointer"
            >
              <span className="flex items-center">
                <Archive size={16} className="mr-2" />
                Unarchive
              </span>
            </button>
          </div>
        ) : (
          <>
            {!shareId && (
              <PromptInput
                input={input}
                isLoading={isLoading}
                handleInputChange={handleInputChange}
                handleFormSubmit={handleFormSubmit}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatResponse;
