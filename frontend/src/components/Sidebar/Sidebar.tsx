import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PlusIcon from "../../assets/icons/Pluse";
import SearchIcon from "../../assets/icons/SearchIcon";
import { ChatState } from "../../lib/types";
import LogoutModal from "../Modal/LogoutModal";
import UserDetail from "../UserDetail/UserDetail";
import AllChats from "./AllChats";
import FavoriteChats from "./FavoriteChats";

interface SidebarProps {
  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: (isOpen: boolean) => void;
  user: {
    id: string;
    email: string;
  } | null;
  setIsSettingsOpen: (open: boolean) => void;
  chatList: ChatState["chatList"];
}

const Sidebar = ({
  isLogoutModalOpen,
  setIsLogoutModalOpen,
  user,
  setIsSettingsOpen,
  chatList,
}: SidebarProps) => {
  const { chatId } = useParams();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (chatId: string) => {
    setActiveDropdown(activeDropdown === chatId ? null : chatId);
  };

  const handleRename = (chatId: string) => {
    setActiveDropdown(null);
  };

  const handleDelete = (chatId: string) => {
    setActiveDropdown(null);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const filteredChatList = chatList.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoriteChats = filteredChatList.filter((chat) => chat.isFavorite);

  return (
    <div className="flex flex-col h-full w-full bg-[#121212] text-white p-3 overflow-hidden">
      <Link
        to={"/chat"}
        className="flex items-center gap-2 p-2 mb-4 bg-[#202222] border border-[#e8e8e61a] rounded-lg hover:bg-[#1a1a1a] transition-all duration-200 w-full group"
      >
        <PlusIcon />
        <span className="text-sm whitespace-nowrap text-[#e8e8e6b3] group-hover:text-[#20b8cd]">
          New Chat
        </span>
      </Link>

      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search chats"
          className="w-full px-8 py-2 text-sm rounded-lg bg-[#202222] border border-[#e8e8e61a] text-gray-200 placeholder-[#e8e8e6b3] focus:outline-none focus:border-[#20b8cd]"
        />
        <SearchIcon className="absolute top-2.5 left-2.5 h-4 w-4 text-[#e8e8e6b3]" />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#20b8cd] scrollbar-track-transparent pb-4">
        <FavoriteChats
          chats={favoriteChats}
          chatId={chatId}
          isFavoritesOpen={isFavoritesOpen}
          setIsFavoritesOpen={setIsFavoritesOpen}
          toggleDropdown={toggleDropdown}
          activeDropdown={activeDropdown}
          handleRename={handleRename}
          handleDelete={handleDelete}
          dropdownRef={dropdownRef}
        />

        <AllChats
          chats={filteredChatList}
          chatId={chatId}
          toggleDropdown={toggleDropdown}
          activeDropdown={activeDropdown}
          handleRename={handleRename}
          handleDelete={handleDelete}
          dropdownRef={dropdownRef}
        />
      </div>

      <div className="border-t border-[#e8e8e61a] pt-2 text-sm mt-auto">
        <UserDetail
          user={user}
          onLogoutClick={handleLogoutClick}
          setIsSettingsOpen={setIsSettingsOpen}
        />
      </div>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
