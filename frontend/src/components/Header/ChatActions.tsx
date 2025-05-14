import { Share2, Star } from "lucide-react";

interface ChatActionsProps {
  chatId: string;
  isFavorite: boolean;
  isArchive: boolean;
  toggleFavorite: () => void;
  setShareOpen: (state: boolean) => void;
}

export default function ChatActions({
  isFavorite,
  isArchive,
  toggleFavorite,
  setShareOpen
}: ChatActionsProps) {
  return (
    <div className="hidden sm:flex items-center space-x-1 sm:space-x-3">
      <button
        className="p-2 rounded-full transition duration-200"
        title="Share"
        style={{ backgroundColor: "transparent" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-hover-bg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
        onClick={() => setShareOpen(true)}
      >
        <Share2 size={20} />
      </button>

      {!isArchive && (
        <button
          className="p-2 rounded-full transition duration-200"
          title="Favorite"
          style={{ backgroundColor: "transparent" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-hover-bg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          onClick={toggleFavorite}
        >
          <Star
            size={20}
            fill={isFavorite ? "gold" : "none"}
            color={isFavorite ? "gold" : "currentColor"}
          />
        </button>
      )}
    </div>
  );
}
