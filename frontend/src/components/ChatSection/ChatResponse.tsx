import { Archive, BarChart3, MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { archiveChat, createChatFromSource } from "../../actions/chat.actions";
import {
  updateDislikeStatus,
  updateLikeStatus,
} from "../../actions/message.actions";
import useToast from "../../hooks/useToast";
import { ChatResponseProps } from "../../lib/types";
import { setIsArchived } from "../../store/features/chat/chatSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import MarkdownRenderer from "../../utils/responseRenderer";
import { Skeleton } from "../Loaders";
import StreamLoader from "../Loaders/StreamLoader";
import ChatMessageThread from "./ChatMessageThread";
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
  isMobile,
  sourceChatId,
}: ChatResponseProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.user.user);
  // const [showResponseActions, setShowResponseActions] = useState(false);
  const mode = useAppSelector((state) => state.chat.mode);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const isArchived = useAppSelector((state) => state.chat.isArchived);

  const showToast = useToast();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isSharedChat = location.pathname.startsWith("/share/");

  const [likedMessages, setLikedMessages] = useState<{
    [key: string]: boolean;
  }>({});
  const [dislikedMessages, setDislikedMessages] = useState<{
    [key: string]: boolean;
  }>({});

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
    const element = messagesEndRef.current;
    if (!element) return;

    const container = element.parentElement;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    if (isNearBottom) {
      element.scrollIntoView({ block: "center" });
    }
  }, [messages, chatResponse]);

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

  const handleCreateChatFromSource = async () => {
    if (!sourceChatId) {
      showToast.error("Source chat ID is missing");
      return;
    }
    const newChatId = uuidv4();

    const result = await createChatFromSource(
      newChatId,
      sourceChatId,
      messages
    );

    if (result.success) {
      showToast.success("Chat created from shared source");
      navigate(`/chat/${newChatId}`);
    } else {
      showToast.error(result.message || "Failed to create chat from source");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col ">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-border)] scrollbar-track-transparent scrollbar-thumb-rounded-md">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
          {/* Skeleton Loader for chatName */}
          {user && !chatName ? (
            <Skeleton className="w-1/2 h-8 mb-4 sm:mb-6" />
          ) : (
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-normal mb-4 sm:mb-6 pt-2 sm:pt-4 
              text-center md:text-left"
            >
              {chatName.length >= 50 ? chatName.concat("...") : chatName}
            </h2>
          )}
          {messages.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
              {mode === "chart" ? (
                <BarChart3
                  size={48}
                  className="mb-4 text-[var(--color-disabled-text)]"
                />
              ) : (
                <MessageSquare
                  size={48}
                  className="mb-4 text-[var(--color-disabled-text)]"
                />
              )}
              <p className="text-lg sm:text-xl font-medium">
                No {mode === "chart" ? "charts" : "messages"} yet.
              </p>
              <p className="text-sm sm:text-base mt-2">
                Start{" "}
                {mode === "chart" ? "generating charts" : "the conversation"} by
                typing a prompt below.
              </p>
            </div>
          )}
          <div className="space-y-6 sm:space-y-8">
            {/* Using ChatMessageThread to render the chat messages */}
            <ChatMessageThread
              messages={messages}
              isMobile={isMobile}
              onCopy={(text, index) => {
                navigator.clipboard.writeText(text).then(() => {
                  setCopiedIndex(index);
                  setTimeout(() => setCopiedIndex(null), 2000);
                });
              }}
              copiedIndex={copiedIndex}
              likedMessages={likedMessages}
              dislikedMessages={dislikedMessages}
              onLike={handleLike}
              onDislike={handleDislike}
            />

            {chatResponse && (
              <div className="space-y-2">
                <div className="prose prose-invert max-w-none">
                  <MarkdownRenderer content={chatResponse} flag={true} />
                </div>
              </div>
            )}

            {isLoading && <StreamLoader />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

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
        ) : isSharedChat && user ? (
          <div className="text-center">
            <button
              onClick={handleCreateChatFromSource}
              className="bg-[var(--color-primary)] text-[var(--color-button-text)] px-6 py-2 rounded-full font-semibold hover:bg-[var(--color-primary-hover)] transition cursor-pointer"
            >
              Interact with this chat
            </button>
          </div>
        ) : (
          <PromptInput
            input={input}
            handleInputChange={handleInputChange}
            handleFormSubmit={handleFormSubmit}
            isLoading={isLoading}
            chatId={chatId}
          />
        )}
      </div>
    </div>
  );
};

export default ChatResponse;
