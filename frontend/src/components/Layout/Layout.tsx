import ChatInputField from "../ChatInputField/ChatInputField";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../header/header";

function Layout() {
  return (
    <div className="flex max-h-screen bg-[#121212]">
      <div className="fixed top-0 left-0  h-full bg-[#2c3e50] text-white z-[1000]">
        <Sidebar />
      </div>
      <div className="ml-auto flex-1 flex flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto">
          <ChatInputField />
        </div>
        <div className="sticky bottom-0 w-full bg-[#121212] z-[1000] px-4 "></div>
      </div>
    </div>
  );
}

export default Layout;