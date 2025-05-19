import { Archive, Settings, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SettingsModalProps } from "../../lib/types";
import ArchivedChats from "../Settings/ArchivedChats";
import FavoriteChats from "../Settings/FavoriteChats";
import GeneralSettings from "../Settings/GeneralSettings";

const SettingsModal = ({ isOpen, onClose, chatList }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState("general");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "archive", label: "Archive", icon: Archive },
    { id: "favorite", label: "Favorite", icon: Star },
  ];

  const favoriteChats = chatList.filter((chat) => chat.isFavorite);
  const archivedChats = chatList.filter((chat) => chat.isArchived);

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-[1001]" />
      <div className="fixed inset-0 z-[1002] flex items-center justify-center">
        <div
          ref={modalRef}
          className="rounded-lg w-full max-w-4xl mx-4 h-[80vh] flex flex-col md:flex-row overflow-hidden"
          style={{
            backgroundColor: "var(--color-bg)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          {/* Tabs section */}
          <div
            className="md:w-64 md:border-r border-b md:border-b-0 p-4 flex flex-col"
            style={{ borderColor: "var(--color-border)" }}
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between md:hidden mb-2">
              <h2
                style={{ color: "var(--color-text)" }}
                className="text-xl font-semibold"
              >
                Settings
              </h2>
              <button
                onClick={onClose}
                style={{ color: "var(--color-disabled-text)" }}
                className="p-2 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Tab buttons */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-[var(--color-muted)] border border-[var(--color-primary)] text-[var(--color-primary)]"
                      : "text-[var(--color-disabled-text)] hover:bg-[var(--color-hover-bg)]"
                  }`}
                >
                  <tab.icon
                    size={18}
                    className={`transition duration-200 ${
                      activeTab === tab.id
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--color-disabled-text)] group-hover:text-[var(--color-primary)]"
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Desktop header */}
            <div className="hidden md:flex items-center justify-between mb-6">
              <h2
                style={{ color: "var(--color-text)" }}
                className="text-xl font-semibold"
              >
                Settings
              </h2>
              <button
                onClick={onClose}
                className="text-[var(--color-disabled-text)] hover:text-[var(--color-text)] transition duration-200"
              >
                ✕
              </button>
            </div>

            {/* Tab content */}
            <div style={{ color: "var(--color-text)" }}>
              {activeTab === "general" && <GeneralSettings />}
              {activeTab === "archive" && (
                <ArchivedChats
                  onClose={onClose}
                  archivedChats={archivedChats}
                />
              )}
              {activeTab === "favorite" && (
                <FavoriteChats
                  onClose={onClose}
                  favoriteChats={favoriteChats}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;
