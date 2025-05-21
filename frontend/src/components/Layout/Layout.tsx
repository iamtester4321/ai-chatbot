import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchChatNames } from "../../actions/chat.actions";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import ChatSection from "../ChatSection/ChatSection";
import Header from "../Header/Header";
import DeleteModal from "../Modal/DeleteModal";
import RenameModal from "../Modal/RenameModal";
import SettingsModal from "../Modal/SettingsModal";
import Sidebar from "../Sidebar/Sidebar";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useAppDispatch();
  const chatList = useAppSelector((state) => state.chat.chatList);
  const chatNameLoading = useAppSelector((state) => state.chat.chatNameLoading);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { chatId } = useParams();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadChats = async () => {
      const { success } = await fetchChatNames(dispatch);
      if (!success) console.error("Failed to load chats");
    };
    loadChats();
  }, [dispatch]);

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
    if (isMobile && chatId) {
      setIsSidebarOpen(false);
    }
  }, [chatId, isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex max-h-screen bg-[var(--color-bg)] text-[color:var(--color-text)]">
      <div
        className={`${isSidebarOpen ? "w-[250px]" : "w-0"} 
        fixed md:relative transition-all duration-300 overflow-hidden h-screen 
        md:h-screen bg-[var(--color-bg)] z-20 top-0`}
      >
        <Sidebar
          isLogoutModalOpen={isLogoutModalOpen}
          setIsLogoutModalOpen={setIsLogoutModalOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          chatList={chatList}
          setIsRenameModalOpen={setIsRenameModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          setSelectedChat={setSelectedChat}
          setSelectedChatId={setSelectedChatId}
          isMobile={isMobile}
          setIsSidebarOpen={setIsSidebarOpen}
          isLoading={chatNameLoading}
        />
      </div>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[var(--color-bg)] bg-opacity-50 z-10"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-300 w-full md:ml-0">
        <Header
          toggleSidebar={toggleSidebar}
          isLogoutModalOpen={isLogoutModalOpen}
        />
        <div className="flex-1 overflow-y-auto">
          <ChatSection isMobile={isMobile} />
        </div>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        chatList={chatList}
      />
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
    </div>
  );
}

export default Layout;
