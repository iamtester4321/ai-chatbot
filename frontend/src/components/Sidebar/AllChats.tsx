import { Link } from "react-router-dom";
import { MoreHorizontal, Pencil, Trash2, Star, Archive } from "lucide-react";
import { ChatState } from "../../lib/types";

interface AllChatsProps {
  chats: ChatState['chatList'];
  chatId: string | undefined;
  toggleDropdown: (chatId: string) => void;
  activeDropdown: { id: string | null; section: 'favorite' | 'all' | null };
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

  return (
    <div className="border-t pt-2" style={{ borderColor: "var(--color-border)" }}>
      <div className="px-2.5 py-2 text-sm" style={{ color: "var(--color-subtle-text)" }}>
        All Chats
      </div>
      {chats.map((chat) => {
        const isActive = chatId === chat.id;
        return (
          <div key={chat.id} className="relative group">
            <Link
              to={`/chat/${chat.id}`}
              className={`flex items-center justify-between p-2.5 text-sm rounded-lg mb-1.5 transition-all duration-200 cursor-pointer`}
              style={{
                backgroundColor: isActive ? "var(--color-muted)" : "transparent",
                color: isActive ? "var(--color-primary)" : "var(--color-text)",
              }}
            >
              <span className="truncate flex-1" title={chat.name}>
                {chat.name}
              </span>
              <div className="flex items-center gap-2">
                {chat.isFavorite && <Star size={16} fill="gold" color="gold" />}
                {chat.isArchived && <Archive size={16} className="text-[var(--color-disabled-text)]" />}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown(chat.id);
                  }}
                  className="p-1 rounded-lg transition-all duration-200 hover:bg-[var(--color-muted)]"
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </Link>

            {activeDropdown.id === chat.id && activeDropdown.section === "all" && (
              <div
                data-dropdown-menu
                className="absolute right-0 mt-1 w-36 rounded-md shadow-lg z-50 border"
                style={{
                  backgroundColor: "var(--color-bg)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                }}
              >
                <div className="py-1">
                  <button
                    onClick={() => handleRename(chat.id)}
                    className="px-4 py-2 text-sm w-full text-left flex items-center hover:bg-[var(--color-muted)]"
                    style={{ color: "var(--color-subtle-text)" }}
                  >
                    <Pencil size={16} className="mr-2" />
                    Rename
                  </button>
                  <button
                    onClick={() => handleDelete(chat.id)}
                    className="px-4 py-2 text-sm w-full text-left flex items-center hover:bg-[var(--color-muted)]"
                    style={{ color: "var(--color-error)" }}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AllChats;
