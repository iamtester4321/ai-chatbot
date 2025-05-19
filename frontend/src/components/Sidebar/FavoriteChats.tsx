import {
  Archive,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toggleFavoriteChat } from "../../actions/chat.actions";
import useToast from "../../hooks/useToast";
import { ChatState } from "../../lib/types";
import { setIsFavorite } from "../../store/features/chat/chatSlice";
import { useAppDispatch } from "../../store/hooks";

interface FavoriteChatsProps {
  chats: ChatState["chatList"];
  chatId: string | undefined;
  isFavoritesOpen: boolean;
  setIsFavoritesOpen: (value: boolean) => void;
  toggleDropdown: (chatId: string) => void;
  activeDropdown: {
    id: string | null;
    section: "favorite" | "all" | "spark" | null;
  };
  handleRename: (chatId: string) => void;
  handleDelete: (chatId: string) => void;
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
}: FavoriteChatsProps) => {
  const showToast = useToast();
  const dispatch = useAppDispatch();

  const handleRemoveFromFavorites = async (chatId: string) => {
    try {
      const result = await toggleFavoriteChat(chatId);
      dispatch(setIsFavorite(false));
      if (result.success) {
        toggleDropdown(chatId);
      } else {
        showToast.error(result.message || "Failed to remove from favorites");
      }
    } catch (error) {
      showToast.error("An error occurred while removing from favorites");
      console.error("Error removing from favorites:", error);
    }
  };

  if (chats.length === 0) return null;

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
        className="flex items-center gap-2 px-2.5 py-2 text-sm w-full hover:bg-[var(--color-muted)] rounded-lg transition-all duration-200 text-[color:var(--color-text)]"
      >
        {isFavoritesOpen ? (
          <ChevronDown size={16} className="text-[color:var(--color-text)]" />
        ) : (
          <ChevronRight size={16} className="text-[color:var(--color-text)]" />
        )}
        <Star size={16} fill="gold" color="gold" />
        <span>Favorites</span>
      </button>
      {isFavoritesOpen &&
        chats.map((chat) => (
          <div key={chat.id} className="relative group">
            <Link
              to={`/chat/${chat.id}`}
              className={`flex items-center justify-between p-2.5 text-sm rounded-lg hover:bg-[var(--color-muted)] cursor-pointer mb-1.5 transition-all duration-200 text-[color:var(--color-text)] ${
                chatId === chat.id
                  ? "bg-[var(--color-muted)] text-yellow-600"
                  : ""
              }`}
            >
              <span
                className={`truncate flex-1 ${
                  chatId === chat.id ? "font-semibold" : ""
                }`}
                title={chat.name}
              >
                {chat.name}
              </span>

              <div className="flex items-center gap-2">
                {chat.isArchived && (
                  <Archive
                    size={16}
                    className="text-[color:var(--color-disabled-text)]"
                  />
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown(chat.id);
                  }}
                  className="p-1 hover:bg-[var(--color-border)] rounded-lg transition-all duration-200"
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </Link>

            {activeDropdown.id === chat.id &&
              activeDropdown.section === "favorite" && (
                <div
                  data-dropdown-menu
                  className="absolute right-0 mt-1 w-36 rounded-md shadow-lg bg-[var(--color-bg)] border border-[var(--color-border)] z-50"
                >
                  <div className="py-1">
                    <button
                      onClick={() => handleRename(chat.id)}
                      className="px-4 py-2 text-sm text-[color:var(--color-text)] hover:bg-[var(--color-muted)] w-full text-left flex items-center"
                    >
                      <Pencil size={16} className="mr-2" />
                      Rename
                    </button>
                    <button
                      onClick={() => handleDelete(chat.id)}
                      className="px-4 py-2 text-sm text-[var(--color-error)] hover:bg-[var(--color-muted)] w-full text-left flex items-center"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </button>
                    <button
                      onClick={() => handleRemoveFromFavorites(chat.id)}
                      className="px-4 py-2 text-sm text-yellow-600 hover:bg-[var(--color-muted)] w-full text-left flex items-center"
                    >
                      <Star size={16} className="mr-2" />
                      Remove
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
