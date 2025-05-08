import { useEffect, useRef, useState } from "react";
import GlobeIcon from "../../assets/icons/GlobeIcon";
import CustomLogo from "../../assets/icons/Logo";
import PlusIcon from "../../assets/icons/Pluse";
import SearchIcon from "../../assets/icons/SearchIcon";
import SunIcon from "../../assets/icons/SunIcon";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest("button")
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <section className="relative">
      {/* Toggle Button (visible on small screens) */}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`  
          fixed top-0 left-0 z-40 h-full w-[72px] bg-[#202222] 
          flex-col items-center py-4 transition-transform duration-300
          md:flex ${isOpen ? "flex" : "hidden"}
        `}
      >
        <div className="w-8 h-9 cursor-pointer mt-1">
          <CustomLogo />
        </div>

        <div className="pt-2 flex flex-col items-center justify-center mt-6">
          <div className="my-8 flex items-center justify-center w-10 h-10 bg-[#2D2F2F] rounded-full cursor-pointer group transform transition duration-300 hover:scale-110">
            <PlusIcon />
          </div>

          <SidebarItem icon={<SearchIcon />} label="Home" />
          <SidebarItem icon={<GlobeIcon />} label="Discover" />
          <SidebarItem icon={<SunIcon />} label="Explore" />
        </div>

          <div className="p-2 absolute bottom-[30px]">
              <div className="bg-[#e8e8e6] w-8 h-8 rounded-full flex items-center justify-center ">
                  <svg width="24" height="auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-8">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1927 4.54688C11.4375 4.71875 11.651 4.86458 12 4.86458C12.3453 4.86458 12.5529 4.72184 12.7993 4.55235L12.8073 4.54688L12.8084 4.54609C13.152 4.31187 13.5635 4.03125 14.5 4.03125C16.0885 4.03125 17.2083 6.30729 17.9375 8.6875C20.401 9.14062 22 9.875 22 10.6979C22 11.4427 20.6979 12.1094 18.6354 12.5677C18.6562 12.776 18.6667 12.9844 18.6667 13.1979C18.6667 14.0833 18.4948 14.9271 18.1823 15.6979H18.1965C17.2165 18.1697 14.8115 19.9169 12 19.9169C9.18854 19.9169 6.78355 18.1697 5.80356 15.6979H5.81771C5.50521 14.9271 5.33333 14.0833 5.33333 13.1979C5.33333 12.9844 5.34375 12.776 5.36458 12.5677C3.30208 12.1094 2 11.4427 2 10.6979C2 9.875 3.59896 9.14062 6.0625 8.6875C6.79167 6.30729 7.91146 4.03125 9.5 4.03125C10.4365 4.03125 10.848 4.31187 11.1916 4.54609L11.1927 4.54688ZM14.2708 15.6979H14.9167C16.0677 15.6979 17 14.7656 17 13.6146V12.8646C15.5312 13.0781 13.8229 13.1979 12 13.1979C10.1771 13.1979 8.46875 13.0781 7 12.8646V13.6146C7 14.7656 7.93229 15.6979 9.08333 15.6979H9.73437C10.5885 15.6979 11.3542 15.1458 11.625 14.3333C11.7448 13.9687 12.2604 13.9687 12.3802 14.3333C12.651 15.1458 13.4115 15.6979 14.2708 15.6979Z" fill="#191a1a"></path>
                  </svg>
              </div>
          </div>

          <div className="div">
             <div className="d">
                <div className="inner">
                  <div className="top">
                      <div className="one">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7999999999999998" stroke-linecap="round" stroke-linejoin="round" className="tabler-icon tabler-icon-user-circle opacity-90">
                              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path><path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path><path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"></path>
                           </svg>
                           <a href="#">My account</a>
                      </div>

                      <div className="tow">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7999999999999998" stroke-linecap="round" stroke-linejoin="round" className="tabler-icon tabler-icon-toggle-right opacity-90">
                               <path d="M16 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M2 6m0 6a6 6 0 0 1 6 -6h8a6 6 0 0 1 6 6v0a6 6 0 0 1 -6 6h-8a6 6 0 0 1 -6 -6z"></path>
                           </svg>
                           <a href="#">Personalize</a>
                      </div>

                      <div className="three">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"   stroke="currentColor" stroke-width="1.7999999999999998" stroke-linecap="round" stroke-linejoin="round" className="tabler-icon tabler-icon-bell opacity-90">
                            <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"></path><path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
                        </svg>
                        <a href="#">Notifications</a>
                      </div>

                      <div className="four">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7999999999999998" stroke-linecap="round" stroke-linejoin="round" className="tabler-icon tabler-icon-device-laptop opacity-90">
                            <path d="M3 19l18 0"></path><path d="M5 6m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z"></path>
                         </svg>
                      </div>
                  </div>
                </div>
             </div>
          </div>
      </div>

      {/* Content area beside sidebar */}
      <div className="ml-0 w-full h-screen bg-[#1a1a1a]">
        {/* Main content would go here */}
      </div>  

      <div className="bg-[#1a1a1a] max-w-[191px] w-full h-full flex flex-col absolute">
          <div className="py-3 border-b border-[#3d3f4080]"> 
              <h4 className="text-sm text-[#e8e8e6] font-medium">Home</h4>
          </div>
          <div className="pt-3 flex flex-col gap-2 items-start">
             <h4 className="text-sm text-[#e8e8e6] font-medium">Library</h4>
             <p className="text-sm text-[#e8e8e6] font-medium">+  Create a Thread</p>
          </div>
      </div>
    </section>
  );
};

const SidebarItem = ({ icon, label }) => {
  return (
    <div className="flex items-center gap-0.5 flex-col p-2 cursor-pointer">
      <div className="flex items-center justify-center w-10 h-10 bg-transparent hover:bg-[#2D2F2F] group transform transition duration-300 hover:scale-110 rounded-[6px]">
        {icon}
      </div>
      <span className="font-montserrat  text-xs text-[#898D8D]">
        {label}
      </span>
    </div>
  );
};

export default Sidebar;