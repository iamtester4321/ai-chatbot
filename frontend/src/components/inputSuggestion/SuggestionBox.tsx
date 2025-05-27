import { RefObject } from "react";
import SuggestionItem from "./SuggestionItem";

type SuggestionBoxProps = {
  suggestions: string[];
  selectedSuggestionIndex: number;
  suggestionRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  suggestionBoxRef: RefObject<HTMLDivElement | null>;
  onSelect: (suggestion: string) => void;
};

const SuggestionBox = ({
  suggestions,
  selectedSuggestionIndex,
  suggestionRefs,
  suggestionBoxRef,
  onSelect,
}: SuggestionBoxProps) => {
  return (
    <div
      ref={suggestionBoxRef}
      className="left-0 right-0 z-50"
    >
      <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <div className="text-xs font-medium text-[var(--color-disabled-text)] uppercase tracking-wide">
            Suggestions
          </div>
        </div>

        <div className="max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, idx) => (
            <SuggestionItem
              key={idx}
              suggestion={suggestion}
              isSelected={selectedSuggestionIndex === idx}
              onClick={() => onSelect(suggestion)}
              innerRef={(el) => {
                suggestionRefs.current[idx] = el;
              }}
            />
          ))}
        </div>

        <div className="px-4 py-2 bg-[var(--color-muted)] border-t border-[var(--color-border)]">
          <div className="text-xs text-[var(--color-disabled-text)] flex items-center justify-between">
            <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionBox;
