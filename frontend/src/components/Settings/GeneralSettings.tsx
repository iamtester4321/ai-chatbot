import { ChevronDown, LogOut, Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import LogoutModal from "../Modal/LogoutModal";

const GeneralSettings = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("system");
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target as Node)
      ) {
        setIsThemeMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themes = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];

  const selectedThemeIcon = themes.find(
    (theme) => theme.id === selectedTheme
  )?.icon;
  const ThemeIcon = selectedThemeIcon || Monitor;

  return (
    <div className="space-y-6">
      <div>
        <div className="space-y-4">
          <div className="relative" ref={themeMenuRef}>
            <h3 className="text-lg font-medium text-white mb-2">Theme</h3>
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="w-full flex items-center justify-between p-2 bg-[#202222] border border-[#e8e8e61a] rounded-lg hover:bg-[#2c2c2c] transition-colors"
            >
              <div className="flex items-center gap-2 text-[#e8e8e6]">
                <ThemeIcon size={18} />
                <span className="text-sm">
                  {themes.find((theme) => theme.id === selectedTheme)?.label}
                </span>
              </div>
              <ChevronDown size={18} className="text-[#e8e8e6b3]" />
            </button>

            {isThemeMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-full rounded-md shadow-lg bg-[#121212] border border-[#e8e8e61a] z-10">
                <div className="py-1">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setSelectedTheme(theme.id);
                        setIsThemeMenuOpen(false);
                      }}
                      className="px-4 py-2 text-sm text-[#e8e8e6b3] hover:bg-[#202222] w-full text-left flex items-center"
                    >
                      <theme.icon size={16} className="mr-2" />
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-white mb-2">
          Log out on this device
        </h3>
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-[#e8e8e61a] text-red-500 rounded-lg hover:bg-[#202222] transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};

export default GeneralSettings;
