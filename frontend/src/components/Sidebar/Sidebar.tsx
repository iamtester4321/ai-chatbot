import { Link } from "react-router-dom";
import PlusIcon from "../../assets/icons/Pluse";
import SearchIcon from "../../assets/icons/SearchIcon";
import { useEffect, useState } from "react";
import { fetchChatNames } from "../../actions/chat.actions";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

const Sidebar = () => {
  const [chatNames, setChatNames] = useState<Array<{ id: string; name: string }> | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const getChatNames = async () => {
      try {
        const { success, data } = await fetchChatNames();
        if (success && data) {
          setChatNames(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getChatNames();
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

  return (
    <div className="flex flex-col h-[calc(100%-1rem)] md:h-full w-full bg-[#121212] text-white p-3 overflow-hidden mt-16 md:mt-0">
      <Link to={"/chat"} className="flex items-center gap-2 p-2 mb-4 bg-[#202222] border border-[#e8e8e61a] rounded-lg hover:bg-[#1a1a1a] transition-all duration-200 w-full group">
        <PlusIcon />
        <span className="text-sm whitespace-nowrap text-[#e8e8e6b3] group-hover:text-[#20b8cd]">
          New Chat
        </span>
      </Link>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search chats"
          className="w-full px-8 py-2 text-sm rounded-lg bg-[#202222] border border-[#e8e8e61a] text-gray-200 placeholder-[#e8e8e6b3] focus:outline-none focus:border-[#20b8cd]"
        />
        <SearchIcon className="absolute top-2.5 left-2.5 h-4 w-4 text-[#e8e8e6b3]" />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#20b8cd] scrollbar-track-transparent pb-4">
        {chatNames?.map((chat) => (
          <div key={chat.id} className="relative group">
            <div className="flex items-center justify-between p-2.5 text-sm rounded-lg hover:bg-[#202222] cursor-pointer mb-1.5 text-[#e8e8e6b3] transition-all duration-200">
              <span className="truncate flex-1" title={chat.name}>
                {chat.name}
              </span>
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
            
            {activeDropdown === chat.id && (
              <div className="absolute right-0 mt-1 w-36 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
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

      <div className="border-t border-[#e8e8e61a] pt-2 text-sm">
        <div className="p-2.5 hover:bg-[#202222] hover:text-[#20b8cd] cursor-pointer rounded-lg text-[#e8e8e6b3] transition-all duration-200">
          Settings
        </div>
        <div className="p-2.5 hover:bg-[#202222] hover:text-[#20b8cd] cursor-pointer rounded-lg mb-2 text-[#e8e8e6b3] transition-all duration-200">
          Log out
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
