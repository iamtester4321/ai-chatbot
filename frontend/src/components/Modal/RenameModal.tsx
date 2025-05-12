import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import useToast from "../../hooks/useToast";
import { fetchChatNames, renameChat } from "../../actions/chat.actions";
import { useAppDispatch } from "../../store/hooks";

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  currentName: string;
}

export default function RenameModal({
  isOpen,
  onClose,
  chatId,
  currentName,
}: RenameModalProps) {
  const showToast = useToast();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState(currentName);

  const handleRename = async () => {
    if (!newName.trim()) {
      showToast.error("Chat name cannot be empty");
      return;
    }
  
    try {
      setIsLoading(true);
      const result = await renameChat(chatId, newName.trim());
  
      if (result.success) {
        showToast.success(result.message || "Chat renamed successfully!");
        await fetchChatNames(dispatch);
        onClose();
      } else {
        showToast.error(result.message || "Failed to rename chat");
      }
    } catch (error) {
      showToast.error("An error occurred while renaming the chat");
      console.error("Error renaming chat:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (isOpen) {
      setNewName(currentName);
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[1001] flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-xl font-semibold text-white mb-4">Rename Chat</h2>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full px-4 py-2 mb-6 text-sm rounded-lg bg-[#202222] border border-[#e8e8e61a] text-gray-200 placeholder-[#e8e8e6b3] focus:outline-none focus:border-[#20b8cd]"
          placeholder="Enter new name"
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleRename}
            disabled={isLoading}
            className="px-4 py-2 text-sm bg-[#20b8cd] hover:bg-[#1a9cb0] text-white rounded-md transition-colors disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Renaming...
              </>
            ) : (
              "Rename"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}