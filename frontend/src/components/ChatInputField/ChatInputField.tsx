import { SetStateAction, useState, useCallback } from "react";
import useSWR from 'swr';
import { fetcher } from '../../utils/streamProcessor';
import { STREAM_CHAT_RESPONSE } from "../../constants";
import { marked } from "marked";
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import 'github-markdown-css/github-markdown-dark.css';

// ✅ Create custom renderer
const renderer = new marked.Renderer();
renderer.code = ({ text, lang }) => {
  const validLang = lang && hljs.getLanguage(lang);
  const highlighted = validLang
    ? hljs.highlight(text, { language: lang }).value
    : hljs.highlightAuto(text).value;

  return `<pre><code class="hljs ${lang ?? ''}">${highlighted}</code></pre>`;
};

// ✅ Set renderer globally
marked.setOptions({ renderer });

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

  const formatResponse = (text: string): string => {
    const html = marked.parse(text) as string;
    return DOMPurify.sanitize(html);
  };

  const handleInputChange = (e: { target: { value: SetStateAction<string> } }) => {
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

            <div className="border-b border-[#e8e8e61a] mb-4">
              <div className="flex space-x-4">
                <button className="py-2 px-1 border-b-2 border-[#20b8cd] text-white flex items-center gap-2">
                  Answer
                </button>
                <button className="py-2 px-1 text-gray-400 flex items-center gap-2">
                  Images
                </button>
                <button className="py-2 px-1 text-gray-400 flex items-center gap-2">
                  Sources
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {["BBC News", "Reuters", "Yahoo"].map((source, i) => (
                <div key={i} className="bg-[#202222] p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs mr-2">
                      {source[0]}
                    </div>
                    <span className="text-sm text-gray-300">{source}</span>
                  </div>
                  <p className="text-sm">Loading search results...</p>
                </div>
              ))}
            </div>

            <div className="markdown-body prose prose-invert max-w-none">
              <div
                className="text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: formatResponse(streamedResponse)
                }}
              />
              {isStreaming && (
                <span className="inline-block w-2 h-4 ml-1 bg-[#20b8cd] animate-pulse">|</span>
              )}
            </div>
          </div>
        </div>
      )}

      <section className={`${isMessageSent ? "pt-8" : "pt-[200px]"} h-100vh transition-all duration-300`}>
        <div className="container">
          <div className="max-w-[640px] w-full items-center mx-auto flex flex-col gap-24 sm:gap-6">
            {!isMessageSent && (
              <h3 className="text-[48px] text-[#ffffffd6] font-light text-center font-inter hidden md:block">
                perplexity
              </h3>
            )}
            <h3 className={`text-3xl sm:text-4xl md:text-[48px] text-[#ffffffd6] font-light text-center font-inter ${isMessageSent ? "hidden" : "block md:hidden"}`}>
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
