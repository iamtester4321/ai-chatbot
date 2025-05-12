import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { renameChat } from "../../actions/chat.actions";
import useToast from "../../hooks/useToast";

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
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState(currentName);
  useEffect(() => {
    if (isOpen) {
      setNewName(currentName);
    }
  }, [isOpen, currentName]);

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

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-[1001]" />
      <div className="fixed inset-0 z-[1002] flex items-center justify-center">
        <div className="bg-[#121212] border border-[#e8e8e61a] rounded-lg p-6 max-w-sm w-full mx-4">
          <h2 className="text-xl font-semibold text-[#e8e8e6] mb-4">
            Rename Chat
          </h2>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-4 py-2 mb-6 text-sm rounded-lg bg-[#202222] border border-[#e8e8e61a] text-[#e8e8e6] placeholder-[#e8e8e6b3] focus:outline-none focus:border-[#20b8cd]"
            placeholder="Enter new name"
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-[#e8e8e6b3] hover:bg-[#202222] rounded-md transition-colors disabled:opacity-50"
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
    </>
  );
}
