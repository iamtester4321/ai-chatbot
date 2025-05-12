import { LogOut, Settings } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

interface UserPillProps {
  user: {
    id: string;
    email: string;
  } | null;
  onLogoutClick: () => void;
  setIsSettingsOpen: (open: boolean) => void;
}

const UserDetail = ({
  user,
  onLogoutClick,
  setIsSettingsOpen,
}: UserPillProps) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  if (!user) {
    return (
      <Link
        to="/login"
        className="w-full p-2.5 bg-[#20b8cd] text-white cursor-pointer rounded-lg transition-all duration-200 flex items-center justify-center mt-2 hover:bg-[#1ca3b5]"
      >
        Login
      </Link>
    );
  }

  return (
    <>
      <div className="relative" ref={userMenuRef}>
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="w-full flex items-center justify-between mt-2 p-2 bg-[#202222] rounded-full hover:bg-[#2c2c2c] transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#20b8cd] flex items-center justify-center text-white font-medium">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <span className="text-[#e8e8e6] text-sm truncate">
              {user.email}
            </span>
          </div>
        </button>

        {isUserMenuOpen && (
          <div className="absolute bottom-full left-0 mb-1 w-full rounded-md shadow-lg bg-[#121212] border border-[#e8e8e61a]">
            <div className="py-1">
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="px-4 py-2 text-sm text-[#e8e8e6b3] hover:bg-[#202222] w-full text-left flex items-center cursor-pointer"
              >
                <Settings size={16} className="mr-2" />
                Settings
              </button>
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onLogoutClick();
                }}
                className="px-4 py-2 text-sm text-red-500 hover:bg-[#202222] w-full text-left flex items-center cursor-pointer"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDetail;
