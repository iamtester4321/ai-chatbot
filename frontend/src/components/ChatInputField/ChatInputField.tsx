/* eslint-disable @typescript-eslint/no-explicit-any */
import "github-markdown-css/github-markdown-dark.css";
import "highlight.js/styles/github-dark.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useChatActions } from "../../actions/chat.actions";
import { formatMarkdownResponse } from "../../utils/responseRenderer";

const ChatInputField = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  console.log(prefersDark);
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [chatResponse, setChatResponse] = useState<string>("");

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChatActions({
      chatId,
      onResponseUpdate: (text) => {
        setChatResponse(text);
      },
    });

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
  }, [chatId]);

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

  const lastUserMessage = messages
    .filter((msg) => msg.role === "user")
    .slice(-1)[0];

  return (
    <div className="bg-primary min-h-screen text-white">
      {messages.length > 0 && (
        <div className="w-full pt-4 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-normal mb-6 pt-4 text-white">
              {lastUserMessage?.content}
            </h2>

            <div className="markdown-body prose prose-invert max-w-none">
              {messages
                .filter((msg) => msg.role === "assistant")
                .map((msg, index) => (
                  <div
                    key={index}
                    className="text-gray-300"
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdownResponse(msg.content),
                    }}
                  />
                ))}
              {isLoading && (
                <span className="inline-block w-2 h-4 ml-1 bg-[#20b8cd] animate-pulse">
                  |
                </span>
              )}
            </div>
            {chatResponse && (
              <div className="mt-6 text-gray-300">
                <div
                  className="markdown-body prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: formatMarkdownResponse(chatResponse),
                  }}
                />
              </div>
            )}
          </div>
        </div>
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

            <form
              onSubmit={handleFormSubmit}
              className="bg-secondary border border-[#e8e8e61a] flex flex-col rounded-2xl py-3 px-4 w-full"
            >
              <input
                type="text"
                className="outline-none w-full h-12 text-lg text-white pb-1.5 pl-1.5 text-start items-start bg-transparent"
                placeholder="Ask anything..."
                value={input}
                onChange={handleInputChange}
              />

              <div className="max-w-[640px] w-full flex flex-row gap-10 items-center justify-between pt-1">
                <div className="bg-highlight rounded-lg max-w-[88px] w-full flex flex-row items-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group bg-transparent hover:bg-highlight hover:border border-highlight rounded-lg transition-all duration-200 flex flex-row gap-1 items-center cursor-pointer py-1.5 px-2.5"
                  >
                    <span className="text-text group-hover:text-highlight transition-all duration-200 text-sm font-medium">
                      Search
                    </span>
                  </button>
                </div>

                <div className="max-w-[188px] w-full flex flex-row items-center justify-end">
                  <div className="group bg-none hover:bg-secondary-light hover:dark:bg-secondary-dark transition-all duration-200 rounded-lg flex justify-center items-center max-w-[36px] w-full h-[32px] cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 group-hover:stroke-white"
                    >
                      <path d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5"></path>
                    </svg>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-highlight max-w-[36px] w-full h-[32px] cursor-pointer rounded-lg flex justify-center items-center ml-2 hover:bg-[#1a9eb2] transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="M5 12l14 0"></path>
                      <path d="M13 18l6 -6"></path>
                      <path d="M13 6l6 6"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChatInputField;