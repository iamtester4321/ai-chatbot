import { Archive, MoreHorizontal, Pencil, Share2, Star, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ChatState } from "../../lib/types";

interface AllChatsProps {
  chats: ChatState["chatList"];
  chatId: string | undefined;
  toggleDropdown: (chatId: string) => void;
  activeDropdown: { id: string | null; section: "favorite" | "spark" | "all" | null };
  handleRename: (chatId: string) => void;
  handleDelete: (chatId: string) => void;
}

const AllChats = ({
  chats,
  chatId,
  toggleDropdown,
  activeDropdown,
  handleRename,
  handleDelete,
}: AllChatsProps) => {
  if (chats.length === 0) return null;
  const nonArchivedChats = chats.filter((chat) => !chat.isArchived);

  if (nonArchivedChats.length === 0) return null;

  return (
    <div className="border-t border-[var(--color-border)] pt-2">
      <div className="px-2.5 py-2 text-sm text-[color:var(--color-secondary-text)]">
        All Chats
      </div>
      {nonArchivedChats.map((chat) => (
        <div key={chat.id} className="relative group">
          <Link
            to={`/chat/${chat.id}`}
            className={`flex items-center justify-between p-2.5 text-sm rounded-lg hover:bg-[var(--color-muted)] cursor-pointer mb-1.5 transition-all duration-200 text-[color:var(--color-text)] ${
              chatId === chat.id
                ? "bg-[var(--color-muted)] text-[color:var(--color-text)]"
                : ""
            }`}
          >
            <span
              className={`truncate flex-1 ${
                chatId === chat.id
                  ? "text-[color:var(--color-primary)] font-semibold"
                  : ""
              }`}
              title={chat.name}
            >
              {chat.name}
            </span>

            <div className="flex items-center gap-2">
              {chat.isFavorite && (
                <Star size={16} fill={"gold"} color={"gold"} />
              )}
              {chat.isArchived && (
                <Archive
                  size={16}
                  className="text-[color:var(--color-disabled-text)]"
                />
              )}
              {chat.isShare && (
                <Share2
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
            activeDropdown.section === "all" && (
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
                </div>
              </div>
            )}
        </div>
      ))}
    </div>
  );
};

export default AllChats;
