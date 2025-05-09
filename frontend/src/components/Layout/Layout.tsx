import { useState, useEffect } from 'react';
import ChatInputField from "../ChatInputField/ChatInputField";
import Sidebar from "../Sidebar/Sidebar";
import ThemeToggle from "../Theme/Theme";

function Layout() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';  
    setIsDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString()); 
  }, [isDarkMode]);

  return (
    <div className="flex max-h-screen bg-primary-light dark:bg-primary-dark">
      <div className="fixed top-0 left-0 w-[72px] h-full bg-secondary text-white z-[1000]">
        <Sidebar />
      </div>
      <div className="ml-[72px] flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <ChatInputField />
        </div>
        <div className="sticky bottom-0 w-full bg-primary z-[1000] px-4 pt-2"></div>
      </div>

      <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
    </div>
  );
}

export default Layout;