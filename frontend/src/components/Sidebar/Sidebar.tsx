import { useEffect, useRef, useState } from "react";
import GlobeIcon from "../../assets/icons/GlobeIcon";
import CustomLogo from "../../assets/icons/Logo";
import PlusIcon from "../../assets/icons/Pluse";
import SearchIcon from "../../assets/icons/SearchIcon";
import SunIcon from "../../assets/icons/SunIcon";
import { SidebarItemProps } from "../../lib/types";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;

      if (
        sidebarRef.current &&
        !(
          sidebarRef.current.contains(target) ||
          (target instanceof Element && target.closest("button"))
        )
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
      <button
        className="md:hidden absolute top-6 left-6 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CustomLogo />
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 z-40 h-full w-[72px] bg-[#202222] 
          flex-col items-center py-4 transition-all duration-300 ease-in-out
          md:w-20 ${isOpen ? "w-72" : "w-20"} 
        `}
      >
        <div className="w-8 h-9 cursor-pointer mt-1">
          <CustomLogo />
        </div>

        {/* Sidebar items */}
        <div className="pt-6 flex flex-col items-center justify-center space-y-4">
          <div
            className="my-6 flex items-center justify-center w-12 h-12 bg-[#2D2F2F] rounded-full cursor-pointer group transform transition duration-300 hover:scale-110"
          >
            <PlusIcon />
          </div>

          <SidebarItem icon={<SearchIcon />} label="Home" isOpen={isOpen} />
          <SidebarItem icon={<GlobeIcon />} label="Discover" isOpen={isOpen} />
          <SidebarItem icon={<SunIcon />} label="Explore" isOpen={isOpen} />
        </div>
      </div>

      {/* Content area beside sidebar */}
      <div className={`ml-0 md:ml-20 w-full h-screen bg-[#1a1a1a]`}>
        {/* Main content would go here */}
      </div>
    </section>
  );
};

const SidebarItem = ({ icon, label, isOpen }: SidebarItemProps & { isOpen: boolean }) => {
  return (
    <div
      className="flex items-center gap-2 flex-col md:flex-row p-2 cursor-pointer transition-all duration-200 group hover:bg-[#3B3B3B] rounded-md"
    >
      <div className="flex items-center justify-center w-10 h-10 bg-transparent group-hover:bg-[#2D2F2F] rounded-[6px]">
        {icon}
      </div>
      {isOpen && (
        <span className="font-sans text-sm font-normal text-[#898D8D] group-hover:text-white transition-colors">
          {label}
        </span>
      )}
    </div>
  );
};

export default Sidebar;
