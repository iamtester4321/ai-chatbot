import { Monitor, Moon, Sun } from "lucide-react";

interface ThemeToggleButtonProps {
  isDarkMode: boolean;
  mode: "light" | "dark" | "system";
  toggleTheme: () => void;
}

export default function ThemeToggleButton({ isDarkMode, mode, toggleTheme }: ThemeToggleButtonProps) {
  const renderIcon = () => {
    if (mode === "system") return <Monitor size={20} />;
    return isDarkMode ? <Sun size={20} /> : <Moon size={20} />;
  };

  const tooltip =
    mode === "system"
      ? isDarkMode
        ? "Switch to Light Mode"
        : "Switch to Dark Mode"
      : mode === "light"
        ? "Switch to Dark Mode"
        : "Switch to Light Mode";

  return (
    <button
      className="p-2 rounded-full transition duration-200"
      title={tooltip}
      style={{ backgroundColor: "transparent" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-hover-bg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
      onClick={toggleTheme}
    >
      {renderIcon()}
    </button>
  );
}
