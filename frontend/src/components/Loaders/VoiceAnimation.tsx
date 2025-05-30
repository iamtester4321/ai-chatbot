import { useEffect, useState } from "react";

const VoiceAnimation = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsActive((prev) => !prev);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>
        {`
        @keyframes blob1 {
          0%, 100% { transform: rotate(-20deg) scale(1) translateX(0); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { transform: rotate(-30deg) scale(1.1) translateX(10px); border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50% { transform: rotate(-10deg) scale(0.9) translateX(-5px); border-radius: 70% 30% 40% 60% / 40% 50% 60% 50%; }
          75% { transform: rotate(-25deg) scale(1.05) translateX(8px); border-radius: 50% 50% 60% 40% / 60% 40% 50% 50%; }
        }

        @keyframes blob2 {
          0%, 100% { transform: rotate(30deg) scale(1) translateY(0); border-radius: 40% 60% 60% 40% / 60% 30% 70% 40%; }
          25% { transform: rotate(40deg) scale(1.2) translateY(-8px); border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%; }
          50% { transform: rotate(20deg) scale(0.8) translateY(12px); border-radius: 30% 70% 40% 60% / 70% 40% 60% 30%; }
          75% { transform: rotate(35deg) scale(1.1) translateY(-4px); border-radius: 45% 55% 50% 50% / 55% 45% 65% 35%; }
        }

        @keyframes blob3 {
          0%, 100% { transform: rotate(60deg) scale(1) translate(0, 0); border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; }
          33% { transform: rotate(90deg) scale(1.15) translate(8px, -8px); border-radius: 60% 40% 40% 60% / 40% 60% 60% 40%; }
          66% { transform: rotate(45deg) scale(0.85) translate(-6px, 6px); border-radius: 40% 60% 60% 40% / 50% 50% 50% 50%; }
        }

        @keyframes blob4 {
          0%, 100% { transform: rotate(15deg) scale(1) translate(0, 0); border-radius: 50% 40% 50% 60% / 60% 40% 50% 50%; }
          25% { transform: rotate(25deg) scale(1.1) translate(6px, -4px); border-radius: 60% 50% 40% 60% / 40% 60% 50% 60%; }
          50% { transform: rotate(10deg) scale(0.9) translate(-6px, 6px); border-radius: 50% 60% 40% 50% / 60% 40% 60% 40%; }
          75% { transform: rotate(20deg) scale(1.05) translate(4px, -2px); border-radius: 55% 45% 50% 55% / 50% 60% 40% 50%; }
        }

        @keyframes blob5 {
          0%, 100% { transform: rotate(-45deg) scale(1) translateY(0); border-radius: 45% 55% 60% 40% / 50% 50% 60% 40%; }
          33% { transform: rotate(-60deg) scale(1.1) translateY(-10px); border-radius: 50% 60% 40% 60% / 60% 50% 40% 60%; }
          66% { transform: rotate(-30deg) scale(0.95) translateY(10px); border-radius: 40% 50% 60% 50% / 60% 40% 50% 50%; }
        }

        @keyframes blob6 {
          0%, 100% { transform: rotate(10deg) scale(1) translate(0, 0); border-radius: 50% 50% 60% 40% / 60% 50% 50% 50%; }
          50% { transform: rotate(30deg) scale(1.2) translate(10px, 5px); border-radius: 40% 60% 40% 60% / 50% 60% 40% 60%; }
        }

        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.7), 0 0 60px rgba(59, 130, 246, 0.5), 0 0 90px rgba(59, 130, 246, 0.3); }
        }

        .blob1 { animation: blob1 8s ease-in-out infinite; }
        .blob2 { animation: blob2 8s ease-in-out infinite 2.67s; }
        .blob3 { animation: blob3 8s ease-in-out infinite 5.33s; }
        .blob4 { animation: blob4 9s ease-in-out infinite 1.5s; }
        .blob5 { animation: blob5 10s ease-in-out infinite 3s; }
        .blob6 { animation: blob6 7s ease-in-out infinite 4.5s; }

        .orb-glow {
          animation: glow-pulse 4s ease-in-out infinite;
        }

        .blur-border {
          backdrop-filter: blur(4px);
        }
        `}
      </style>

      <div className="relative w-35 h-35 mx-auto">
        {/* Blurred outer border layer */}
        {/* <div className="absolute inset-0 rounded-full blur-sm bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-cyan-500/30 animate-pulse"></div> */}
        
        {/* Main orb with blur border */}
        <div className="absolute inset-1 rounded-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl orb-glow blur-border">
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div
              className={`absolute inset-4 transition-all duration-1000 ease-in-out ${
                isActive ? "scale-105 rotate-3" : "scale-100 rotate-0"
              }`}
            >
              {/* Original 3 blobs */}
              <div className="absolute top-8 left-8 w-16 h-20 bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-full opacity-80 blob1"></div>
              <div className="absolute bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-pink-400 via-purple-500 to-purple-600 rounded-full opacity-75 blob2"></div>
              <div className="absolute top-10 right-12 w-14 h-16 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-full opacity-70 blob3"></div>

              {/* New blobs */}
              <div className="absolute top-6 right-6 w-12 h-14 bg-gradient-to-br from-fuchsia-400 via-rose-500 to-red-600 rounded-full opacity-65 blob4"></div>
              <div className="absolute bottom-10 left-10 w-10 h-12 bg-gradient-to-br from-indigo-400 via-sky-500 to-teal-600 rounded-full opacity-60 blob5"></div>
              <div className="absolute top-1/3 left-1/2 w-14 h-14 bg-gradient-to-br from-lime-400 via-green-500 to-emerald-600 rounded-full opacity-55 blob6"></div>

              {/* Central glow */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full opacity-30 blur-sm animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VoiceAnimation;