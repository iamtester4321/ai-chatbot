import { Mic, MicOff, X } from "lucide-react";
import { useState } from "react";
import VoiceAnimation from "../Loaders/VoiceAnimation";

type VoiceModalProps = {
  onClose: () => void;
};

const VoiceModal = ({ onClose }: VoiceModalProps) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMic = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[150] flex flex-col justify-between items-center px-6 py-10">
      <div className="flex-grow w-full flex justify-center items-center">
        <VoiceAnimation />
      </div>
      <div className="flex gap-4">
        <button
          className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition duration-200 ${
            isMuted
              ? "bg-neutral-800 hover:bg-neutral-700"
              : "bg-neutral-800 hover:bg-neutral-700"
          }`}
          onClick={toggleMic}
        >
          {isMuted ? (
            <MicOff className="text-red-500 w-6 h-6" />
          ) : (
            <Mic className="text-green-400 w-6 h-6" />
          )}
        </button>

        <button
          className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition cursor-pointer"
          onClick={onClose}
        >
          <X className="text-white w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default VoiceModal;
