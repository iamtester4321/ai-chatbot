import { Monitor, Moon, Sun } from "lucide-react";
import { ThemeToggleButtonProps } from "../../lib/types";

export default function ThemeToggleButton({
  isDarkMode,
  mode,
  toggleTheme,
}: ThemeToggleButtonProps) {
  const renderThemeIcon = () => {
    if (mode === "system") return <Monitor size={20} />;
    return isDarkMode ? <Moon size={20} /> : <Sun size={20} />;
  };
  return (
    <button
      className="p-2 rounded-full transition duration-200 cursor-pointer"
      style={{ backgroundColor: "transparent" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-hover-bg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
      title={
        mode === "light"
          ? "Switch to Dark Mode"
          : mode === "dark"
          ? "Switch to System Mode"
          : isDarkMode
          ? "Switch to Light Mode"
          : "Switch to Dark Mode"
      }
      onClick={toggleTheme}
    >
      {renderThemeIcon()}
    </button>
  );
}
