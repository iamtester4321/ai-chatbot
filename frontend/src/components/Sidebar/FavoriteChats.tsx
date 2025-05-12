import { Link } from "react-router-dom";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Star,
  Archive,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { ChatState } from "../../lib/types";

interface FavoriteChatsProps {
  chats: ChatState["chatList"];
  chatId: string | undefined;
  isFavoritesOpen: boolean;
  setIsFavoritesOpen: (value: boolean) => void;
  toggleDropdown: (chatId: string) => void;
  activeDropdown: string | null;
  handleRename: (chatId: string) => void;
  handleDelete: (chatId: string) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

const FavoriteChats = ({
  chats,
  chatId,
  isFavoritesOpen,
  setIsFavoritesOpen,
  toggleDropdown,
  activeDropdown,
  handleRename,
  handleDelete,
  dropdownRef,
}: FavoriteChatsProps) => {
  if (chats.length === 0) return null;

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
        className="flex items-center gap-2 px-2.5 py-2 text-sm text-[#e8e8e6b3] w-full hover:bg-[#202222] rounded-lg transition-all duration-200"
      >
        {isFavoritesOpen ? (
          <ChevronDown size={16} className="text-[#e8e8e6b3]" />
        ) : (
          <ChevronRight size={16} className="text-[#e8e8e6b3]" />
        )}
        <Star size={16} fill={"gold"} color={"gold"} />
        <span>Favorites</span>
      </button>
      {isFavoritesOpen &&
        chats.map((chat) => (
          <div key={chat.id} className="relative group">
            <Link
              to={`/chat/${chat.id}`}
              className={`flex items-center justify-between p-2.5 text-sm rounded-lg hover:bg-[#202222] cursor-pointer mb-1.5 text-[#e8e8e6b3] transition-all duration-200 hover:text-yellow-500 ${
                chatId === chat.id ? "bg-[#202222] text-[#20b8cd]" : ""
              }`}
            >
              <span className="truncate flex-1" title={chat.name}>
                {chat.name}
              </span>
              <div className="flex items-center gap-2">
                {chat.isArchived && (
                  <Archive size={16} className="text-gray-500" />
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown(chat.id);
                  }}
                  className="p-1 hover:bg-[#2c2c2c] rounded-lg transition-all duration-200"
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </Link>

            {activeDropdown === chat.id && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-1 w-36 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
              >
                <div className="py-1">
                  <button
                    onClick={() => handleRename(chat.id)}
                    className="px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 w-full text-left flex items-center"
                  >
                    <Pencil size={16} className="mr-2" />
                    Rename
                  </button>
                  <button
                    onClick={() => handleDelete(chat.id)}
                    className="px-4 py-2 text-sm text-red-400 hover:bg-gray-700 w-full text-left flex items-center"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default FavoriteChats;
