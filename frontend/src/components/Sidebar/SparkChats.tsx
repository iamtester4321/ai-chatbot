import {
  Archive,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ShareChatsProps } from "../../lib/types";
import { useAppSelector } from "../../store/hooks";
import { ChatItemLoader } from "../Loaders";

const SparkChats = ({
  chats,
  chatId,
  isShareOpen,
  setIsShareOpen,
  toggleDropdown,
  activeDropdown,
  handleRename,
  handleDelete,
  isMobile,
  setIsSidebarOpen,
}: ShareChatsProps) => {
  const actionLoadingId = useAppSelector((state) => state.chat.actionLoadingId);
  if (chats.length === 0) return null;

  return (
    <div className="mb-4 w-full">
      <button
        onClick={() => setIsShareOpen(!isShareOpen)}
        className="flex items-center gap-2 px-2.5 py-2 text-sm w-full hover:bg-[var(--color-muted)] rounded-lg transition-all duration-200 text-[color:var(--color-text)]"
      >
        {isShareOpen ? (
          <ChevronDown size={16} className="text-[color:var(--color-text)]" />
        ) : (
          <ChevronRight size={16} className="text-[color:var(--color-text)]" />
        )}
        <Share2 size={16} />
        <span>Spark Chats</span>
      </button>
      {isShareOpen &&
        chats.map((chat) => (
          <div key={chat.id} className="relative group w-full">
            {actionLoadingId === chat.id ? (
              <ChatItemLoader />
            ) : (
              <Link
                to={`/chat/${chat.id}`}
                onClick={(e) => {
                  if (isMobile && !e.defaultPrevented) {
                    setIsSidebarOpen(false);
                  }
                }}
                className={`flex items-center justify-between p-2.5 text-sm rounded-lg hover:bg-[var(--color-muted)] cursor-pointer mb-1.5 transition-all duration-200 text-[color:var(--color-text)] w-full ${
                  chatId === chat.id
                    ? "bg-[var(--color-muted)] text-blue-600"
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
                      e.stopPropagation();
                      toggleDropdown(chat.id);
                    }}
                    className="p-1 hover:bg-[var(--color-border)] rounded-lg transition-all duration-200"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </Link>
            )}

            {activeDropdown.id === chat.id &&
              activeDropdown.section === "spark" && (
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

export default SparkChats;
