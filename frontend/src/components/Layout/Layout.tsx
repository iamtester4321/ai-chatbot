import ChatInputField from "../ChatInputField/ChatInputField";
import Sidebar from "../Sidebar/Sidebar";

function Layout() {
  return (
    <div className="flex max-h-screen bg-[#121212]">
      <div className="fixed top-0 left-0 w-[72px] h-full bg-[#2c3e50] text-white z-[1000]">
        <Sidebar />
      </div>
      <div className="ml-[72px] flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <ChatInputField />
        </div>
        <div className="sticky bottom-0 w-full bg-[#121212] z-[1000] px-4 pt-2"></div>
      </div>
    </div>
  );
}

export default Layout;
