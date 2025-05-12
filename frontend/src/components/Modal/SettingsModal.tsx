import { Archive, Settings, Star } from "lucide-react";
import { useState } from "react";
import ArchivedChats from "../Settings/ArchivedChats";
import FavoriteChats from "../Settings/FavoriteChats";
import GeneralSettings from "../Settings/GeneralSettings";
import { ChatState } from "../../lib/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatList: ChatState["chatList"];
}

const SettingsModal = ({ isOpen, onClose, chatList }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState("general");

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
        <div className="bg-[#121212] border border-[#e8e8e61a] rounded-lg w-full max-w-4xl mx-4 h-[80vh] flex flex-col md:flex-row">
          {/* Tabs section with close button for mobile */}
          <div className="md:w-64 md:border-r border-b md:border-b-0 border-[#e8e8e61a] p-4 flex flex-col">
            <div className="flex items-center justify-between md:hidden mb-2">
              <h2 className="text-xl font-semibold text-white">Settings</h2>
              <button
                onClick={onClose}
                className="text-[#e8e8e6b3] hover:text-white transition-colors p-2"
              >
                ✕
              </button>
            </div>
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg text-left whitespace-nowrap transition-colors md:w-full ${
                    activeTab === tab.id
                      ? "bg-[#202222] text-[#20b8cd]"
                      : "text-[#e8e8e6b3] hover:bg-[#202222]"
                  }`}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right content area */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="hidden md:flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Settings</h2>
              <button
                onClick={onClose}
                className="text-[#e8e8e6b3] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content based on active tab */}
            <div className="text-[#e8e8e6b3]">
              {activeTab === "general" && <GeneralSettings />}
              {activeTab === "archive" && <ArchivedChats archivedChats={archivedChats} />}
              {activeTab === "favorite" && <FavoriteChats favoriteChats={favoriteChats} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;
