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
import StreamLoader from "../StreamLoader/StreamLoader";
import PromptInput from "./PromptInput";
import MarkdownRenderer from "../../utils/responseRenderer";
import { decryptMessage } from "../../utils/encryption.utils";

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: string;
  isLiked?: boolean;
  isDisliked?: boolean;
}

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
  const [decryptedMessages, setDecryptedMessages] = useState<Message[]>([]);
  const [decryptedResponse, setDecryptedResponse] = useState("");

  // Decrypt all messages when they change
  useEffect(() => {
    const decryptAllMessages = async () => {
      try {
        const decrypted = await Promise.all(
          messages.map(async (msg: Message) => {
            try {
              const decryptedContent = await decryptMessage(msg.content);
              return {
                ...msg,
                content: decryptedContent,
              };
            } catch (error) {
              console.error("Failed to decrypt message:", msg.content, error);
              return msg; // Return original message if decryption fails
            }
          })
        );
        setDecryptedMessages(decrypted);
      } catch (error) {
        console.error("Error decrypting messages:", error);
        setDecryptedMessages(messages); // Fallback to original messages
      }
    };

    decryptAllMessages();
  }, [messages]);

  // Decrypt the streaming response
  useEffect(() => {
    const decryptStreamingResponse = async () => {
      if (chatResponse) {
        try {
          const decrypted = await decryptMessage(chatResponse);
          setDecryptedResponse(decrypted);
        } catch (error) {
          console.error("Failed to decrypt response:", chatResponse, error);
          setDecryptedResponse(chatResponse); 
        }
      } else {
        setDecryptedResponse("");
      }
    };

    decryptStreamingResponse();
  }, [chatResponse]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [decryptedMessages, decryptedResponse]);

  useEffect(() => {
    if (!isLoading && decryptedResponse) {
      setShowResponseActions(true);
    } else {
      setShowResponseActions(false);
    }
  }, [isLoading, decryptedResponse]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        showToast.error("Failed to copy text");
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
      showToast.error("Failed to update like status");
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
      showToast.error("Failed to update dislike status");
    }
  };

  useEffect(() => {
    const newLikedMessages: { [key: string]: boolean } = {};
    const newDislikedMessages: { [key: string]: boolean } = {};

    decryptedMessages.forEach((msg) => {
      if (msg.id) {
        newLikedMessages[msg.id] = msg.isLiked || false;
        newDislikedMessages[msg.id] = msg.isDisliked || false;
      }
    });

    setLikedMessages(newLikedMessages);
    setDislikedMessages(newDislikedMessages);
  }, [decryptedMessages]);

  return (
    <div className="w-full min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-4 md:px-8 py-10">
          {chatName && (
            <h2 className="text-3xl md:text-4xl font-normal mb-6 pt-4 text-center md:text-left">
              {chatName}
            </h2>
          )}

          <div className="space-y-8">
            {/* All decrypted messages */}
            {decryptedMessages.map((msg, index) => {
              const isUser = msg.role === "user";

              if (isUser) {
                return (
                  <div key={index} className="flex justify-end">
                    <div className="bg-[var(--color-muted)] text-[var(--color-text)] px-4 py-2 rounded-2xl max-w-full sm:max-w-xs md:max-w-md">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              return (
                <div key={index} className="space-y-2">
                  <div className="max-w-none markdown-body [&.markdown-body]:!bg-transparent prose prose-invert p-2">
                    <MarkdownRenderer content={msg.content} />
                  </div>
                  <div className="flex items-center space-x-3 text-[var(--color-disabled-text)]">
                    <button
                      className="p-1 hover:text-[var(--color-text)] cursor-pointer"
                      aria-label="Copy to clipboard"
                      onClick={() => copyToClipboard(msg.content, index)}
                    >
                      {copiedIndex === index ? <Check /> : <Copy />}
                    </button>
                    {!shareId && (
                      <>
                        {msg?.id && (
                          <button
                            className="p-1 hover:text-[var(--color-text)] transition-colors"
                            aria-label="Like"
                            onClick={() => handleLike(msg.id)}
                          >
                            <ThumbsUp
                              size={20}
                              fill={
                                likedMessages[msg.id] ? "currentColor" : "none"
                              }
                            />
                          </button>
                        )}

                        {msg?.id && (
                          <button
                            className="p-1 hover:text-[var(--color-text)] transition-colors"
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
                            />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Current decrypted AI response */}
            {decryptedResponse && (
              <div className="space-y-2">
                <div className="prose prose-invert max-w-none">
                  <MarkdownRenderer content={decryptedResponse} />
                </div>

                {/* Action buttons */}
                {showResponseActions && (
                  <div className="flex items-center space-x-3 text-[var(--color-disabled-text)]">
                    <button
                      className="p-1 hover:text-[var(--color-text)]"
                      aria-label="Copy to clipboard"
                      onClick={() => copyToClipboard(decryptedResponse, -1)}
                    >
                      {copiedIndex === -1 ? <Check /> : <Copy />}
                    </button>
                    {!shareId && (
                      <>
                        <button
                          className="p-1 hover:text-[var(--color-text)] transition-colors"
                          aria-label="Like"
                        >
                          <ThumbsUp
                            size={20}
                            fill={
                              likedMessages[decryptedResponse]
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                        <button
                          className="p-1 hover:text-[var(--color-text)] transition-colors"
                          aria-label="Dislike"
                        >
                          <ThumbsDown
                            size={20}
                            fill={
                              dislikedMessages[decryptedResponse]
                                ? "currentColor"
                                : "none"
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
      <div className="sticky bottom-0 bg-[var(--color-bg)] px-4 py-4 border-t border-[var(--color-border)] z-10">
        {isArchived ? (
          <div className="text-center text-[var(--color-text)]">
            <p className="mb-4">
              This conversation is archived. To continue, please unarchive it
              first.
            </p>
            <button
              onClick={() => {
                if (chatId) handleRestoreChat(chatId);
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