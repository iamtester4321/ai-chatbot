import PlusIcon from "../../assets/icons/Pluse";
import SearchIcon from "../../assets/icons/SearchIcon";

const dummyChats = [
  "What is AI?",
  "Explain Quantum Physics",
  "React vs Vue",
  "Best travel destinations",
  "How to learn TypeScript?",
];

const Sidebar = () => {
  return (
    <div className="flex flex-col h-[calc(100%-1rem)] md:h-full w-full bg-[#121212] text-white p-3 overflow-hidden mt-16 md:mt-0">
      <button className="flex items-center gap-2 p-2 mb-4 bg-[#202222] border border-[#e8e8e61a] rounded-lg hover:bg-[#1a1a1a] transition-all duration-200 w-full group">
        <PlusIcon />
        <span className="text-sm whitespace-nowrap text-[#e8e8e6b3] group-hover:text-[#20b8cd]">
          New Chat
        </span>
      </button>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search chats"
          className="w-full px-8 py-2 text-sm rounded-lg bg-[#202222] border border-[#e8e8e61a] text-gray-200 placeholder-[#e8e8e6b3] focus:outline-none focus:border-[#20b8cd]"
        />
        <SearchIcon className="absolute top-2.5 left-2.5 h-4 w-4 text-[#e8e8e6b3]" />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#20b8cd] scrollbar-track-transparent pb-4">
        {dummyChats.map((chat, index) => (
          <div
            key={index}
            className="p-2.5 text-sm rounded-lg hover:bg-[#202222] hover:text-[#20b8cd] cursor-pointer truncate mb-1.5 text-[#e8e8e6b3] transition-all duration-200"
            title={chat}
          >
            {chat}
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
