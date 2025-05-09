import { PromptInputProps } from "../../lib/types";

const PromptInput = ({
  input,
  isLoading,
  handleInputChange,
  handleFormSubmit,
}: PromptInputProps) => {
  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-[#202222] border border-[#e8e8e61a] flex flex-col rounded-2xl py-3 px-4 w-full"
    >
      <input
        type="text"
        className="outline-none w-full h-12 text-lg text-gray-200 pb-1.5 pl-1.5 text-start items-start bg-transparent"
        placeholder="Ask anything..."
        value={input}
        onChange={handleInputChange}
      />

      <div className="max-w-[640px] w-full flex flex-row gap-10 items-center justify-between pt-1">
        <div className="bg-[#1e1c1c] rounded-lg max-w-[88px] w-full flex flex-row items-center">
          <button
            type="submit"
            disabled={isLoading}
            className="group bg-transparent hover:bg-[#20b8cd1a] hover:border border-[#20b8cd1a] rounded-lg transition-all duration-200 flex flex-row gap-1 items-center cursor-pointer py-1.5 px-2.5"
          >
            <span className="text-[#e8e8e6b3] group-hover:text-[#20b8cd] transition-all duration-200 text-sm font-medium">
              Search
            </span>
          </button>
        </div>

        <div className="max-w-[188px] w-full flex flex-row items-center justify-end">
          <button
            type="submit"
            disabled={isLoading}
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
    </form>
  );
};

export default PromptInput;
