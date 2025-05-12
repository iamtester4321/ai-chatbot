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
        className="w-full p-2.5 bg-[#20b8cd] text-white cursor-pointer rounded-lg transition-all duration-200 flex items-center justify-center mt-2 hover:bg-[#1ca3b5]"
      >
        Login
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full mt-2 p-2 flex items-center gap-2 bg-[#202222] rounded-full hover:bg-[#2c2c2c] transition-all duration-200"
    >
      <div className="w-8 h-8 rounded-full bg-[#20b8cd] flex items-center justify-center text-white font-medium">
        {user.email.charAt(0).toUpperCase()}
      </div>
      <span className="text-[#e8e8e6] text-sm truncate">{user.email}</span>
    </button>
  );
};
