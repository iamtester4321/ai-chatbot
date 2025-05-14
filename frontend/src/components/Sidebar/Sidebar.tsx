import { LogOut, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PlusIcon from "../../assets/icons/Pluse";
import SearchIcon from "../../assets/icons/SearchIcon";
import { SidebarProps } from "../../lib/types";
import { resetChat } from "../../store/features/chat/chatSlice";
import { useAppDispatch } from "../../store/hooks";
import LogoutModal from "../Modal/LogoutModal";
import { UserDetail } from "../UserDetail/UserDetail";
import AllChats from "./AllChats";
import FavoriteChats from "./FavoriteChats";

const Sidebar = ({
  isLogoutModalOpen,
  setIsLogoutModalOpen,
  setIsSettingsOpen,
  chatList,
  isInShareRoute,
  setIsRenameModalOpen,
  setIsDeleteModalOpen,
  setSelectedChat,
  setSelectedChatId,
}: SidebarProps) => {
  const { chatId } = useParams();
  const dispatch = useAppDispatch();
  const [activeDropdown, setActiveDropdown] = useState<{
    id: string | null;
    section: "favorite" | "all" | null;
  }>({
    id: null,
    section: null,
  });
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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

  const toggleDropdown = (chatId: string, section: "favorite" | "all") => {
    setActiveDropdown((current) =>
      current.id === chatId && current.section === section
        ? { id: null, section: null }
        : { id: chatId, section }
    );
  };

  const handleRename = (chatId: string) => {
    const chat = chatList.find((c) => c.id === chatId);
    if (chat) {
      setSelectedChat({ id: chat.id, name: chat.name });
      setIsRenameModalOpen(true);
      setActiveDropdown({ id: null, section: null });
    }
  };

  const handleDelete = (chatId: string) => {
    setSelectedChatId(chatId);
    setIsDeleteModalOpen(true);
    setActiveDropdown({ id: null, section: null });
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const filteredChatList = chatList.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoriteChats = filteredChatList.filter(
    (chat) => chat.isFavorite && !chat.isArchived
  );

  return (
    <>
      {!isInShareRoute && (
        <div className="flex flex-col h-screen md:h-full w-full bg-[#121212] text-white p-3 overflow-hidden">
          <span className="flex items-center justify-center md:justify-start gap-2 pt-16 md:p-0 rounded-lg w-full truncate">
            <Link
              to={"/chat"}
              onClick={() => dispatch(resetChat())}
              className="flex items-center gap-2 p-2 mb-4 bg-[#20b8cd] border border-[#e8e8e61a] rounded-lg hover:bg-[#1a9eb2] transition-all duration-200 w-full cursor-pointer truncate"
            >
              <div className="flex items-center justify-center gap-2 w-full truncate">
                <PlusIcon className="flex-shrink-0" />
                <span className="text-sm whitespace-nowrap text-white truncate">
                  New Chat
                </span>
              </div>
            </Link>
          </span>

          {/* Conditionally render the search input */}
          {chatList.filter((chat) => !chat.isArchived).length > 0 && (
            <div className="relative mb-4 truncate">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search chats"
                className="w-full px-8 py-2 text-sm rounded-lg bg-[#202222] border border-[#e8e8e61a] text-gray-200 placeholder-[#e8e8e6b3] focus:outline-none focus:border-[#20b8cd] truncate"
              />
              <SearchIcon className="absolute top-2.5 left-2.5 h-4 w-4 text-[#e8e8e6b3] flex-shrink-0" />
            </div>
          )}

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#20b8cd] scrollbar-track-transparent pb-4">
            {chatList.length === 0 ? (
              <div className="text-center text-gray-400">
                No Chats Available
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
                />

                <AllChats
                  chats={filteredChatList}
                  chatId={chatId}
                  toggleDropdown={(id) => toggleDropdown(id, "all")}
                  activeDropdown={activeDropdown}
                  handleRename={handleRename}
                  handleDelete={handleDelete}
                />
              </>
            )}
          </div>

          <div className="border-t border-[#e8e8e61a] pt-3 pb-2 text-sm sticky bottom-0 bg-[#121212]">
            {isUserMenuOpen && (
              <div className="mt-2 space-y-2">
                <button
                  onClick={() => {
                    setIsSettingsOpen(true);
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#e8e8e6b3] hover:bg-[#202222] transition-colors"
                >
                  <Settings size={16} />
                  Settings
                </button>

                <button
                  onClick={() => {
                    handleLogoutClick();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-[#202222] transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}

            <UserDetail
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
            />
          </div>
          <LogoutModal
            isOpen={isLogoutModalOpen}
            onClose={() => setIsLogoutModalOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default Sidebar;
