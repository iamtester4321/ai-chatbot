import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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

const ChatSection = ({ isMobile }: { isMobile: boolean }) => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { chatId, shareId } = useParams<{ chatId: string; shareId: string }>();
  const dispatch = useAppDispatch();

  const { messages, currentResponse, chatName } = useAppSelector((s) => s.chat);
  const [error, setError] = useState<string | null>(null);
  const [generatedChatId, setGeneratedChatId] = useState<string | null>(null);

  const params = new URLSearchParams(search);
  const mode = params.get("mode") === "chart" ? "chart" : "text";

  const filtered = messages.filter((m) => m.type === mode);

  const { input, handleInputChange, handleSubmit, isLoading } = useChatActions({
    chatId,
    onResponseUpdate: (t) => dispatch(setCurrentResponse(t)),
  });

  useEffect(() => {
    setError(null);
    if (!chatId) {
      dispatch(setMessages([]));
      return;
    }
    (async () => {
      const { success, data } = await fetchMessages(chatId);
      if (success && data) {
        dispatch(setMessages(data.messages));
        dispatch(setChatName(await decryptMessage(data.name)));
        dispatch(setIsArchived(data.isArchived));
      } else if (chatId !== generatedChatId) {
        setError("Chat not found or deleted.");
        dispatch(setMessages([]));
      }
    })();
  }, [chatId, dispatch, generatedChatId]);

  useEffect(() => {
    if (!shareId) return;
    (async () => {
      const { success, data } = await fetchMessagesByShareId(shareId);
      if (success) dispatch(setMessages(data.messages));
    })();
  }, [shareId, dispatch]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatId) {
      const newId = uuidv4();
      setGeneratedChatId(newId);
      sessionStorage.setItem("initialPrompt", input);
      navigate(
        `/chat/${newId}${mode === "chart" ? "?mode=chart" : ""}`,
        { replace: true }
      );
      return;
    }
    dispatch(setIsLoading(true));
    await handleSubmit(e);
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("initialPrompt");
    if (stored && chatId) {
      handleInputChange({ target: { value: stored } } as any);
      handleSubmit(new Event("submit") as any);
      sessionStorage.removeItem("initialPrompt");
    }
  }, [chatId, filtered.length]);

  const handleNewChat = () =>
    navigate(`/chat${mode === "chart" ? "?mode=chart" : ""}`);

  return (
    <div className="bg-background-primary text-text-primary min-h-dvh sm:min-h-0">
      {error && chatId !== generatedChatId ? (
        <Error message={error} onNewChat={handleNewChat} />
      ) : (
        <>
          {filtered.length > 0 && (
            <ChatResponse
              messages={filtered}
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

          {/* Always render input so user can send in chart mode too */}
          <section
            className={`${
              messages.length === 0 ? "pt-[100px] sm:pt-[150px] md:pt-[200px]" : ""
            } h-100vh transition-all duration-300`}
          >
            <div className="container px-4 sm:px-6 md:px-8">
              <div className="max-w-[640px] w-full items-center mx-auto flex flex-col gap-6 sm:gap-8 md:gap-12">
                {/* Display "Aivora" when there are no messages, chatId, or shareId */}
                {messages.length === 0 && !shareId && !chatId && (
                  <h3 className="text-[48px] text-text-secondary font-light text-center font-inter hidden md:block">
                    Aivora
                  </h3>
                )}
  
                {messages.length === 0 && !shareId && !chatId && (
                  <h3 className="text-3xl sm:text-4xl md:text-[48px] text-text-secondary font-light text-center font-inter md:hidden">
                    Aivora
                  </h3>
                )}

                <PromptInput
                  input={input}
                  isLoading={isLoading}
                  handleInputChange={handleInputChange}
                  handleFormSubmit={handleFormSubmit}
                />
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ChatSection;
