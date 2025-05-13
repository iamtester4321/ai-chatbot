import { Link } from "react-router-dom";

interface UserDetailProps {
  user: {
    id: string;
    email: string;
  } | null;
  onClick: () => void;
}

export const UserDetail = ({ user, onClick }: UserDetailProps) => {
  if (!user) {
    return (
      <Link
        to="/login"
        className="w-full p-2.5 cursor-pointer rounded-lg transition-all duration-200 flex items-center justify-center mt-2"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-button-text)",
        }}
      >
        Login
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full mt-2 p-2 flex items-center gap-2 rounded-full transition-all duration-200"
      style={{
        backgroundColor: "var(--color-muted)",
        color: "var(--color-text)",
      }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center font-medium"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-button-text)",
        }}
      >
        {user.email.charAt(0).toUpperCase()}
      </div>
      <span className="text-sm truncate">{user.email}</span>
    </button>
  );
};
