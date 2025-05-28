import { CornerUpLeft, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { archiveChat } from "../../actions/chat.actions";
import useToast from "../../hooks/useToast";
import { ArchivedChatsProps } from "../../lib/types";
import { setIsArchived } from "../../store/features/chat/chatSlice";
import { useAppDispatch } from "../../store/hooks";
import DeleteModal from "../Modal/DeleteModal";

const ArchivedChats = ({ archivedChats, onClose }: ArchivedChatsProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [restoringChatId, setRestoringChatId] = useState<string | null>(null);
  const showToast = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const openDeleteModal = (chatId: string) => {
    setSelectedChatId(chatId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedChatId(null);
    setIsDeleteModalOpen(false);
  };

  const handleRestoreChat = async (chatId: string) => {
    setRestoringChatId(chatId);
    try {
      const result = await archiveChat(chatId);

      if (result.success) {
        dispatch(setIsArchived(false));
        onClose();
        showToast.success("Chat restored");
        navigate(`/chat/${chatId}`);
      } else {
        showToast.error(result.message || "Failed to restore chat");
      }
    } catch (error) {
      showToast.error("An error occurred while restoring chat");
      console.error("Error restoring chat:", error);
    } finally {
      setRestoringChatId(null);
    }
  };

  if (!archivedChats?.length) {
    return (
      <div
        style={{ color: "var(--color-disabled-text)" }}
        className="text-center py-8"
      >
        No archived chats found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-medium mb-2"
        style={{ color: "var(--color-text)" }}
      >
        Archived Chats
      </h3>
      {archivedChats.map((chat) => (
        <div
          key={chat.id}
          className="rounded-lg p-4"
          style={{ backgroundColor: "var(--color-muted)" }}
        >
          <div className="flex items-center justify-between">
            <Link
              to={`/chat/${chat.id}`}
              style={{ color: "var(--color-text)" }}
              className="font-medium hover:text-[var(--color-primary)] transition-colors"
              onClick={onClose}
            >
              {chat.name}
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRestoreChat(chat.id)}
                className="p-2 rounded-lg transition-colors hover:bg-[var(--color-hover-bg)] cursor-pointer"
                title="Restore Chat"
              >
                {restoringChatId === chat.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CornerUpLeft size={16} />
                )}
              </button>
              <button
                onClick={() => openDeleteModal(chat.id)}
                className="p-2 rounded-lg transition-colors hover:bg-[var(--color-hover-bg)] cursor-pointer"
                style={{ color: "var(--color-error)" }}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        chatId={selectedChatId || ""}
      />
    </div>
  );
};

export default ArchivedChats;
