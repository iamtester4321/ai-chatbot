import { ArrowUpRight } from "lucide-react";

type SuggestionItemProps = {
  suggestion: string;
  isSelected: boolean;
  onClick: () => void;
  innerRef: (el: HTMLButtonElement | null) => void;
};

const SuggestionItem = ({
  suggestion,
  isSelected,
  onClick,
  innerRef,
}: SuggestionItemProps) => {
  return (
    <button
      ref={innerRef}
      onClick={onClick}
      className={`w-full px-4 py-3 text-left transition-all duration-200 border-b border-[var(--color-border)] last:border-b-0 group
        ${
          isSelected
            ? "bg-[var(--color-primary)] text-[var(--color-button-text)] scale-[0.98] shadow-sm"
            : "hover:bg-[var(--color-muted)] text-[var(--color-text)] hover:scale-[0.99]"
        }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm sm:text-base font-medium">{suggestion}</span>
        <div
          className={`transition-opacity duration-200 ${
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-60"
          }`}
        >
          <ArrowUpRight size={14} />
        </div>
      </div>
    </button>
  );
};

export default SuggestionItem;
