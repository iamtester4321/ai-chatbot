import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  archiveChat,
  fetchMessages,
  toggleFavoriteChat,
} from "../../actions/chat.actions";
import useToast from "../../hooks/useToast";
import {
  resetChat,
  setActionLoadingId,
  setIsArchived,
  setIsFavorite,
} from "../../store/features/chat/chatSlice";
import { toggleTheme } from "../../store/features/theme/themeSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import DeleteModal from "../Modal/DeleteModal";
import ShareModal from "../Modal/ShareModal";

import { HeaderProps } from "../../lib/types";
import ThemeToggleButton from "../Common/ThemeToggleButton";
import ChatActions from "./ChatActions";
import DesktopMenu from "./DesktopMenu";
import HeaderTitle from "./HeaderTitle";
import MobileMenu from "./MobileMenu";

export default function Header({
  toggleSidebar,
  isLogoutModalOpen,
}: HeaderProps) {
  const { chatId } = useParams();
  const dispatch = useAppDispatch();
  const showToast = useToast();
  const navigate = useNavigate();
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, mode } = useSelector((state: RootState) => state.theme);
  const user = useAppSelector((state) => state.user.user);
  const isArchive = useAppSelector((state) => state.chat.isArchived);
  const isFavorite = useSelector((state: RootState) => state.chat.isFavorite);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareOpen, setShareOpen] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState(false);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!chatId) {
        dispatch(setIsFavorite(false));
        dispatch(setIsArchived(false));
        return;
      }

      const result = await fetchMessages(chatId);
      if (result.success) {
        dispatch(setIsFavorite(result.data.isFavorite || false));
        dispatch(setIsArchived(result.data.isArchived || false));
      }
    };

    fetchFavoriteStatus();
  }, [chatId]);

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

  const toggleFavorite = async () => {
    if (!chatId) return;
    setFavoriteLoading(true);
    try {
      dispatch(setActionLoadingId(chatId));
      const result = await toggleFavoriteChat(chatId);
      if (result.success) {
        dispatch(setIsFavorite(!isFavorite));
      } else {
        showToast.error(result.message || "Failed to update favorite status");
      }
    } finally {
      dispatch(setActionLoadingId(null));
      setFavoriteLoading(false);
    }
  };

  const toggleArchiveChat = async () => {
    if (!chatId) return;

    setArchiveLoading(true);
    try {
      dispatch(setActionLoadingId(chatId));
      const result = await archiveChat(chatId);

      if (result.success) {
        const newIsArchived = !isArchive;
        dispatch(setIsArchived(newIsArchived));

        if (newIsArchived) {
          // Chat was archived
          dispatch(resetChat());
          navigate("/");
          showToast.success(result.message || "Chat archived");
        } else {
          // Chat was unarchived
          navigate(`/chat/${chatId}`);
          showToast.success(result.message || "Chat unarchived");
        }

        setIsMenuOpen(false);
        setIsMobileMenuOpen(false);
      } else {
        showToast.error(result.message || "Failed to update archive status");
      }
    } finally {
      dispatch(setActionLoadingId(null));
      setArchiveLoading(false);
    }
  };

  return (
    <header
      className="sticky top-0 w-full z-[100] py-3 px-4 border-b flex items-center justify-between"
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
        borderColor: "var(--color-border)",
      }}
    >
      <HeaderTitle toggleSidebar={toggleSidebar} />

      <div className="flex items-center space-x-1 sm:space-x-3">
        <ThemeToggleButton
          isDarkMode={isDarkMode}
          mode={mode}
          toggleTheme={() => dispatch(toggleTheme())}
        />

        {chatId && (
          <>
            {user && (
              <ChatActions
                chatId={chatId}
                isFavorite={isFavorite}
                isArchive={isArchive}
                toggleFavorite={toggleFavorite}
                favoriteLoading={favoriteLoading}
                setShareOpen={setShareOpen}
              />
            )}

            <MobileMenu
              isOpen={isMobileMenuOpen}
              ref={mobileMenuRef}
              toggleMenu={() => setIsMobileMenuOpen((prev) => !prev)}
              toggleFavorite={toggleFavorite}
              favoriteLoading={favoriteLoading}
              isFavorite={isFavorite}
              isArchive={isArchive}
              toggleArchiveChat={toggleArchiveChat}
              archiveLoading={archiveLoading}
              openDeleteModal={() => setIsDeleteModalOpen(true)}
              setShareOpen={setShareOpen}
              chatId={chatId}
            />
            <DesktopMenu
              isOpen={isMenuOpen}
              ref={desktopMenuRef}
              toggleMenu={() => setIsMenuOpen((prev) => !prev)}
              toggleArchiveChat={toggleArchiveChat}
              archiveLoading={archiveLoading}
              openDeleteModal={() => setIsDeleteModalOpen(true)}
              isArchive={isArchive}
              chatId={chatId}
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
