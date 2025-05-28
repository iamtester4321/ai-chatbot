import { Loader2, Share2, Star } from "lucide-react";
import { ChatActionsProps } from "../../lib/types";
import { useAppSelector } from "../../store/hooks";

export default function ChatActions({
  chatId,
  isFavorite,
  isArchive,
  toggleFavorite,
  setShareOpen,
  favoriteLoading,
}: ChatActionsProps) {
  const actionLoadingId = useAppSelector((state) => state.chat.actionLoadingId);
  const isLoading = actionLoadingId === chatId;

  return (
    <div className="hidden sm:flex items-center space-x-1 sm:space-x-3">
      <button
        className="p-2 rounded-full transition duration-200 cursor-pointer"
        style={{ backgroundColor: "transparent" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-hover-bg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
        title="Share"
        onClick={() => setShareOpen(true)}
        disabled={isLoading}
      >
        <Share2 size={20} className={isLoading ? "opacity-50" : ""} />
      </button>

      {!isArchive && (
        <button
          className="p-2 rounded-full transition duration-200 cursor-pointer"
          style={{ backgroundColor: "transparent" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-hover-bg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="Favorite"
          onClick={toggleFavorite}
          disabled={isLoading}
        >
          {favoriteLoading ? (
            <Loader2
              size={20}
              className="animate-spin text-[var(--color-text)]"
            />
          ) : (
            <Star
              size={20}
              fill={isFavorite ? "gold" : "none"}
              color={isFavorite ? "gold" : "currentColor"}
              className={isLoading ? "opacity-50" : ""}
            />
          )}
        </button>
      )}
    </div>
  );
}
