import { CornerUpLeft, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { archiveChat } from "../../actions/chat.actions";
import useToast from "../../hooks/useToast";
import { ChatState } from "../../lib/types";
import DeleteModal from "../Modal/DeleteModal";

interface ArchivedChatsProps {
  archivedChats: ChatState["chatList"];
}

const ArchivedChats = ({ archivedChats }: ArchivedChatsProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const showToast = useToast();

  const openDeleteModal = (chatId: string) => {
    setSelectedChatId(chatId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedChatId(null);
    setIsDeleteModalOpen(false);
  };

  const handleRestoreChat = async (chatId: string) => {
    try {
      const result = await archiveChat(chatId);

      if (result.success) {
        showToast.success("Chat restored");
      } else {
        showToast.error(result.message || "Failed to restore chat");
      }
    } catch (error) {
      showToast.error("An error occurred while restoring chat");
      console.error("Error restoring chat:", error);
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
            >
              {chat.name}
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRestoreChat(chat.id)}
                className="p-2 rounded-lg transition-colors"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-muted-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                title="Restore Chat"
              >
                <CornerUpLeft size={16} />
              </button>
              <button
                onClick={() => openDeleteModal(chat.id)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  color: "var(--color-error)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-muted)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
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
