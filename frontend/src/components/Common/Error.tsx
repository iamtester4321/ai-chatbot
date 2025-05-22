import { AlertCircle } from "lucide-react";
import { ErrorProps } from "../../lib/types";
import { useAppSelector } from "../../store/hooks";

const Error = ({ message, onNewChat }: ErrorProps) => {
  const user = useAppSelector((state) => state.user.user);
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
          {/* {message} */}
          {!user ? "Login to save your chats" : message}
        </div>
      </div>
      {!user ? (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-8 py-3 text-base font-medium rounded-lg transition-colors w-full"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-button-text)",
              transition: "all 0.2s ease-in-out",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-primary-hover)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-primary)")
            }
          >
            Login
          </button>

          <button
            onClick={onNewChat}
            className="px-8 py-3 text-base font-medium rounded-lg transition-colors w-full border"
            style={{
              backgroundColor: "var(--color-surface)",
              color: "var(--color-text)",
              borderColor: "var(--color-border)",
              transition: "all 0.2s ease-in-out",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-hover-bg)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-surface)")
            }
          >
            Continue without logging in
          </button>
        </div>
      ) : (
        <button
          onClick={onNewChat}
          className="px-8 py-3 text-base font-medium rounded-lg transition-colors"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-button-text)",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--color-primary-hover)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-primary)")
          }
        >
          Create a New Chat
        </button>
      )}
    </div>
  );
};

export default Error;
