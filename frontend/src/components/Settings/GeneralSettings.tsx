import { ChevronDown, LogOut, Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setTheme } from "../../store/features/themeSlice";
import LogoutModal from "../Modal/LogoutModal";

const GeneralSettings = () => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
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

  const SelectedIcon = themes.find((t) => t.id === mode)?.icon || Monitor;

  return (
    <div className="relative space-y-6">
      {/* Theme dropdown */}
      <div ref={themeMenuRef} className="relative space-y-4 z-20">
        <h3 className="text-lg font-medium text-text mb-2">Theme</h3>
        <button
          onClick={() => setIsThemeMenuOpen((prev) => !prev)}
          className="w-full flex items-center justify-between p-2 bg-muted border border-border rounded-lg hover:bg-muted-hover transition-colors"
        >
          <div className="flex items-center gap-2">
            <SelectedIcon size={18} className="text-icon" />
            <span className="text-sm text-text">
              {themes.find((t) => t.id === mode)?.label}
            </span>
          </div>
          <ChevronDown size={18} className="text-icon-muted" />
        </button>

        {isThemeMenuOpen && (
          <div
            className="absolute top-full left-0 mt-1 w-full rounded-md shadow-lg z-50"
            style={{
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            <div className="py-1">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    dispatch(setTheme(theme.id as any));
                    setIsThemeMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm flex items-center transition-colors rounded-md"
                  style={{
                    color: "var(--color-text)",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-muted)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <theme.icon
                    size={16}
                    className="mr-2"
                    style={{ color: "var(--color-text)" }}
                  />
                  <span>{theme.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Logout button */}
      <div className="space-y-2 relative z-10">
        <h3 className="text-lg font-medium text-text mb-2">
          Log out on this device
        </h3>
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-border text-red-600 transition-colors"
          style={{
            backgroundColor: "var(--color-muted)",
            borderRadius: "8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-muted-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-muted)";
          }}
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
