import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { generateShareId } from "../../actions/chat.actions";
import useToast from "../../hooks/useToast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  chatId,
}: ShareModalProps) {
  const showToast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);

  const shareUrl = shareId
    ? `${window.location.origin}/share/${shareId}`
    : "Generating...";

  useEffect(() => {
    if (!isOpen) return;

    const fetchShareId = async () => {
      if (!chatId) return;

      try {
        const result = await generateShareId(chatId);
        if (result.success && result.shareId) {
          setShareId(result.shareId);
        } else {
          showToast.error(result.message || "Failed to generate share link.");
        }
      } catch (error) {
        console.error("Share ID fetch error:", error);
        showToast.error("Error generating share link.");
      }
    };

    setCopied(false);
    setShareId(null);
    fetchShareId();
  }, [isOpen, chatId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showToast.error("Failed to copy link.");
      console.error("Clipboard error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-[1001]" />
      <div className="fixed inset-0 z-[1002] flex items-center justify-center">
        <div className="bg-[#121212] border border-[#e8e8e61a] rounded-lg p-6 max-w-sm w-full mx-4">
          <h2 className="text-xl font-semibold text-[#e8e8e6] mb-4">
            Share Chat
          </h2>
          <div className="flex items-center space-x-2 mb-6">
            <input
              ref={inputRef}
              type="text"
              readOnly
              value={shareUrl}
              placeholder="Generating link..."
              className="w-full px-4 py-2 text-sm rounded-lg bg-[#202222] border border-[#e8e8e61a] text-[#e8e8e6b3] focus:outline-none"
            />
            <button
              onClick={handleCopy}
              disabled={!shareId}
              className="p-2 rounded-md bg-[#20b8cd] hover:bg-[#1a9cb0] text-white transition-colors disabled:opacity-50"
            >
              {copied ? (
                <span className="flex items-center">
                  <Check size={18} className="mr-2" /> Copied
                </span>
              ) : (
                <span className="flex items-center">
                  <Copy size={18} className="mr-2" /> Copy
                </span>
              )}
            </button>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#e8e8e6b3] hover:bg-[#202222] rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
