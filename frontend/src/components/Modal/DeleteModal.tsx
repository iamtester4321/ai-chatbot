import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteChat } from "../../actions/chat.actions";
import useToast from "../../hooks/useToast";
import { resetChat } from "../../store/features/chat/chatSlice";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  chatId,
}: DeleteModalProps) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[1001] flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-xl font-semibold text-white mb-4">Delete Chat</h2>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete this chat? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors disabled:opacity-50 flex items-center"
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
  );
}
