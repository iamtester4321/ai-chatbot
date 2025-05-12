import {
  Archive,
  BarChart2,
  Menu,
  MessageSquare,
  Moon,
  MoreHorizontal,
  Share2,
  Star,
  Sun,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMessages, toggleFavoriteChat } from "../../actions/chat.actions";
import useToast from "../../hooks/useToast";
import DeleteModal from "../Modal/DeleteModal";

export default function Header({ toggleSidebar }: { toggleSidebar: any }) {
  const { chatId } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChartMode, setIsChartMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        if (!chatId) return;

        const result = await fetchMessages(chatId);

        if (result.success) {
          setIsFavorite(result.data.isFavorite || false);
        }
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [chatId]);

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const showToast = useToast();

  const toggleFavorite = async () => {
    try {
      if (!chatId) return;

      const result = await toggleFavoriteChat(chatId);

      if (result.success) {
        setIsFavorite(!isFavorite);
        showToast.success(result.message || "Favorite status updated");
      } else {
        showToast.error(result.message || "Failed to update favorite status");
      }
    } catch (error) {
      showToast.error("An error occurred while updating favorite status");
      console.error("Error toggling favorite:", error);
    }
  };

  const toggleChartMode = () => {
    setIsChartMode(!isChartMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 w-full bg-[#121212] text-white z-[1000] py-3 px-4 border-b border-gray-800 flex items-center justify-between">
      <div className="flex items-center">
        <button
          className="p-2 rounded-full hover:bg-gray-700 transition duration-200"
          onClick={toggleSidebar}
          title="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-semibold truncate max-w-[200px] sm:max-w-xs">
          AI Assistant
        </h1>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-3">
        {/* Always visible: Theme toggle */}
        <button
          className="p-2 rounded-full hover:bg-gray-700 transition duration-200"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Only show the rest if chatId is present */}
        {chatId && (
          <>
            <div className="hidden sm:flex items-center space-x-1 sm:space-x-3">
              <button
                className="p-2 rounded-full hover:bg-gray-700 transition duration-200"
                title="Share"
              >
                <Share2 size={20} />
              </button>

              <button
                className="p-1 sm:p-2 rounded-full hover:bg-gray-700 transition duration-200"
                title={
                  isChartMode ? "Switch to Chat Mode" : "Switch to Chart Mode"
                }
                onClick={toggleChartMode}
              >
                {isChartMode ? (
                  <MessageSquare size={18} className="sm:w-5 sm:h-5" />
                ) : (
                  <BarChart2 size={18} className="sm:w-5 sm:h-5" />
                )}
              </button>

              <button
                className="p-2 rounded-full hover:bg-gray-700 transition duration-200"
                title="Favorite"
                onClick={toggleFavorite}
              >
                <Star
                  size={20}
                  fill={isFavorite ? "gold" : "none"}
                  color={isFavorite ? "gold" : "currentColor"}
                />
              </button>
            </div>

            {/* Update Mobile More Options */}
            <div className="relative sm:hidden" ref={mobileMenuRef}>
              <button
                className="p-2 rounded-full hover:bg-gray-700 transition duration-200"
                title="More Options"
                onClick={toggleMobileMenu}
              >
                <MoreHorizontal size={20} />
              </button>

              {isMobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button className="px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 w-full text-left flex items-center">
                      <Share2 size={18} className="mr-2" />
                      Share
                    </button>
                    <button
                      className="px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 w-full text-left flex items-center"
                      onClick={toggleChartMode}
                    >
                      {isChartMode ? (
                        <MessageSquare size={18} className="mr-2" />
                      ) : (
                        <BarChart2 size={18} className="mr-2" />
                      )}
                      {isChartMode ? "Chat Mode" : "Chart Mode"}
                    </button>
                    <button
                      onClick={toggleFavorite}
                      className="px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 w-full text-left flex items-center"
                    >
                      <Star
                        className="mr-2"
                        size={18}
                        fill={isFavorite ? "gold" : "none"}
                        color={isFavorite ? "gold" : "currentColor"}
                      />
                      Favourite
                    </button>
                    <button className="px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 w-full text-left flex items-center">
                      <Archive size={16} className="mr-2" />
                      Archive
                    </button>
                    <button
                      onClick={openDeleteModal}
                      className="px-4 py-2 text-sm text-red-400 hover:bg-gray-700 w-full text-left flex items-center"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Update Desktop More Options */}
            <div className="relative hidden sm:block" ref={desktopMenuRef}>
              <button
                className="p-2 rounded-full hover:bg-gray-700 transition duration-200"
                title="More Options"
                onClick={toggleMenu}
              >
                <MoreHorizontal size={20} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button className="px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 w-full text-left flex items-center">
                      <Archive size={16} className="mr-2" />
                      Archive
                    </button>
                    <button
                      onClick={openDeleteModal}
                      className="px-4 py-2 text-sm text-red-400 hover:bg-gray-700 w-full text-left flex items-center"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        chatId={chatId || ""}
      />
    </header>
  );
}
