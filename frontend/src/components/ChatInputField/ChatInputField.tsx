import "github-markdown-css/github-markdown-dark.css";
import "highlight.js/styles/github-dark.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useChatActions } from "../../actions/chat.actions";
import MessageDisplay from "../MessageDisplay/MessageDisplay";
import PromptInput from "../PromptInput/PromptInput";
import { BASE_API } from "../../lib/apiUrl";

const ChatInputField = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [chatResponse, setChatResponse] = useState<string>("");
  const [chatName, setChatName] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const { input, handleInputChange, handleSubmit, isLoading } = useChatActions({
    chatId,
    onResponseUpdate: (text) => {
      setChatResponse(text);
    },
  });

  useEffect(() => {
    if (chatId) {
      const fetchMessages = async () => {
        try {
      
          const response = await fetch(`${BASE_API}/api/chat/${chatId}`, {
            method: 'GET',
            credentials: 'include',
          });
      
          const text = await response.text();
      
          if (response.ok) {
            const data = JSON.parse(text);
            setMessages(data.messages);
            setChatName(data.name);
          } else {
            console.error("Failed to fetch messages for chatId:", chatId);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      

      fetchMessages();
    }
  }, [chatId]);

  useEffect(() => {
    const storedPrompt = sessionStorage.getItem("initialPrompt");

    if (storedPrompt && chatId && messages.length === 0) {
      const inputElement = document.createElement("input");
      inputElement.value = storedPrompt;
      const event = {
        target: inputElement,
      } as React.ChangeEvent<HTMLInputElement>;

      handleInputChange(event);

      setTimeout(() => {
        handleSubmit(new Event("submit") as any);
      }, 0);

      sessionStorage.removeItem("initialPrompt");
    }
  }, [chatId, messages.length]);

  const generateChatId = () => {
    return uuidv4();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatId) {
      const newChatId = generateChatId();
      sessionStorage.setItem("initialPrompt", input);
      navigate(`/chat/${newChatId}`, { replace: true });
      return;
    }
    handleSubmit(e);
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

  return (
    <div className="bg-[#121212] min-h-screen text-white">
      {messages.length > 0 && (
        <MessageDisplay
          messages={messages}
          chatResponse={chatResponse}
          isLoading={isLoading}
          chatName={chatName}
        />
      )}

      <section
        className={`${
          messages.length > 0 ? "pt-8" : "pt-[200px]"
        } h-100vh transition-all duration-300`}
      >
        <div className="container">
          <div className="max-w-[640px] w-full items-center mx-auto flex flex-col gap-24 sm:gap-6">
            {messages.length === 0 && (
              <h3 className="text-[48px] text-[#ffffffd6] font-light text-center font-inter hidden md:block">
                Ai-chatbot
              </h3>
            )}
            <h3
              className={`text-3xl sm:text-4xl md:text-[48px] text-[#ffffffd6] font-light text-center font-inter ${
                messages.length > 0 ? "hidden" : "block md:hidden"
              }`}
            >
              What do you want to know?
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
    </div>
  );
};

export default ChatInputField;
