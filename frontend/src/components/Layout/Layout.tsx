import { useTheme } from "../../context/ThemeProvider"; 
import ChatInputField from "../ChatInputField/ChatInputField";
import Sidebar from "../Sidebar/Sidebar";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

function Layout() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="flex max-h-screen bg-primary-light dark:bg-primary-dark">
      <div className="fixed top-0 left-0 w-[72px] h-full bg-secondary text-white z-[1000]">
        <Sidebar />
      </div>
      <div className="ml-[72px] flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <ChatInputField />
        </div>
        <div className="sticky bottom-0 w-full bg-primar z-[1000] px-4 pt-2"></div>
      </div>

      <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
    </div>
  );
}

export default Layout;
