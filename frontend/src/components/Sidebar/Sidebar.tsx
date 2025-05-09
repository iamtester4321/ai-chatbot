// import { useState } from "react";
// import GlobeIcon from "../../assets/icons/GlobeIcon";
// import CustomLogo from "../../assets/icons/Logo";
// import PlusIcon from "../../assets/icons/Pluse";
// import SearchIcon from "../../assets/icons/SearchIcon";
// import SunIcon from "../../assets/icons/SunIcon";

// const Sidebar = () => {
//   const [activeItem, setActiveItem] = useState("Home");

//   return (
//     <section className="flex h-screen w-full bg-[#1a1a1a]">
//       {/* Sidebar */}
//       <div className="group fixed top-0 left-0 z-40 h-full bg-[#202222] flex flex-col py-4 transition-all duration-300 w-[72px] hover:w-[240px]">
//         {/* Logo */}
//         <div className="w-full flex items-center px-4">
//           <div className="w-8 h-9 cursor-pointer">
//             <CustomLogo />
//           </div>

//         </div>

//         {/* + Button */}
//         <div className="mt-6 flex items-center space-x-3 px-4">
//           <div className="flex items-center justify-center w-10 h-10 bg-[#2D2F2F] rounded-full cursor-pointer transition duration-300 hover:scale-110">
//             <PlusIcon />
//           </div>

//         </div>

//         {/* Menu Items */}
//         <div className="mt-10 flex flex-col space-y-2 px-2">
//           <SidebarItem
//             icon={<SearchIcon />}
//             label="Home"
//             active={activeItem === "Home"}
//             onClick={() => setActiveItem("Home")}
//           />
//           <SidebarItem
//             icon={<GlobeIcon />}
//             label="Discover"
//             active={activeItem === "Discover"}
//             onClick={() => setActiveItem("Discover")}
//           />
//           <SidebarItem
//             icon={<SunIcon />}
//             label="Spaces"
//             active={activeItem === "Spaces"}
//             onClick={() => setActiveItem("Spaces")}
//           />
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="ml-[72px] group-hover:ml-[240px] transition-all duration-300 flex-1 p-4">
//         <h1 className="text-white text-xl font-semibold">{activeItem}</h1>
//       </div>
//     </section>
//   );
// };

// interface SidebarItemProps {
//   icon: React.ReactNode;
//   label: string;
//   active?: boolean;
//   onClick?: () => void;
// }

// const SidebarItem = ({ icon,  active = false, onClick }: SidebarItemProps) => {
//   return (
//     <div
//       onClick={onClick}
//       className={`flex items-center p-2 rounded-md cursor-pointer transition-all duration-200 
//         ${active ? "bg-[#2D2F2F] text-white" : "hover:bg-[#2D2F2F] text-[#898D8D] hover:text-white"}
//       `}
//     >

//       <div className="flex items-center justify-center w-10 h-10">{icon}</div>

//     </div>

//   );
// };

// export default Sidebar;
import { useState } from "react";
import GlobeIcon from "../../assets/icons/GlobeIcon";
import CustomLogo from "../../assets/icons/Logo";
import PlusIcon from "../../assets/icons/Pluse";
import SearchIcon from "../../assets/icons/SearchIcon";
import SunIcon from "../../assets/icons/SunIcon";
import SettingsIcon from "../../assets/icons/SettingIcon";
import Account from "../../assets/icons/Account";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false); // NEW

  const subSidebarContent: Record<string, string> = {
    Home: "Your personalized feed",
    Discover: "Explore new content",
    Spaces: "Collaborative spaces",
  };

  return (
    <section className="flex h-screen w-full bg-[#1a1a1a]">
      {/* Sidebar */}
      <div className="group fixed top-0 left-0 z-10 h-full bg-[#202222] flex flex-col py-8 transition-all duration-300 w-[72px]">
        {/* Logo */}
        <div className="w-full flex items-center px-4">
          <div className="w-8 h-9 cursor-pointer">
            <CustomLogo />
          </div>
        </div>

        {/* + Button */}
        <div className="mt-6 flex items-center space-x-3 px-4">
          <div className="flex items-center justify-center w-10 h-10 bg-[#2D2F2F] rounded-full cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110">
            <PlusIcon />
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-10 flex flex-col space-y-2 px-2">
          <SidebarItem
            icon={<SearchIcon />}
            label="Home"
            active={activeItem === "Home"}
            onClick={() => setActiveItem("Home")}
            onHover={setHoveredItem}
          />
          <SidebarItem
            icon={<GlobeIcon />}
            label="Discover"
            active={activeItem === "Discover"}
            onClick={() => setActiveItem("Discover")}
            onHover={setHoveredItem}
          />
          <SidebarItem
            icon={<SunIcon />}
            label="Spaces"
            active={activeItem === "Spaces"}
            onClick={() => setActiveItem("Spaces")}
            onHover={setHoveredItem}
          />
        </div>

        {/* Avatar Button with Dropdown */}
        <div className="relative mt-auto flex flex-col items-center px-4">
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-700 rounded-full cursor-pointer transition-colors duration-200"
          >
            <span className="text-white font-bold">A</span>
          </div>

          {profileOpen && (
            <div className="absolute left-5 bottom-12 mb-2 w-48 bg-[#2b2d2d] text-white rounded-lg shadow-lg z-50">
              <ul className="py-2 text-sm">
                <li className="px-4 py-2 hover:bg-[#3a3d3d] cursor-pointer flex items-center gap-2">< Account /> My Account</li>
                <li className="px-4 py-2 hover:bg-[#3a3d3d] cursor-pointer flex items-center gap-2"><SettingsIcon /> Settings</li>
                <li className="px-4 py-2 hover:bg-[#3a3d3d] cursor-pointer flex items-center gap-2">Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Second Sidebar - Tooltip/Label Info */}
      <div
        className={`fixed top-0 left-[72px] z-30 h-full w-[250px] bg-[#2b2d2d] p-4 transform transition-all duration-300 ease-in-out 
          ${hoveredItem ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"}`}
      >
        <div className="text-white font-medium">
          {hoveredItem && subSidebarContent[hoveredItem]}
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-[72px] group-hover:ml-[240px] transition-all duration-300 flex-1 p-4">
        <h1 className="text-white text-xl font-semibold">{activeItem}</h1>
      </div>
    </section>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  onHover?: (label: string | null) => void;
}

const SidebarItem = ({
  icon,
  label,
  active = false,
  onClick,
  onHover,
}: SidebarItemProps) => {
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onHover?.(label)}
      onMouseLeave={() => onHover?.(null)}
      className={`flex items-center p-2 rounded-md cursor-pointer transition-colors duration-300 ease-in-out 
        ${active ? "bg-[#2D2F2F] text-white" : "hover:bg-[#2D2F2F] text-[#898D8D] hover:text-white"}`}
    >
      <div className="flex items-center justify-center w-10 h-10">{icon}</div>
    </div>
  );
};

export default Sidebar;
