import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  fetchMessages,
  fetchMessagesByShareId,
  useChatActions,
} from "../../actions/chat.actions";
import {
  setChatName,
  setCurrentResponse,
  setIsArchived,
  setIsLoading,
  setMessages,
} from "../../store/features/chat/chatSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import ChatResponse from "./ChatResponse";
import PromptInput from "./PromptInput";
import Error from "../Common/Error";
import { decryptMessage } from "../../utils/encryption.utils";
import Spinner from "../Spinner";

const ChatSection = ({ isMobile }: { isMobile: boolean }) => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { shareId } = useParams();

  const dispatch = useAppDispatch();

  const [showRegenerate, setShowRegenerate] = useState(false);

  const { messages, currentResponse, chatName } = useAppSelector(
    (state) => state.chat
  );

  const [error, setError] = useState<string | null>(null);
  const [generatedChatId, setGeneratedChatId] = useState<string | null>(null);

  const { input, handleInputChange, handleSubmit, isLoading } = useChatActions({
    chatId,
    onResponseUpdate: (text) => {
      dispatch(setCurrentResponse(text));
    },
  });

  useEffect(() => {
    setError(null);
    if (shareId) return;

    if (chatId) {
      const loadMessages = async () => {
        dispatch(setIsLoading(true));
        const { success, data, error } = await fetchMessages(chatId);
        dispatch(setIsLoading(false));

        if (success && data) {
          dispatch(setMessages(data.messages));
          const decryptedName = await decryptMessage(data.name);
          dispatch(setChatName(decryptedName));
          dispatch(setIsArchived(data.isArchived));
          setError(null);
        } else {
          console.error(error);
          if (chatId !== generatedChatId) {
            setError(
              "Chat not found. This chat might have been deleted or doesn't exist."
            );
            dispatch(setMessages([]));
          }
        }
      };

      loadMessages();
    } else {
      dispatch(setMessages([]));
    }
  }, [chatId, shareId, dispatch, generatedChatId]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chatId) {
      const newChatId = generateChatId();
      setGeneratedChatId(newChatId);
      sessionStorage.setItem("initialPrompt", input);
      navigate(`/chat/${newChatId}`, { replace: true });
      return;
    }
    dispatch(setIsLoading(true));
    await handleSubmit(e);
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    if (shareId) {
      const loadMessagesByShareId = async () => {
        dispatch(setIsLoading(true));
        const { success, data, error } = await fetchMessagesByShareId(shareId);

        dispatch(setChatName(data.name));

        dispatch(setIsLoading(false));

        if (success && data) {
          dispatch(setMessages(data.messages));
        } else {
          console.error(error);
        }
      };

      loadMessagesByShareId();
    }
  }, [shareId, dispatch]);

  useEffect(() => {
    const storedPrompt = sessionStorage.getItem("initialPrompt");

    if (storedPrompt && chatId) {
      const inputElement = document.createElement("input");
      inputElement.value = storedPrompt;
      const event = {
        target: inputElement,
      } as React.ChangeEvent<HTMLInputElement>;

      handleInputChange(event);
      handleSubmit(new Event("submit") as any);
      sessionStorage.removeItem("initialPrompt");
    }
  }, [chatId, messages.length, handleInputChange, handleSubmit]);

  const generateChatId = () => {
    return uuidv4();
  };
  useEffect(() => {
    const handleCopyClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains("copy-button")) {
        const code = target.parentElement?.querySelector("pre code");
        if (code) {
          const text = code.textContent || "";
          navigator.clipboard.writeText(text).then(() => {
            target.textContent = "Copied!";
            setTimeout(() => {
              target.textContent = "Copy";
            }, 2000);
          });
        }
      }
    };

    document.addEventListener("click", handleCopyClick);
    return () => document.removeEventListener("click", handleCopyClick);
  }, [messages]);

  const handleNewChat = () => {
    setError(null);
    navigate("/chat");
  };

  const handleRegenerate = async () => {
    setShowRegenerate(false);
    dispatch(setIsLoading(true));
    await handleSubmit(new Event("submit") as any);
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    if (isLoading && messages.length > 0) {
      const timeout = setTimeout(() => {
        if (!currentResponse) {
          setShowRegenerate(true);
        }
      }, 10000);

      return () => clearTimeout(timeout);
    } else {
      setShowRegenerate(false);
    }
  }, [isLoading, currentResponse, messages.length]);

  // Get mode from Redux
  const mode = useAppSelector((state) => state.chat.mode);

  // Filter messages by mode
  const chatMessages = messages.filter((msg) => (msg as any).for !== "chart");
  const chartMessages = messages.filter((msg) => (msg as any).for === "chart");

  return (
    <div className="bg-background-primary text-text-primary min-h-dvh sm:min-h-0">
      {isLoading && messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-screen text-center">
          {showRegenerate ? (
            <button
              onClick={handleRegenerate}
              className="px-4 py-2 bg-gold text-white rounded hover:bg-opacity-80 transition"
            >
              Regenerate
            </button>
          ) : (
            <>
              <Spinner />
              <div className="mt-2 animate-fade-in-up text-text-secondary">
                <p className="text-lg sm:text-xl font-medium tracking-wide">
                  Getting you started with
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-gold font-inter drop-shadow-glow">
                  Aivora
                </h1>
              </div>
            </>
          )}
        </div>
      ) : error && chatId !== generatedChatId ? (
        <Error message={error} onNewChat={handleNewChat} />
      ) : (
        <>
          {/* Render Chat or Chart section based on mode */}
          {mode === "chat" && messages.length > 0 && (
            <ChatResponse
              messages={chatMessages}
              chatResponse={currentResponse}
              isLoading={isLoading}
              chatName={chatName}
              input={input}
              handleInputChange={handleInputChange}
              handleFormSubmit={handleFormSubmit}
              chatId={chatId || ""}
              shareId={shareId || ""}
              isMobile={isMobile}
            />
          )}
          {mode === "chart" && messages.length > 0 && (
            <ChatResponse
              messages={chartMessages}
              chatResponse={currentResponse}
              isLoading={isLoading}
              chatName={chatName}
              input={input}
              handleInputChange={handleInputChange}
              handleFormSubmit={handleFormSubmit}
              chatId={chatId || ""}
              shareId={shareId || ""}
              isMobile={isMobile}
            />
          )}

          {((mode === "chat" && chatMessages.length === 0) ||
            (mode === "chart" && chartMessages.length === 0)) &&
          !shareId &&
          !chatId ? (
            <section className="pt-[100px] sm:pt-[150px] md:pt-[200px] overflow-hidden">
              <div className="container px-4 sm:px-6 md:px-8">
                <div className="max-w-[640px] w-full items-center mx-auto flex flex-col gap-6 sm:gap-8 md:gap-12">
                  <h3 className="text-[48px] text-text-secondary font-light text-center font-inter hidden md:block">
                    Aivora
                  </h3>
                  <h3 className="text-3xl sm:text-4xl md:text-[48px] text-text-secondary font-light text-center font-inter md:hidden">
                    Aivora
                  </h3>

                  <PromptInput
                    input={input}
                    isLoading={isLoading}
                    handleInputChange={handleInputChange}
                    handleFormSubmit={handleFormSubmit}
                  />
                </div>
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
};

export default ChatSection;
