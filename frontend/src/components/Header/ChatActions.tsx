import { Share2, Star } from "lucide-react";
import { ChatActionsProps } from "../../lib/types";

export default function ChatActions({
  isFavorite,
  isArchive,
  toggleFavorite,
  setShareOpen,
}: ChatActionsProps) {
  return (
    <div className="hidden sm:flex items-center space-x-1 sm:space-x-3">
      <button
        className="p-2 rounded-full transition duration-200"
        style={{ backgroundColor: "transparent" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-hover-bg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
        title="Share"
        onClick={() => setShareOpen(true)}
      >
        <Share2 size={20} />
      </button>

      {!isArchive && (
        <button
          className="p-2 rounded-full transition duration-200"
          style={{ backgroundColor: "transparent" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-hover-bg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="Favorite"
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
