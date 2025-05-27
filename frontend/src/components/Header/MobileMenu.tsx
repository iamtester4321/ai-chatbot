import {
  Archive,
  MoreHorizontal,
  Share2,
  SquarePen,
  Star,
  Trash2,
} from "lucide-react";
import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { MobileMenuProps } from "../../lib/types";
import { useAppSelector } from "../../store/hooks";

const MobileMenu = forwardRef<HTMLDivElement, MobileMenuProps>(
  (
    {
      isOpen,
      toggleMenu,
      toggleFavorite,
      isFavorite,
      isArchive,
      archiveChat,
      openDeleteModal,
      setShareOpen,
      chatId,
    },
    ref
  ) => {
    const actionLoadingId = useAppSelector(
      (state) => state.chat.actionLoadingId
    );
    const user = useAppSelector((state) => state.user.user);
    const isLoading = actionLoadingId === chatId;
    const navigate = useNavigate();

    const handleNewChat = () => {
      navigate("/chat");
    };

    return (
      <div className="relative sm:hidden" ref={ref}>
        {/* New Chat Button */}
        <button
          className="p-2 rounded-full transition duration-200 cursor-pointer"
          style={{ backgroundColor: "transparent" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-hover-bg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="New Chat"
          onClick={handleNewChat}
          disabled={isLoading}
        >
          <SquarePen size={20} className={isLoading ? "opacity-50" : ""} />
        </button>
        {user && (
          <button
            className="p-2 rounded-full transition duration-200 cursor-pointer"
            style={{ backgroundColor: "transparent" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-hover-bg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            title="More Options"
            onClick={toggleMenu}
            disabled={isLoading}
          >
            <MoreHorizontal
              size={20}
              className={isLoading ? "opacity-50" : ""}
            />
          </button>
        )}

        {isOpen && (
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
                className="px-4 py-2 text-sm w-full text-left flex items-center hover:bg-[var(--color-muted)] cursor-pointer"
                style={{ color: "var(--color-text)" }}
                onClick={() => setShareOpen(true)}
                disabled={isLoading}
              >
                <Share2
                  size={18}
                  className={`mr-2 ${isLoading ? "opacity-50" : ""}`}
                />
                Share
              </button>

              {!isArchive && (
                <button
                  onClick={toggleFavorite}
                  className="px-4 py-2 text-sm w-full text-left flex items-center hover:bg-[var(--color-muted)] cursor-pointer"
                  style={{ color: "var(--color-text)" }}
                  disabled={isLoading}
                >
                  <Star
                    className={`mr-2 ${isLoading ? "opacity-50" : ""}`}
                    size={18}
                    fill={isFavorite ? "gold" : "none"}
                    color={isFavorite ? "gold" : "currentColor"}
                  />
                  Favourite
                </button>
              )}

              <button
                onClick={archiveChat}
                className="px-4 py-2 text-sm w-full text-left flex items-center hover:bg-[var(--color-muted)] cursor-pointer"
                style={{ color: "var(--color-text)" }}
                disabled={isLoading}
              >
                <Archive
                  size={16}
                  className={`mr-2 ${isLoading ? "opacity-50" : ""}`}
                />
                {isArchive ? "Un-archive" : "Archive"}
              </button>
              <button
                onClick={openDeleteModal}
                className="px-4 py-2 text-sm w-full text-left flex items-center hover:bg-[var(--color-muted)] cursor-pointer"
                style={{ color: "var(--color-error)" }}
                disabled={isLoading}
              >
                <Trash2
                  size={16}
                  className={`mr-2 ${isLoading ? "opacity-50" : ""}`}
                />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default MobileMenu;
