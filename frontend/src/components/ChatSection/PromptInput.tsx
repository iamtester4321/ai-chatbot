import { ArrowUpRight, BarChart2, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PromptInputProps } from "../../lib/types";


const PromptInput = ({
  input,
  isLoading,
  handleInputChange,
  handleFormSubmit,
}: PromptInputProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<"chat" | "chart">(
    searchParams.get("mode") === "chart" ? "chart" : "chat"
  );

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
    setMode(newMode);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-[#1e1f1f] border border-[#2f2f2f] flex flex-col rounded-2xl px-4 py-4 w-full max-w-3xl mx-auto shadow-md gap-4"
    >
      {/* Input Field */}
      <input
        type="text"
        className="bg-transparent text-gray-200 text-base placeholder:text-gray-500 outline-none h-12 px-1"
        placeholder={`Ask anything in ${
          mode === "chat" ? "chat" : "chart"
        } mode...`}
        value={input}
        onChange={handleInputChange}
      />

      {/* Bottom Buttons */}
      <div className="flex items-center justify-between">
        {/* Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleModeChange("chat")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 
              ${
                mode === "chat"
                  ? "bg-[#20b8cd] text-white shadow-sm"
                  : "bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-gray-200"
              }`}
          >
            <MessageSquare size={16} />
            Chat
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("chart")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 
              ${
                mode === "chart"
                  ? "bg-[#20b8cd] text-white shadow-sm"
                  : "bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-gray-200"
              }`}
          >
            <BarChart2 size={16} />
            Chart
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#20b8cd] hover:bg-[#1a9eb2] rounded-md w-[40px] h-[36px] flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowUpRight size={18} />
        </button>
      </div>
    </form>
  );
};

export default PromptInput;