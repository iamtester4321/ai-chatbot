import "github-markdown-css/github-markdown-dark.css";
import "highlight.js/styles/github-dark.css";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { STREAM_CHAT_RESPONSE } from "../../lib/apiUrl";
import { formatMarkdownResponse } from "../../utils/responseRenderer";
import { fetcher } from "../../utils/streamProcessor";

const ChatInputField = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isMessageSent, setIsMessageSent] = useState<boolean>(false);
  const [streamedResponse, setStreamedResponse] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const { mutate } = useSWR(
    isMessageSent ? [STREAM_CHAT_RESPONSE, currentMessage] : null,
    async ([url, prompt]: [string, string]) => {
      setIsStreaming(true);
      const streamProcessor = await fetcher(url, prompt);
      await streamProcessor((text: string) => {
        setStreamedResponse(text);
      });
      setIsStreaming(false);
    },
    { revalidateOnFocus: false }
  );

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
  }, [streamedResponse]);

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = useCallback(() => {
    if (inputValue.trim()) {
      setCurrentMessage(inputValue);
      setIsMessageSent(true);
      setInputValue("");
      setStreamedResponse("");
      mutate();
    }
  }, [inputValue, mutate]);

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-[#121212] min-h-screen text-white">
      {isMessageSent && (
        <div className="w-full pt-4 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-normal mb-6 pt-4 text-white">
              {currentMessage}
            </h2>
            <div className="markdown-body prose prose-invert max-w-none">
              <div
                className="text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: formatMarkdownResponse(streamedResponse),
                }}
              />
              {isStreaming && (
                <span className="inline-block w-2 h-4 ml-1 bg-[#20b8cd] animate-pulse">
                  |
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <section
        className={`${
          isMessageSent ? "pt-8" : "pt-[200px]"
        } h-100vh transition-all duration-300`}
      >
        <div className="container">
          <div className="max-w-[640px] w-full items-center mx-auto flex flex-col gap-24 sm:gap-6">
            {!isMessageSent && (
              <h3 className="text-[48px] text-[#ffffffd6] font-light text-center font-inter hidden md:block">
                Ai-Chatbot
              </h3>
            )}
            <h3
              className={`text-3xl sm:text-4xl md:text-[48px] text-[#ffffffd6] font-light text-center font-inter ${
                isMessageSent ? "hidden" : "block md:hidden"
              }`}
            >
              What do you want to know?
            </h3>

            <div className="bg-[#202222] border border-[#e8e8e61a] flex flex-col rounded-2xl py-3 px-4 w-full">
              <input
                type="text"
                className="outline-none w-full h-12 text-lg text-gray-200 pb-1.5 pl-1.5 text-start items-start bg-transparent"
                placeholder="Ask anything..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />

              <div className="max-w-[640px] w-full flex flex-row gap-10 items-center justify-between pt-1">
                <div className="bg-[#1e1c1c] rounded-lg max-w-[88px] w-full flex flex-row items-center">
                  <button className="group bg-transparent hover:bg-[#20b8cd1a] hover:border border-[#20b8cd1a] rounded-lg transition-all duration-200 flex flex-row gap-1 items-center cursor-pointer py-1.5 px-2.5">
                    <span className="text-[#e8e8e6b3] group-hover:text-[#20b8cd] transition-all duration-200 text-sm font-medium">
                      Search
                    </span>
                  </button>
                </div>

                <div className="max-w-[188px] w-full flex flex-row items-center justify-end">
                  <button
                    onClick={handleSendMessage}
                    className="bg-[#20b8cd] max-w-[36px] w-full h-[32px] cursor-pointer rounded-lg flex justify-center items-center ml-2 hover:bg-[#1a9eb2] transition-all duration-200"
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChatInputField;
