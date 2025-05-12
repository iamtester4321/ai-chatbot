import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../actions/auth.actions";
import useToast from "../../hooks/useToast";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const navigate = useNavigate();
  const showToast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const result = await logoutUser();

      if (result.success) {
        showToast.success(result.message);
        navigate("/login");
        onClose();
      } else {
        showToast.error(result.message);
      }
    } catch (error) {
      showToast.error("An error occurred while logging out");
      console.error("Error logging out:", error);
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
          <h2 className="text-xl font-semibold text-[#e8e8e6] mb-4">Logout</h2>
          <p className="text-[#e8e8e6b3] mb-6">Are you sure you want to logout?</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-[#e8e8e6b3] hover:bg-[#202222] rounded-md transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging out...
                </>
              ) : (
                "Logout"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
