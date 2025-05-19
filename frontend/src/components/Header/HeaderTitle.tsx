import { Sidebar } from "lucide-react";

interface HeaderTitleProps {
  toggleSidebar: () => void;
}

export default function HeaderTitle({ toggleSidebar }: HeaderTitleProps) {
  return (
    <div className="flex items-center">
      <button
        className="p-2 rounded-full transition duration-200"
        style={{ backgroundColor: "transparent" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-hover-bg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
        onClick={toggleSidebar}
        title="Toggle Sidebar"
      >
        <Sidebar size={20} />
      </button>
      <h1 className="text-xl font-semibold truncate max-w-[200px] sm:max-w-xs">
        Aivora
      </h1>
    </div>
  );
}
