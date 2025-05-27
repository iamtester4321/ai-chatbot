import { LogOut, Settings, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PlusIcon from "../../assets/icons/Pluse";
import SearchIcon from "../../assets/icons/SearchIcon";
import { SidebarProps } from "../../lib/types";
import {
  resetChat,
  setActionLoadingId,
  setMode,
} from "../../store/features/chat/chatSlice";
import { useAppDispatch } from "../../store/hooks";
import { ChatSectionLoader } from "../Loaders";
import LogoutModal from "../Modal/LogoutModal";
import { UserDetail } from "../UserDetail/UserDetail";
import AllChats from "./AllChats";
import FavoriteChats from "./FavoriteChats";
import SparkChats from "./SparkChats";

const Sidebar = ({
  isLogoutModalOpen,
  setIsLogoutModalOpen,
  setIsSettingsOpen,
  chatList,
  setIsRenameModalOpen,
  setIsDeleteModalOpen,
  setSelectedChat,
  setSelectedChatId,
  isMobile,
  setIsSidebarOpen,
  isLoading,
  isSidebarOpen,
}: SidebarProps) => {
  const { chatId } = useParams();
  const dispatch = useAppDispatch();
  const [activeDropdown, setActiveDropdown] = useState<{
    id: string | null;
    section: "favorite" | "all" | "spark" | null;
  }>({
    id: null,
    section: null,
  });
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Reset search term when sidebar is closed
  useEffect(() => {
    if (!isSidebarOpen) {
      setSearchTerm(""); // Reset search field
    }
  }, [isSidebarOpen]); // Trigger effect when `isSidebarOpen` changes

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isInsideDropdown = target.closest("[data-dropdown-menu]");
      if (!isInsideDropdown) {
        setActiveDropdown({ id: null, section: null });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (
    chatId: string,
    section: "favorite" | "spark" | "all"
  ) => {
    setActiveDropdown((current) =>
      current.id === chatId && current.section === section
        ? { id: null, section: null }
        : { id: chatId, section }
    );
  };

  const handleRename = async (chatId: string) => {
    dispatch(setActionLoadingId(chatId));
    try {
      const chat = chatList.find((c) => c.id === chatId);
      if (chat) {
        setSelectedChat({ id: chat.id, name: chat.name });
        setIsRenameModalOpen(true);
        setActiveDropdown({ id: null, section: null });
      }
    } finally {
      dispatch(setActionLoadingId(null));
    }
  };

  const handleDelete = async (chatId: string) => {
    dispatch(setActionLoadingId(chatId));
    try {
      setSelectedChatId(chatId);
      setIsDeleteModalOpen(true);
      setActiveDropdown({ id: null, section: null });
    } finally {
      dispatch(setActionLoadingId(null));
    }
  };

  const handleLogoutClick = async () => {
    dispatch(setActionLoadingId("logout"));
    try {
      setIsLogoutModalOpen(true);
    } finally {
      dispatch(setActionLoadingId(null));
    }
  };

  const filteredChatList = chatList.filter(
    (chat) =>
      typeof chat.name === "string" &&
      chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoriteChats = filteredChatList.filter(
    (chat) => chat.isFavorite && !chat.isArchived
  );

  const sparkChats = filteredChatList.filter(
    (chat) => chat.isShare && !chat.isArchived
  );

  return (
    <>
      <div className="flex flex-col h-screen md:h-full w-full bg-[var(--color-bg)] text-[color:var(--color-text)] p-3 overflow-hidden border-r border-[var(--color-border)]">
        <span className="flex items-center justify-center md:justify-start gap-2 pt-16 md:p-0 rounded-lg w-full truncate">
          <Link
            to={"/chat"}
            onClick={() => {
              dispatch(resetChat());
              dispatch(setMode("chat"));
              if (isMobile) setIsSidebarOpen(false);
            }}
            className="flex items-center gap-2 p-2 mb-4 bg-[var(--color-primary)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-primary-hover)] transition-all duration-200 w-full cursor-pointer truncate"
          >
            <div className="flex items-center justify-center gap-2 p-2 w-full truncate cursor-pointer transition-all">
              <PlusIcon className="flex-shrink-0" />
              <span className="text-sm whitespace-nowrap text-white truncate">
                New Chat
              </span>
            </div>
          </Link>
        </span>

        {chatList.filter((chat) => !chat.isArchived).length > 0 && (
          <div className="relative mb-4 truncate">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search chats"
              className="w-full px-8 py-2 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[color:var(--color-subtle-text)] placeholder-[var(--color-disabled-text)] focus:outline-none focus:border-[var(--color-primary)] truncate"
            />
            <SearchIcon className="absolute top-2.5 left-2.5 h-4 w-4 text-[color:var(--color-placeholder)] flex-shrink-0" />

            {/* Clear Search Button */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute top-2.5 right-2.5 p-1 text-[var(--color-disabled-text)] hover:text-[var(--color-primary)] transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-primary)] scrollbar-track-transparent pb-4">
          {isLoading ? (
            <div className="space-y-4">
              <ChatSectionLoader title="Favorites" count={2} />
              <ChatSectionLoader title="Spark Chats" count={1} />
              <ChatSectionLoader title="All Chats" count={3} />
            </div>
          ) : chatList.length === 0 ? (
            <div className="text-center text-[color:var(--color-disabled-text)]">
              No Chats Available
            </div>
          ) : filteredChatList.length === 0 ? (
            <div className="text-center text-[color:var(--color-disabled-text)]">
              No results found
            </div>
          ) : (
            <>
              <FavoriteChats
                chats={favoriteChats}
                chatId={chatId}
                isFavoritesOpen={isFavoritesOpen}
                setIsFavoritesOpen={setIsFavoritesOpen}
                toggleDropdown={(id) => toggleDropdown(id, "favorite")}
                activeDropdown={activeDropdown}
                handleRename={handleRename}
                handleDelete={handleDelete}
                isMobile={isMobile}
                setIsSidebarOpen={setIsSidebarOpen}
              />

              <SparkChats
                chats={sparkChats}
                chatId={chatId}
                toggleDropdown={(id) => toggleDropdown(id, "spark")}
                activeDropdown={activeDropdown}
                handleRename={handleRename}
                handleDelete={handleDelete}
                setIsShareOpen={setIsShareOpen}
                isShareOpen={isShareOpen}
                isMobile={isMobile}
                setIsSidebarOpen={setIsSidebarOpen}
              />

              <AllChats
                chats={filteredChatList}
                chatId={chatId}
                toggleDropdown={(id) => toggleDropdown(id, "all")}
                activeDropdown={activeDropdown}
                handleRename={handleRename}
                handleDelete={handleDelete}
                isMobile={isMobile}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            </>
          )}
        </div>

        <div className="border-t border-[var(--color-border)] pt-3 pb-2 text-sm sticky bottom-0 bg-[var(--color-bg)]">
          {isUserMenuOpen && (
            <div className="mt-2 space-y-2">
              <button
                onClick={() => {
                  setIsSettingsOpen(true);
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[color:var(--color-text)] hover:bg-[var(--color-hover-bg)] transition-colors"
              >
                <Settings size={16} />
                Settings
              </button>

              <button
                onClick={() => {
                  handleLogoutClick();
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[color:var(--color-error)] hover:bg-[var(--color-hover-bg)] transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}

          <UserDetail onClick={() => setIsUserMenuOpen((prev) => !prev)} />
        </div>
        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
        />
      </div>
    </>
  );
};

export default Sidebar;
