import { Archive, MoreHorizontal, Share2, Star, Trash2 } from "lucide-react";
import { forwardRef } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
  toggleFavorite: () => void;
  isFavorite: boolean;
  isArchive: boolean;
  archiveChat: () => void;
  openDeleteModal: () => void;
  setShareOpen: (state: boolean) => void;
}

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
    },
    ref
  ) => {
    return (
      <div className="relative sm:hidden" ref={ref}>
        <button
          className="p-2 rounded-full transition duration-200"
          style={{ backgroundColor: "transparent" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-hover-bg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="More Options"
          onClick={toggleMenu}
        >
          <MoreHorizontal size={20} />
        </button>

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
                className="px-4 py-2 text-sm w-full text-left flex items-center hover:bg-[var(--color-muted)]"
                style={{ color: "var(--color-text)" }}
                onClick={() => setShareOpen(true)}
              >
                <Share2 size={18} className="mr-2" />
                Share
              </button>

              {!isArchive && (
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
              )}

              <button
                onClick={archiveChat}
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
    );
  }
);

export default MobileMenu;
