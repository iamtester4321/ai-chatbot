import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../actions/user.actions";
import ChatInputField from "../ChatInputField/ChatInputField";
import Header from "../Header/Header";
import SettingsModal from "../Modal/SettingsModal";
import Sidebar from "../Sidebar/Sidebar";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex max-h-screen bg-[#121212]">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-[250px] md:w-[250px]" : "w-0"
        } fixed md:relative transition-all duration-300 overflow-hidden h-[calc(100vh-4rem)] md:h-screen bg-[#2c3e50] z-20 top-16 md:top-0`}
      >
        <Sidebar
          isLogoutModalOpen={isLogoutModalOpen}
          setIsLogoutModalOpen={setIsLogoutModalOpen}
          user={user}
          setIsSettingsOpen={setIsSettingsOpen}
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
      />
    </div>
  );
}

export default Layout;
