import {
  ArchiveRestore,
  BarChart3,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { archiveChat, createChatFromSource } from "../../actions/chat.actions";
import {
  updateDislikeStatus,
  updateLikeStatus,
} from "../../actions/message.actions";
import useToast from "../../hooks/useToast";
import { ChatResponseProps, Message } from "../../lib/types";
import { setIsArchived, setMode } from "../../store/features/chat/chatSlice";
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
  const mode = useAppSelector((state) => state.chat.mode);
  const isArchived = useAppSelector((state) => state.chat.isArchived);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isSharedChat = location.pathname.startsWith("/share/");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isUnarchiving, setIsUnarchiving] = useState(false);
  const [isCreatingFromSource, setIsCreatingFromSource] = useState(false);
  const showToast = useToast();

  const [likedMessages, setLikedMessages] = useState<{
    [key: string]: boolean;
  }>({});
  const [dislikedMessages, setDislikedMessages] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const newLiked: { [key: string]: boolean } = {};
    const newDisliked: { [key: string]: boolean } = {};
    messages.forEach((msg) => {
      if (msg.id) {
        newLiked[msg.id] = msg.isLiked || false;
        newDisliked[msg.id] = msg.isDisliked || false;
      }
    });
    setLikedMessages(newLiked);
    setDislikedMessages(newDisliked);
  }, [messages]);

  const handleLike = async (messageId: string | undefined) => {
    if (!messageId) return;
    try {
      const currentLiked = !likedMessages[messageId];
      const result = await updateLikeStatus(messageId, currentLiked);
      if (result) {
        setLikedMessages((prev) => ({ ...prev, [messageId]: currentLiked }));
        if (currentLiked && dislikedMessages[messageId]) {
          setDislikedMessages((prev) => ({ ...prev, [messageId]: false }));
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
          setLikedMessages((prev) => ({ ...prev, [messageId]: false }));
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
      setIsUnarchiving(true);
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
    } finally {
      setIsUnarchiving(false);
    }
  };

  const handleCreateChatFromSource = async () => {
    if (!sourceChatId) {
      showToast.error("Source chat ID is missing");
      return;
    }
    try {
      if (isCreatingFromSource) return;
      setIsCreatingFromSource(true);
      const newChatId = uuidv4();
      const result = await createChatFromSource(
        newChatId,
        sourceChatId,
        messages
      );
      if (result.success) {
        navigate(`/chat/${newChatId}`);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsCreatingFromSource(false);
    }
  };

  const filteredMessages =
    isSharedChat || isArchived
      ? messages.filter((msg) =>
          mode === "chat"
            ? (msg as Message).for !== "chart"
            : (msg as Message).for === "chart"
        )
      : messages;

  return (
    <div className="w-full h-full bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-border)] scrollbar-track-transparent scrollbar-thumb-rounded-md">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
          {user && !chatName ? (
            <Skeleton className="w-1/2 h-8 mb-4 sm:mb-6" />
          ) : (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal mb-4 sm:mb-6 pt-2 sm:pt-4 text-center md:text-left">
              {chatName.length >= 50 ? chatName.concat("...") : chatName}
            </h2>
          )}

          {filteredMessages.length === 0 && !isLoading && (
            <div className="w-full flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
              {mode === "chart" || !isSharedChat ? (
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

          <ChatMessageThread
            messages={filteredMessages}
            isMobile={isMobile}
            onCopy={async (msg, index) => {
              try {
                await navigator.clipboard.writeText(msg);
                setCopiedIndex(index);
                setTimeout(() => setCopiedIndex(null), 2000);
              } catch (error) {
                console.error("Failed to copy text:", error);
              }
            }}
            copiedIndex={copiedIndex}
            likedMessages={likedMessages}
            dislikedMessages={dislikedMessages}
            onLike={handleLike}
            onDislike={handleDislike}
          />

          {chatResponse && (
            <div className="prose prose-invert max-w-none mt-6">
              <MarkdownRenderer
                content={chatResponse}
                flag={mode === "chart"}
              />
            </div>
          )}

          {isLoading && <StreamLoader />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-[var(--color-bg)] px-4 py-4 border-t border-[var(--color-border)]">
        {isArchived ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="flex items-center bg-[var(--color-muted)] rounded-2xl p-1 w-fit">
                <button
                  type="button"
                  onClick={() => dispatch(setMode("chat"))}
                  className={`flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-xl transition-all cursor-pointer
  ${
    mode === "chat"
      ? "bg-[var(--color-primary)] text-[var(--color-button-text)] shadow-sm"
      : "text-[color:var(--color-disabled-text)] hover:text-[color:var(--color-text)]"
  }`}
                >
                  <MessageSquare size={16} />
                  Chat
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(setMode("chart"))}
                  className={`flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-xl transition-all cursor-pointer
  ${
    mode === "chart"
      ? "bg-[var(--color-primary)] text-[var(--color-button-text)] shadow-sm"
      : "text-[color:var(--color-disabled-text)] hover:text-[color:var(--color-text)]"
  }`}
                >
                  <BarChart3 size={16} />
                  Chart
                </button>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleRestoreChat(chatId)}
                disabled={isUnarchiving}
                className="flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-button-text)] px-6 py-2 rounded-full font-semibold hover:bg-[var(--color-primary-hover)] transition cursor-pointer"
              >
                {isUnarchiving ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />{" "}
                    Restoring...
                  </>
                ) : (
                  <>
                    <ArchiveRestore size={16} /> Restore Chat
                  </>
                )}
              </button>
            </div>
          </>
        ): (
          <PromptInput
            input={input}
            handleInputChange={handleInputChange}
            handleFormSubmit={handleFormSubmit}
            isLoading={isLoading}
            chatId={chatId}
            shareId={sourceChatId ?? undefined}
            isSharedChat={isSharedChat}
            onInteractWithSharedChat={handleCreateChatFromSource}
          />
        )}
      </div>
    </div>
  );
};

export default ChatResponse;
