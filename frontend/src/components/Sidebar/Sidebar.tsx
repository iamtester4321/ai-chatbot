import { useEffect, useRef, useState } from "react";
import GlobeIcon from "../../assets/icons/GlobeIcon";
import CustomLogo from "../../assets/icons/Logo";
import PlusIcon from "../../assets/icons/Pluse";
import SearchIcon from "../../assets/icons/SearchIcon";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;

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
    <div className="h-full w-full sidebar-bg flex flex-col items-center py-4">
      <div className="w-8 h-9 cursor-pointer mt-1">
        <CustomLogo />
      </div>

      <div className="pt-2 flex flex-col items-center justify-center mt-6">
        <div className="my-8 flex items-center justify-center w-10 h-10 bg-accent-light dark:bg-accent-dark rounded-full cursor-pointer group transform transition duration-300 hover:scale-110">
          <PlusIcon />
        </div>

        <SidebarItem icon={<SearchIcon />} label="Home" />
        <SidebarItem icon={<GlobeIcon />} label="Discover" />
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label }) => {
  return (
    <div className="flex items-center gap-0.5 flex-col p-2 cursor-pointer">
      <div className="flex items-center justify-center w-10 h-10 bg-transparent hover:bg-accent-light hover:dark:bg-accent-dark group transform transition duration-300 hover:scale-110 rounded-[6px]">
        {icon}
      </div>
      <span className="font-sans text-xs font-normal text-highlight-light dark:text-highlight-dark">
        {label}
      </span>
    </div>
  );
};

export default Sidebar;