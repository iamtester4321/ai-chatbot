import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteChat } from "../../actions/chat.actions";
import useToast from "../../hooks/useToast";
import { DeleteModalProps } from "../../lib/types";
import { resetChat } from "../../store/features/chat/chatSlice";

export default function DeleteModal({
  isOpen,
  onClose,
  chatId,
}: DeleteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showToast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const result = await deleteChat(chatId);

      if (result.success) {
        dispatch(resetChat());
        showToast.success("Chat deleted successfully!");
        navigate("/");
        onClose();
      } else {
        showToast.error(result.message || "Failed to delete chat");
      }
    } catch (error) {
      showToast.error("An error occurred while deleting the chat");
      console.error("Error deleting chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-[1001]" />
      <div className="fixed inset-0 z-[1002] flex items-center justify-center">
        <div
          ref={modalRef}
          className="rounded-lg p-6 max-w-sm w-full mx-4 border"
          style={{
            backgroundColor: "var(--color-bg)",
            borderColor: "var(--color-border)",
          }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: "var(--color-text)" }}
          >
            Delete Chat
          </h2>
          <p className="mb-6" style={{ color: "var(--color-text)" }}>
            Are you sure you want to delete this chat? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-[var(--color-disabled-text)] hover:text-[var(--color-text)] hover:bg-[var(--color-hover-bg)] rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-4 py-2 text-sm rounded-md transition-colors disabled:opacity-50 flex items-center"
              style={{
                backgroundColor: "var(--color-delete-base)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--color-delete-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--color-delete-base)";
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
