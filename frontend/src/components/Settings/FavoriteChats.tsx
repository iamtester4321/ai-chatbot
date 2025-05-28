import { Loader2, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toggleFavoriteChat } from "../../actions/chat.actions";
import useToast from "../../hooks/useToast";
import { FavoriteChatsSettingsProps } from "../../lib/types";
import { setIsFavorite } from "../../store/features/chat/chatSlice";
import { useAppDispatch } from "../../store/hooks";
import DeleteModal from "../Modal/DeleteModal";

const FavoriteChats = ({
  favoriteChats,
  onClose,
}: FavoriteChatsSettingsProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [favoriteLoadingId, setFavoriteLoadingId] = useState<string | null>(
    null
  );
  const showToast = useToast();
  const dispatch = useAppDispatch();

  const openDeleteModal = (chatId: string) => {
    setSelectedChatId(chatId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedChatId(null);
    setIsDeleteModalOpen(false);
  };

  const handleToggleFavorite = async (chatId: string) => {
    setFavoriteLoadingId(chatId);
    try {
      const result = await toggleFavoriteChat(chatId);
      dispatch(setIsFavorite(false));
      if (!result.success) {
        showToast.error(result.message || "Failed to update favorite status");
      }
    } catch (error) {
      showToast.error("An error occurred while updating favorite status");
      console.error("Error toggling favorite:", error);
    } finally {
      setFavoriteLoadingId(null);
    }
  };

  if (!favoriteChats?.length) {
    return (
      <div
        style={{ color: "var(--color-disabled-text)" }}
        className="text-center py-8"
      >
        No favorite chats found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-medium mb-2"
        style={{ color: "var(--color-text)" }}
      >
        Favorite Chats
      </h3>
      {favoriteChats.map((chat) => (
        <div
          key={chat.id}
          className="rounded-lg p-4"
          style={{ backgroundColor: "var(--color-muted)" }}
        >
          <div className="flex items-center justify-between">
            <Link
              to={`/chat/${chat.id}`}
              style={{ color: "var(--color-text)" }}
              className="font-medium hover:text-[var(--color-primary)] transition-colors"
              onClick={onClose}
            >
              {chat.name}
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleFavorite(chat.id)}
                className="p-2 rounded-lg transition-colors hover:bg-[var(--color-hover-bg)] cursor-pointer"
                title="Remove from favorites"
              >
                {favoriteLoadingId === chat.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Star size={16} fill="gold" color="gold" />
                )}
              </button>

              <button
                onClick={() => openDeleteModal(chat.id)}
                className="p-2 rounded-lg transition-colors hover:bg-[var(--color-hover-bg)] cursor-pointer"
                style={{ color: "var(--color-error)" }}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        chatId={selectedChatId || ""}
      />
    </div>
  );
};

export default FavoriteChats;
