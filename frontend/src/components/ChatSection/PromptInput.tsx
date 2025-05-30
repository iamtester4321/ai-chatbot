import {
  ArrowUpRight,
  AudioLines,
  BarChart2,
  MessageSquare,
  Mic,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fetchSuggestions } from "../../actions/chat.actions";
import { PromptInputProps } from "../../lib/types";
import { setMode } from "../../store/features/chat/chatSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import SuggestionBox from "../inputSuggestion/SuggestionBox";
import VoiceModal from "../Modal/VoiceModal";

const PromptInput = ({
  input,
  isLoading,
  handleInputChange,
  handleFormSubmit,
  chatId,
  shareId,
  isSharedChat,
  onInteractWithSharedChat,
}: PromptInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const {mode, messages} = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const suggestionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const micButtonRef = useRef<HTMLButtonElement>(null);
  const [isStopping, setIsStopping] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  useEffect(() => {
    suggestionRefs.current = suggestions.map(() => null);
  }, [suggestions]);

  useEffect(() => {
    if (showSuggestions && suggestionBoxRef.current) {
      suggestionBoxRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [showSuggestions]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.onresult = (event) => {
  let transcript = "";

  for (let i = event.resultIndex; i < event.results.length; ++i) {
    const result = event.results[i];
    if (result.isFinal) {
      transcript += result[0].transcript;
    }
  }

  if (transcript.trim()) {
    const currentText = textareaRef.current?.value || "";
    handleInputChange({
      target: { value: `${currentText} ${transcript}`.trim() },
    } as any);
  }
};
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening && !isStopping) {
          setTimeout(() => recognition.start(), 200);
        } else {
          setIsListening(false);
          setIsStopping(false);
          micButtonRef.current?.classList.remove(
            "bg-red-600",
            "border-red-600",
            "text-white"
          );
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionBoxRef.current &&
        !suggestionBoxRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  let debounceTimeout: ReturnType<typeof setTimeout>;

  const handleChangeWithSuggestions = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    handleInputChange(e);
    adjustTextareaHeight();

    const wordCount = value.trim().split(/\s+/).length;

    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(async () => {
      if (wordCount >= 2 && wordCount <= 3 && !chatId && !shareId) {
        const result = await fetchSuggestions(value);
        if (result.success) {
          setSuggestions(result.suggestions);
          setSelectedSuggestionIndex(-1);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setShowSuggestions(false);
        setSuggestions([]);
      }
    }, 2000);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      setIsStopping(true);
      micButtonRef.current?.classList.add(
        "bg-red-600",
        "border-red-600",
        "text-white"
      );
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      micButtonRef.current?.classList.remove(
        "bg-red-600",
        "border-red-600",
        "text-white"
      );
    }
  };

  const handleModeChange = (newMode: "chat" | "chart") => {
    dispatch(setMode(newMode));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isLoading && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      return;
    }

    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex((prevIndex) =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
        );
      } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
        e.preventDefault();
        handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
        return;
      } else if (e.key === "Escape") {
        e.preventDefault();
        setShowSuggestions(false);
        return;
      }
    }

    if (e.key === "Enter") {
      if (!e.shiftKey && input.trim() !== "") {
        e.preventDefault();
        handleFormSubmit(e);
      } else if (e.shiftKey) {
        adjustTextareaHeight();
      }
    }
  };

  useEffect(() => {
    if (
      selectedSuggestionIndex >= 0 &&
      suggestionRefs.current[selectedSuggestionIndex]
    ) {
      suggestionRefs.current[selectedSuggestionIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedSuggestionIndex]);

  const handleSuggestionSelect = (suggestion: string) => {
    handleInputChange({ target: { value: suggestion } } as any);
    setShowSuggestions(false);
    textareaRef.current?.focus();
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

  useEffect(() => {
    if (!isSharedChat && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isSharedChat]);

  const handleFormSubmitWithFocus = async (e: React.FormEvent) => {
    await handleFormSubmit(e);
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
      textareaRef.current.style.overflowY = "hidden";
      textareaRef.current.focus();
    }
  };

  const handleFocus = () => {
    if (isSharedChat && onInteractWithSharedChat) {
      onInteractWithSharedChat();
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form
        ref={formRef}
        onSubmit={handleFormSubmitWithFocus}
        className="mb-2 bg-[var(--color-bg)] border border-[var(--color-border)] flex flex-col rounded-2xl px-4 py-4 w-full shadow-md gap-4"
      >
        <div className="relative w-full">
          <textarea
            ref={textareaRef}
            className="bg-transparent text-base placeholder-[color:var(--color-disabled-text)] text-[var(--color-text)] outline-none min-h-[48px] px-1 resize-none w-full scrollbar-thin scrollbar-thumb-[var(--color-disabled-text)] scrollbar-track-transparent"
            placeholder={`Ask anything in ${
              mode === "chat" ? "chat" : "chart"
            } mode...`}
            value={input}
            onChange={(e) => {
              handleInputChange(e);
              adjustTextareaHeight();
              handleChangeWithSuggestions(e);
            }}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            rows={1}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center bg-[var(--color-muted)] rounded-2xl p-1 w-fit">
            <button
              type="button"
              onClick={() => handleModeChange("chat")}
              className={`flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-xl transition-all cursor-pointer
              ${
                mode === "chat"
                  ? "bg-[var(--color-primary)] text-[var(--color-button-text)] shadow-sm"
                  : "text-[color:var(--color-disabled-text)] hover:text-[color:var(--color-text)]"
              }`}
            >
              <MessageSquare size={16} />
              Chat
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("chart")}
              className={`flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-xl transition-all cursor-pointer
              ${
                mode === "chart"
                  ? "bg-[var(--color-primary)] text-[var(--color-button-text)] shadow-sm"
                  : "text-[color:var(--color-disabled-text)] hover:text-[color:var(--color-text)]"
              }`}
            >
              <BarChart2 size={16} />
              Chart
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              {isListening && !isStopping && (
                <>
                  <div className="absolute inset-0 rounded-full bg-[var(--color-primary)] opacity-20 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full bg-[var(--color-primary)] opacity-30 animate-pulse scale-110"></div>
                  <div className="absolute inset-0 rounded-full bg-[var(--color-primary)] opacity-10 animate-ping delay-75 scale-125"></div>
                </>
              )}
              <button
                type="button"
                ref={micButtonRef}
                onClick={toggleListening}
                className={`relative rounded-full w-[40px] h-[36px] flex items-center justify-center transition-all duration-300 ${
                  isListening
                    ? "bg-[var(--color-primary)] text-[var(--color-button-text)] scale-110 animate-pulse shadow-lg shadow-[var(--color-primary)]/25"
                    : "bg-transparent text-[var(--color-disabled-text)] hover:text-[var(--color-primary)] hover:bg-[var(--color-muted)] hover:scale-105"
                }`}
                title={isListening ? "Stop recording" : "Start voice input"}
              >
                <Mic
                  size={16}
                  className={`transition-transform duration-200 ${
                    isListening ? "scale-110" : ""
                  }`}
                />
              </button>
            </div>

            {input.length > 0 ? (
              <button
                type="submit"
                disabled={isLoading || input.trim() === "" || isListening}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-xl w-[40px] h-[36px] flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                title="Send message"
              >
                <ArrowUpRight size={18} color="var(--color-button-text)" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => !isListening && setShowVoiceModal(true)}
                disabled={isListening}
                className={`bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-xl w-[40px] h-[36px] flex items-center justify-center transition-all duration-200 ${
                  isListening
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:scale-105"
                }`}
                title={isListening ? "Mic is active" : "Open voice modal"}
              >
                <AudioLines size={18} color="var(--color-button-text)" />
              </button>
            )}
          </div>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && !isSharedChat && (
        <SuggestionBox
          suggestions={suggestions}
          selectedSuggestionIndex={selectedSuggestionIndex}
          suggestionRefs={suggestionRefs}
          suggestionBoxRef={suggestionBoxRef}
          onSelect={handleSuggestionSelect}
        />
      )}

      {showVoiceModal && <VoiceModal onClose={() => setShowVoiceModal(false)} />}
    </div>
  );
};

export default PromptInput;
