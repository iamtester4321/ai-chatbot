import { useState } from "react";
import ChatInputField from "../ChatInputField/ChatInputField";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default sidebar is open

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  return (
    <div className="flex max-h-screen bg-[#121212]">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed top-0 left-0 w-[72px] h-full bg-[#2c3e50] text-white z-[1000]">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div className={`ml-[${isSidebarOpen ? '72px' : '0'}] flex-1 flex flex-col transition-all duration-300`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex-1 overflow-y-auto">
          <ChatInputField />
        </div>
        <div className="sticky bottom-0 w-full bg-[#121212] z-[1000] px-4 pt-2"></div>
      </div>
    </div>
  );
}

export default Layout;
