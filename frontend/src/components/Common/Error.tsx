import { AlertCircle } from "lucide-react";
import { ErrorProps } from "../../lib/types";

const Error = ({ message, onNewChat }: ErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8 px-6">
      <div className="flex flex-col items-center gap-6">
        <AlertCircle
          className="w-20 h-20"
          style={{
            color: "var(--color-error)",
            transition: "color 0.2s ease-in-out",
          }}
        />
        <div
          className="text-xl text-center max-w-lg"
          style={{
            color: "var(--color-error)",
            transition: "color 0.2s ease-in-out",
          }}
        >
          {message}
        </div>
      </div>
      <button
        onClick={onNewChat}
        className="px-8 py-3 text-base font-medium rounded-lg transition-colors"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-button-text)",
          transition: "all 0.2s ease-in-out",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--color-primary-hover)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--color-primary)")
        }
      >
        Create a New Chat
      </button>
    </div>
  );
};

export default Error;
