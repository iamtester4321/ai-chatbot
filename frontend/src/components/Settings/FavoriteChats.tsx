import { Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toggleFavoriteChat } from "../../actions/chat.actions";
import useToast from "../../hooks/useToast";
import { ChatState } from "../../lib/types";
import DeleteModal from "../Modal/DeleteModal";

interface FavoriteChatsProps {
  favoriteChats: ChatState["chatList"];
  onClose: () => void;
}

const FavoriteChats = ({ favoriteChats, onClose }: FavoriteChatsProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const showToast = useToast();

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

      if (result.success) {
        showToast.success("Chat removed from favorite");
      } else {
        showToast.error(result.message || "Failed to update favorite status");
      }
    } catch (error) {
      showToast.error("An error occurred while updating favorite status");
      console.error("Error toggling favorite:", error);
    }
  };

  if (!favoriteChats?.length) {
    return (
      <div className="text-[#e8e8e6b3] text-center py-8">
        No favorite chats found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white mb-2">Favorite Chats</h3>
      {favoriteChats.map((chat) => (
        <div key={chat.id} className="bg-[#202222] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <Link
              to={`/chat/${chat.id}`}
              className="text-white font-medium hover:text-[#20b8cd] transition-colors"
              onClick={onClose}
            >
              {chat.name}
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleFavorite(chat.id)}
                className="p-2 hover:bg-[#2c2c2c] rounded-lg transition-colors"
                title="Remove from favorites"
              >
                <Star size={16} fill={"gold"} color={"gold"} />
              </button>
              <button
                onClick={() => openDeleteModal(chat.id)}
                className="p-2 text-[#e8e8e6b3] hover:text-red-500 hover:bg-[#2c2c2c] rounded-lg transition-colors"
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
