import { ArrowUpRight, BarChart2, MessageSquare } from "lucide-react";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { PromptInputProps } from "../../lib/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setMode } from "../../store/features/chat/chatSlice";

const PromptInput = ({
  input,
  isLoading,
  handleInputChange,
  handleFormSubmit,
}: PromptInputProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mode = useAppSelector((state) => state.chat.mode);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (mode === "chart") {
      setSearchParams({ mode: "chart" });
    } else {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("mode");
      setSearchParams(newParams);
    }
  }, [mode, setSearchParams]);

  const handleModeChange = (newMode: "chat" | "chart") => {
    dispatch(setMode(newMode));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (!e.shiftKey && input.trim() !== "") {
        e.preventDefault();
        handleFormSubmit(e);
      } else if (e.shiftKey) {
        adjustTextareaHeight();
      }
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";

      const lineHeight = 24;
      const maxHeight = lineHeight * 3;

      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;

      textarea.style.overflowY =
        textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-[#1e1f1f] border border-[#2f2f2f] flex flex-col rounded-2xl px-4 py-4 w-full max-w-3xl mx-auto shadow-md gap-4"
    >
      {/* Input Field */}
      <textarea
        ref={textareaRef}
        className="bg-transparent text-gray-200 text-base placeholder:text-gray-500 outline-none min-h-[48px] px-1 resize-none scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
        placeholder={`Ask anything in ${
          mode === "chat" ? "chat" : "chart"
        } mode...`}
        value={input}
        onChange={(e) => {
          handleInputChange(e);
          adjustTextareaHeight();
        }}
        onKeyDown={handleKeyDown}
        rows={1}
      />

      {/* Bottom Buttons */}
      <div className="flex items-center justify-between">
        {/* Mode Toggle */}
        <div className="flex items-center bg-[#2f2f2f] rounded-2xl p-1 w-fit">
          <button
            type="button"
            onClick={() => handleModeChange("chat")}
            className={`flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-xl transition-all
      ${
        mode === "chat"
          ? "bg-[#20b8cd] text-white shadow-sm"
          : "text-gray-400 hover:text-gray-200"
      }`}
          >
            <MessageSquare size={16} />
            Chat
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("chart")}
            className={`flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-xl transition-all
      ${
        mode === "chart"
          ? "bg-[#20b8cd] text-white shadow-sm"
          : "text-gray-400 hover:text-gray-200"
      }`}
          >
            <BarChart2 size={16} />
            Chart
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || input.trim() === ""}
          className="bg-[#20b8cd] hover:bg-[#1a9eb2] rounded-xl w-[40px] h-[36px] flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowUpRight size={18} />
        </button>
      </div>
    </form>
  );
};

export default PromptInput;
