import { useState } from "react";

const ChatInputField = () => {
  const [inputValue, setInputValue] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [activeTab, setActiveTab] = useState("answer");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setCurrentMessage(inputValue);
      setIsMessageSent(true);
      setInputValue("");
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-primary-light dark:bg-primary-dark min-h-screen text-white">
      {/* Message display area at top */}
      {isMessageSent && (
        <div className="w-full pt-4 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-normal mb-6 pt-4 text-white">
              {currentMessage}
            </h2>

            {/* Tabs */}
            <div className="border-b border-secondary-light dark:border-secondary-dark mb-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("answer")}
                  className={`py-2 px-1 flex items-center gap-2 ${
                    activeTab === "answer" ? "border-b-2 border-accent-light dark:border-accent-dark text-white" : "text-gray-400"
                  }`}
                >
                  Answer
                </button>
                <button
                  onClick={() => setActiveTab("images")}
                  className={`py-2 px-1 flex items-center gap-2 ${
                    activeTab === "images" ? "border-b-2 border-accent-light dark:border-accent-dark text-white" : "text-gray-400"
                  }`}
                >
                  Images
                </button>
                <button
                  onClick={() => setActiveTab("sources")}
                  className={`py-2 px-1 flex items-center gap-2 ${
                    activeTab === "sources" ? "border-b-2 border-accent-light dark:border-accent-dark text-white" : "text-gray-400"
                  }`}
                >
                  Sources
                </button>
              </div>
            </div>

            {/* Answer loading placeholder */}
            <div className="response-area rounded-lg p-4 mb-12 text-primary-dark dark:text-primary-light">
              <p>Loading answer...</p>
            </div>
          </div>
        </div>
      )}

      {/* Input section */}
      <section
        className={`${
          isMessageSent ? "pt-8" : "pt-[200px]"
        } h-100vh transition-all duration-300`}
      >
        <div className="container">
          <div className="max-w-[640px] w-full items-center mx-auto flex flex-col gap-24 sm:gap-6">
            {!isMessageSent && (
              <h3 className="text-[48px] text-accent-light dark:text-accent-dark text-center hidden md:block">
                perplexity
              </h3>
            )}
            <h3
              className={`text-3xl sm:text-4xl md:text-[48px] text-white font-light text-center ${
                isMessageSent ? "hidden" : "block md:hidden"
              }`}
            >
              What do you want to know?
            </h3>

            <div className="chat-input-bg border border-highlight-light dark:border-highlight-dark flex flex-col rounded-2xl py-3 px-4 w-full">
              <input
                type="text"
                className="outline-none w-full h-12 text-lg text-white pb-1.5 pl-1.5 text-start items-start bg-transparent"
                placeholder="Ask anything..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />

              <div className="max-w-[640px] w-full flex flex-row gap-10 items-center justify-between pt-1">
                <div className="bg-primary-light dark:bg-primary-dark rounded-lg max-w-[88px] w-full flex flex-row items-center">
                  <button className="group bg-transparent hover:bg-accent-light hover:dark:bg-accent-dark hover:border border-accent-light dark:border-accent-dark rounded-lg transition-all duration-200 flex flex-row gap-1 items-center cursor-pointer py-1.5 px-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      color="currentColor"
                      className="max-w-4 w-full h-4 group-hover:fill-highlight-light group-hover:dark:fill-highlight-dark transition-all duration-200"
                      fill="currentColor"
                      fillRule="evenodd"
                    >
                      <path d="M3.752 9.895a6.145 6.145 0 0 1 6.143-6.143 6.145 6.145 0 0 1 6.142 6.143c0 .568-.074 1.105-.219 1.612a.875.875 0 0 0 1.683.48c.192-.67.286-1.37.286-2.092a7.895 7.895 0 0 0-7.892-7.893 7.895 7.895 0 0 0-7.893 7.893 7.895 7.895 0 0 0 7.893 7.892c1.902 0 3.654-.68 5.018-1.802l5.582 5.748a.875.875 0 0 0 1.255-1.22l-6.175-6.358a.875.875 0 0 0-1.256.001a6.151 6.151 0 0 1-4.424 1.881a6.145 6.145 0 0 1-6.143-6.142ZM9.895 8.49a1.403 1.403 0 1 1 0 2.807 1.403 1.403 0 0 1 0-2.807Z"></path>
                    </svg>
                    <a
                      href="#"
                      className="text-white group-hover:text-highlight-light group-hover:dark:text-highlight-dark transition-all duration-200 text-sm font-medium"
                    >
                      Search
                    </a>
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
                    onClick={handleSendMessage}
                    className="button-primary max-w-[36px] w-full h-[32px] cursor-pointer rounded-lg flex justify-center items-center ml-2 transition-all duration-200"
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