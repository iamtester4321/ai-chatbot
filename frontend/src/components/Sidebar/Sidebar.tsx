import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PlusIcon from "../../assets/icons/Pluse";
import SearchIcon from "../../assets/icons/SearchIcon";
import { ChatState } from "../../lib/types";
import { resetChat } from "../../store/features/chat/chatSlice";
import { useAppDispatch } from "../../store/hooks";
import DeleteModal from "../Modal/DeleteModal";
import AllChats from "./AllChats";
import FavoriteChats from "./FavoriteChats";
import RenameModal from "../Modal/RenameModal";
import LogoutModal from "../Modal/LogoutModal";
import UserDetail from "../UserDetail/UserDetail";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    name: string;
  } | null>(null);

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

  const favoriteChats = filteredChatList.filter((chat) => chat.isFavorite);

  return (
    <div className="flex flex-col h-[calc(100%-1rem)] md:h-full w-full bg-[#121212] text-white p-3 overflow-hidden mt-16 md:mt-0">
      <Link
        to={"/chat"}
        onClick={() => dispatch(resetChat())}
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
      </div>

      <div className="border-t border-[#e8e8e61a] pt-2 text-sm mt-auto">
        <UserDetail
          user={user}
          onLogoutClick={handleLogoutClick}
          setIsSettingsOpen={setIsSettingsOpen}
        />
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedChatId(null);
        }}
        chatId={selectedChatId || ""}
      />

      <RenameModal
        isOpen={isRenameModalOpen}
        onClose={() => {
          setIsRenameModalOpen(false);
          setSelectedChat(null);
        }}
        chatId={selectedChat?.id || ""}
        currentName={selectedChat?.name || ""}
      />
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
