import { Star, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ChatState } from "../../lib/types";

interface FavoriteChatsProps {
  favoriteChats: ChatState["chatList"];
}

const FavoriteChats = ({ favoriteChats }: FavoriteChatsProps) => {
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
            >
              {chat.name}
            </Link>
            <div className="flex items-center gap-2">
              <button
                className="p-2 hover:bg-[#2c2c2c] rounded-lg transition-colors"
                title="Remove from favorites"
              >
                <Star size={16} fill={"gold"} color={"gold"} />
              </button>
              <button
                className="p-2 text-[#e8e8e6b3] hover:text-red-500 hover:bg-[#2c2c2c] rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavoriteChats;
