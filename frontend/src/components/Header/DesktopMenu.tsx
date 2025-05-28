import { Archive, Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import { forwardRef } from "react";
import { DesktopMenuProps } from "../../lib/types";
import { useAppSelector } from "../../store/hooks";

const DesktopMenu = forwardRef<HTMLDivElement, DesktopMenuProps>(
  (
    {
      isOpen,
      toggleMenu,
      toggleArchiveChat,
      openDeleteModal,
      isArchive,
      chatId,
      archiveLoading,
    },
    ref
  ) => {
    const actionLoadingId = useAppSelector(
      (state) => state.chat.actionLoadingId
    );
    const user = useAppSelector((state) => state.user.user);
    const { messages } = useAppSelector((state) => state.chat);
    const isLoading = actionLoadingId === chatId;

    return (
      <div className="relative hidden sm:block" ref={ref}>
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
                onClick={toggleArchiveChat}
                className={`px-4 py-2 text-sm w-full text-left flex items-center rounded ${
                  archiveLoading || messages.length < 2
                    ? "bg-[var(--color-disabled-bg)] text-[var(--color-disabled-text)] cursor-not-allowed"
                    : "hover:bg-[var(--color-muted)] cursor-pointer"
                }`}
                disabled={archiveLoading || messages.length < 2}
              >
                {archiveLoading ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <Archive size={16} className="mr-2" />
                )}
                {isArchive ? "Unarchive" : "Archive"}
              </button>
              <button
                onClick={openDeleteModal}
                className={`px-4 py-2 text-sm w-full text-left flex items-center rounded ${
                  isLoading || messages.length < 2
                    ? "bg-[var(--color-disabled-bg)] text-[var(--color-disabled-text)] cursor-not-allowed"
                    : "hover:bg-[var(--color-muted)] cursor-pointer text-[var(--color-error)]"
                }`}
                style={{ color: "var(--color-error)" }}
                disabled={isLoading || messages.length < 2}
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

export default DesktopMenu;
