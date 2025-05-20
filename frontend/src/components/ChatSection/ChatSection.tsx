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

const ChatSection = ({isMobile}: {isMobile: boolean}) => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { shareId } = useParams();
  const dispatch = useAppDispatch();

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

  if (chatId) {
    const loadMessages = async () => {
      const { success, data, error } = await fetchMessages(chatId);
      if (success && data) {
        dispatch(setMessages(data.messages));
        dispatch(setChatName(data.name));
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
}, [chatId, dispatch, generatedChatId]);
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
        const { success, data, error } = await fetchMessagesByShareId(shareId);
        if (success && data) {
          dispatch(setMessages(data.messages));
        } else {
          console.error(error);
        }
      };

      loadMessagesByShareId();
    }
  }, [chatId, dispatch]);

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

  return (
    <div className="bg-background-primary text-text-primary min-h-dvh sm:min-h-0">
      {error && chatId !== generatedChatId ? (
        <Error message={error} onNewChat={handleNewChat} />
      ) : (
        <>
          {messages.length > 0 && (
            <ChatResponse
              messages={messages}
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

          <section
            className={`${messages.length > 0 ? "" : "pt-[100px] sm:pt-[150px] md:pt-[200px]"} 
            h-100vh transition-all duration-300`}>
            <div className="container px-4 sm:px-6 md:px-8">
              <div className="max-w-[640px] w-full items-center mx-auto flex flex-col gap-12 sm:gap-16 md:gap-24">
                {messages.length === 0 && !shareId && !chatId &&(
                  <h3 className="text-[48px] text-text-secondary font-light text-center font-inter hidden md:block">
                    Aivora
                  </h3>
                )}
                {messages.length === 0 && !shareId && !chatId &&(

                <h3
                  className={`text-3xl sm:text-4xl md:text-[48px] text-text-secondary font-light text-center font-inter ${
                    messages.length > 0 ? "hidden" : "block md:hidden"
                  }`}
                >
                  Aivora
                </h3>
                )}
                
                {!chatId && !shareId && (
                  <PromptInput
                    input={input}
                    isLoading={isLoading}
                    handleInputChange={handleInputChange}
                    handleFormSubmit={handleFormSubmit}
                  />
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ChatSection;
