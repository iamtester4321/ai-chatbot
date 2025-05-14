import {
  Archive,
  BarChart2,
  MessageSquare,
  Monitor,
  Moon,
  MoreHorizontal,
  Share2,
  Sidebar,
  Star,
  Sun,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import {
  archiveChat,
  fetchMessages,
  toggleFavoriteChat,
} from "../../actions/chat.actions";
import useToast from "../../hooks/useToast";
import { setIsArchived } from "../../store/features/chat/chatSlice";
import { toggleTheme } from "../../store/features/themeSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import DeleteModal from "../Modal/DeleteModal";
import ShareModal from "../Modal/ShareModal";

interface HeaderProps {
  toggleSidebar: () => void;
  isLogoutModalOpen: boolean;
  isInShareRoute: boolean;
}

export default function Header({
  toggleSidebar,
  isLogoutModalOpen,
  isInShareRoute
}: HeaderProps) {
  const { chatId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const isArchive = useAppSelector((state) => state.chat.isArchived);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChartMode, setIsChartMode] = useState(
    searchParams.get("mode") === "chart"
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareOpen, setShareOpen] = useState(false);
  const dispatch = useAppDispatch();
    const { isDarkMode, mode } = useSelector((state: RootState) => state.theme);

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        if (!chatId) {
          setIsFavorite(false);
          dispatch(setIsArchived(false));
          return;
        }

        const result = await fetchMessages(chatId);

        if (result.success) {
          setIsFavorite(result.data.isFavorite || false);
          dispatch(setIsArchived(result.data.isArchived || false));
        }
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [chatId]);

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const renderThemeIcon = () => {
    if (mode === "system") return <Monitor size={20} />;
    return isDarkMode ? <Sun size={20} /> : <Moon size={20} />;
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

  const archiveCurrentChat = async () => {
    if (!chatId) return;

    const result = await archiveChat(chatId);
    if (result.success) {
      dispatch(setIsArchived(!isArchive));
      showToast.success(result.message || "Chat archived");
      setIsMenuOpen(false);
      setIsMobileMenuOpen(false);
    } else {
      showToast.error(result.message || "Failed to archive chat");
    }
  };

  const toggleChartMode = () => {
    const newIsChartMode = !isChartMode;
    setIsChartMode(newIsChartMode);

    if (newIsChartMode) {
      setSearchParams({ mode: "chart" });
    } else {
      searchParams.delete("mode");
      setSearchParams(searchParams);
    }
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

  if (isLogoutModalOpen) return null;

  return (
    <header
      className="sticky top-0 w-full z-[1000] py-3 px-4 border-b flex items-center justify-between"
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center">
        {!isInShareRoute &&
        <button
          className="p-2 rounded-full transition duration-200"
          style={{ backgroundColor: "transparent" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-hover-bg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          onClick={toggleSidebar}
          title="Toggle Sidebar"
        >
          <Sidebar size={20} />
        </button>}
        <h1 className="text-xl font-semibold truncate max-w-[200px] sm:max-w-xs">
          AI Assistant
        </h1>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-3">
        <button
          className="p-2 rounded-full transition duration-200"
          style={{ backgroundColor: "transparent" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-hover-bg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title={
            mode === "system"
              ? isDarkMode
                ? "Switch to Light Mode" 
                : "Switch to Dark Mode" 
              : mode === "light"
              ? "Switch to Dark Mode" 
              : "Switch to Light Mode" 
          }
          onClick={handleToggleTheme}
        >
          {renderThemeIcon()}
        </button>

        {chatId && (
          <>
            <div className="hidden sm:flex items-center space-x-1 sm:space-x-3">
              <button
                className="p-2 rounded-full transition duration-200"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-hover-bg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                title="Share"
                onClick={() => setShareOpen(true)}
              >
                <Share2 size={20} />
              </button>

                {!isArchive && (
              <button
                className="p-2 rounded-full transition duration-200"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-hover-bg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                title="Favorite"
                onClick={toggleFavorite}
              >
                <Star
                  size={20}
                  fill={isFavorite ? "gold" : "none"}
                  color={isFavorite ? "gold" : "currentColor"}
                />
              </button>
              )}
            </div>

            <div className="relative sm:hidden" ref={mobileMenuRef}>
              <button
                className="p-2 rounded-full transition duration-200"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-hover-bg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                title="More Options"
                onClick={toggleMobileMenu}
              >
                <MoreHorizontal size={20} />
              </button>

              {isMobileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-36 rounded-md shadow-lg border z-50"
                  style={{
                    backgroundColor: "var(--color-bg)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  <div className="py-1">
                    <button
                      className="px-4 py-2 text-sm w-full text-left flex items-center hover:bg-[var(--color-muted)]"
                      style={{ color: "var(--color-text)" }}
                      onClick={() => setShareOpen(true)}
                    >
                      <Share2 size={18} className="mr-2" />
                      Share
                    </button>
                    {!isArchive && (
                      <>
                      <button
                      className="px-4 py-2 text-sm w-full text-left flex items-center hover:bg-[var(--color-muted)]"
                      style={{ color: "var(--color-text)" }}
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
                      className="px-4 py-2 text-sm w-full text-left flex items-center hover:bg-[var(--color-muted)]"
                      style={{ color: "var(--color-text)" }}
                    >
                      <Star
                        className="mr-2"
                        size={18}
                        fill={isFavorite ? "gold" : "none"}
                        color={isFavorite ? "gold" : "currentColor"}
                      />
                      Favourite
                    </button>
                    </>
                    )}
                    <button
                      onClick={archiveCurrentChat}
                      className="px-4 py-2 text-sm w-full text-left flex items-center hover:bg-[var(--color-muted)]"
                      style={{ color: "var(--color-text)" }}
                    >
                      <Archive size={16} className="mr-2" />
                      {isArchive ? "Un-archive" : "Archive"}
                    </button>
                    <button
                      onClick={openDeleteModal}
                      className="px-4 py-2 text-sm w-full text-left flex items-center hover:bg-[var(--color-muted)]"
                      style={{ color: "var(--color-error)" }}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative hidden sm:block" ref={desktopMenuRef}>
              <button
                className="p-2 rounded-full transition duration-200"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-hover-bg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                title="More Options"
                onClick={toggleMenu}
              >
                <MoreHorizontal size={20} />
              </button>

              {isMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-36 rounded-md shadow-lg border z-50"
                  style={{
                    backgroundColor: "var(--color-bg)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  <div className="py-1">
                    <button
                      onClick={archiveCurrentChat}
                      className="px-4 py-2 text-sm w-full text-left flex items-center hover:bg-[var(--color-muted)]"
                    >
                      <Archive size={16} className="mr-2" />
                      {isArchive ? "Un-archive" : "Archive"}
                    </button>
                    <button
                      onClick={openDeleteModal}
                      className="px-4 py-2 text-sm w-full text-left flex items-center hover:bg-[var(--color-muted)]"
                      style={{ color: "var(--color-error)" }}
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
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setShareOpen(false)}
        chatId={chatId || ""}
      />
    </header>
  );
}
