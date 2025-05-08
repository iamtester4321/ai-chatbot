import { useEffect, useRef, useState } from "react";
import GlobeIcon from "../../assets/icons/GlobeIcon";
import CustomLogo from "../../assets/icons/Logo";
import PlusIcon from "../../assets/icons/Pluse";
import SearchIcon from "../../assets/icons/SearchIcon";
import SunIcon from "../../assets/icons/SunIcon";

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
      </div>

      {/* Content area beside sidebar */}
      <div className="ml-0 w-full h-screen bg-[#1a1a1a]">
        {/* Main content would go here */}
      </div>
    </section>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
}

const SidebarItem = ({ icon, label }: SidebarItemProps) => {
  return (
    <div className="flex items-center gap-0.5 flex-col p-2 cursor-pointer">
      <div className="flex items-center justify-center w-10 h-10 bg-transparent hover:bg-[#2D2F2F] group transform transition duration-300 hover:scale-110 rounded-[6px]">
        {icon}
      </div>
      <span className="font-sans text-xs font-normal text-[#898D8D]">
        {label}
      </span>
    </div>
  );
};

export default Sidebar;
