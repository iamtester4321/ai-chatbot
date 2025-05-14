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
        <div
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
            Logout
          </h2>
          <p className="mb-6" style={{ color: "var(--color-text-muted)" }}>
            Are you sure you want to logout?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm rounded-md transition-colors disabled:opacity-50"
              style={{
                color: "var(--color-disabled-text)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--color-muted-hover)";
                e.currentTarget.style.color = "var(--color-text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--color-disabled-text)";
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
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
