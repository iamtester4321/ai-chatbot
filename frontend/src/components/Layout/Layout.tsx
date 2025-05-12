import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../actions/user.actions";
import ChatInputField from "../ChatInputField/ChatInputField";
import Header from "../Header/Header";
import SettingsModal from "../Modal/SettingsModal";
import Sidebar from "../Sidebar/Sidebar";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchChatNames } from "../../actions/chat.actions";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useAppDispatch();
  const chatList = useAppSelector((state) => state.chat.chatList);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);


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
  }, []); // Remove dispatch from dependencies

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const { success, data } = await fetchUserProfile();
        if (success && data) {
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    getUserProfile();
  }, []);

  useEffect(() => {
    const handleChatUpdates = () => {
      // Refresh chat list
      fetchChatNames(dispatch);
    };

    // Add event listeners for all chat-related events
    window.addEventListener('chat-deleted', handleChatUpdates);
    window.addEventListener('chat-favorite-toggled', handleChatUpdates);
    window.addEventListener('chat-renamed', handleChatUpdates);
    window.addEventListener('chat-names-updated', handleChatUpdates);
    window.addEventListener('chat-archived', handleChatUpdates);

    return () => {
      // Clean up event listeners
      window.removeEventListener('chat-deleted', handleChatUpdates);
      window.removeEventListener('chat-favorite-toggled', handleChatUpdates);
      window.removeEventListener('chat-renamed', handleChatUpdates);
      window.removeEventListener('chat-names-updated', handleChatUpdates);
      window.removeEventListener('chat-archived', handleChatUpdates);
    };
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
        } fixed md:relative transition-all duration-300 overflow-hidden h-screen md:h-screen bg-[#121212] z-20 top-0`}
      >
        <Sidebar
          isLogoutModalOpen={isLogoutModalOpen}
          setIsLogoutModalOpen={setIsLogoutModalOpen}
          user={user}
          setIsSettingsOpen={setIsSettingsOpen}
          chatList={chatList}
        />
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
        {!isSettingsOpen && (
          <Header
            toggleSidebar={toggleSidebar}
            isLogoutModalOpen={isLogoutModalOpen}
          />
        )}

        <div className="flex-1 overflow-y-auto">
          <ChatInputField />
        </div>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        chatList={chatList}
      />
    </div>
  );
}

export default Layout;
