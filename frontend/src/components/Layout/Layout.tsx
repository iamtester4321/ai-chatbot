import { useState, useEffect } from "react";
import ChatInputField from "../ChatInputField/ChatInputField";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchChatNames } from "../../actions/chat.actions";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useAppDispatch();
  const chatList = useAppSelector((state) => state.chat.chatList);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const getChatNames = async () => {
      try {
        const { success } = await fetchChatNames(dispatch);
        if (!success) {
          console.error("Failed to fetch chat names");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getChatNames();
  }, [dispatch]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex max-h-screen bg-[#121212]">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-[250px] md:w-[250px]" : "w-0"
        } fixed md:relative transition-all duration-300 overflow-hidden h-screen bg-[#121212] z-20`}
      >
        <Sidebar chatList={chatList} />
      </div>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-300 w-full">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex-1 overflow-y-auto">
          <ChatInputField />
        </div>
      </div>
    </div>
  );
}

export default Layout;
