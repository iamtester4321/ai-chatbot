import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  archiveChat,
  fetchMessages,
  toggleFavoriteChat
} from "../../actions/chat.actions";
import useToast from "../../hooks/useToast";
import { setIsArchived } from "../../store/features/chat/chatSlice";
import { toggleTheme } from "../../store/features/themeSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import DeleteModal from "../Modal/DeleteModal";
import ShareModal from "../Modal/ShareModal";

import ThemeToggleButton from "../Common/ThemeToggleButton";
import ChatActions from "./ChatActions";
import DesktopMenu from "./DesktopMenu";
import HeaderTitle from "./HeaderTitle";
import MobileMenu from "./MobileMenu";

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
  const dispatch = useAppDispatch();
  const { isDarkMode, mode } = useSelector((state: RootState) => state.theme);
  const isArchive = useAppSelector((state) => state.chat.isArchived);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareOpen, setShareOpen] = useState(false);

  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const showToast = useToast();

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
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
    };

    fetchFavoriteStatus();
  }, [chatId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLogoutModalOpen) return null;

  const toggleFavorite = async () => {
    if (!chatId) return;
    const result = await toggleFavoriteChat(chatId);
    if (result.success) {
      setIsFavorite(!isFavorite);
      showToast.success(result.message || "Favorite status updated");
    } else {
      showToast.error(result.message || "Failed to update favorite status");
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

  return (
    <header className="sticky top-0 w-full z-[1000] py-3 px-4 border-b flex items-center justify-between"
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
        borderColor: "var(--color-border)",
      }}
    >
      <HeaderTitle toggleSidebar={toggleSidebar} isInShareRoute={isInShareRoute} />

      <div className="flex items-center space-x-1 sm:space-x-3">
        <ThemeToggleButton isDarkMode={isDarkMode} mode={mode} toggleTheme={() => dispatch(toggleTheme())} />

        {chatId && (
          <>
            <ChatActions
              chatId={chatId}
              isFavorite={isFavorite}
              isArchive={isArchive}
              toggleFavorite={toggleFavorite}
              setShareOpen={setShareOpen}
            />
            <MobileMenu
              isOpen={isMobileMenuOpen}
              ref={mobileMenuRef}
              toggleMenu={() => setIsMobileMenuOpen((prev) => !prev)}
              toggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
              isArchive={isArchive}
              archiveChat={archiveCurrentChat}
              openDeleteModal={() => setIsDeleteModalOpen(true)}
              setShareOpen={setShareOpen}
            />
            <DesktopMenu
              isOpen={isMenuOpen}
              ref={desktopMenuRef}
              toggleMenu={() => setIsMenuOpen((prev) => !prev)}
              archiveChat={archiveCurrentChat}
              openDeleteModal={() => setIsDeleteModalOpen(true)}
              isArchive={isArchive}
            />
          </>
        )}
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
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
