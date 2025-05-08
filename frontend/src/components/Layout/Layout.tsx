import ChatInputField from "../ChatInputField/ChatInputField";
import Sidebar from "../Sidebar/Sidebar";


function Layout() {
  return (
    <div className="">
      <div className="fixed top-0 left-0 w-[72px] h-full bg-[#2c3e50] text-white box-border z-[1000]">
        <Sidebar />
      </div>

      <div className="fixed bottom-0 left-[72px] w-[calc(100%-72px)] p-2 z-[1000]">
        <ChatInputField />
      </div>
    </div>
  );

}

export default Layout;