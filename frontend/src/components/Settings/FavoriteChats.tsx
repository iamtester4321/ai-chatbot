import { Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toggleFavoriteChat } from "../../actions/chat.actions";
import useToast from "../../hooks/useToast";
import { ChatState } from "../../lib/types";
import { setIsFavorite } from "../../store/features/chat/chatSlice";
import { useAppDispatch } from "../../store/hooks";
import DeleteModal from "../Modal/DeleteModal";

interface FavoriteChatsProps {
  favoriteChats: ChatState["chatList"];
  onClose: () => void;
}

const FavoriteChats = ({ favoriteChats, onClose }: FavoriteChatsProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
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
    try {
      const result = await toggleFavoriteChat(chatId);
      dispatch(setIsFavorite(false));
      if (!result.success) {
        showToast.error(result.message || "Failed to update favorite status");
      }
    } catch (error) {
      showToast.error("An error occurred while updating favorite status");
      console.error("Error toggling favorite:", error);
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
                className="p-2 rounded-lg transition-colors hover:bg-[var(--color-hover-bg)]"
                title="Remove from favorites"
              >
                <Star size={16} fill="gold" color="gold" />
              </button>

              <button
                onClick={() => openDeleteModal(chat.id)}
                className="p-2 rounded-lg transition-colors hover:bg-[var(--color-hover-bg)]"
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
