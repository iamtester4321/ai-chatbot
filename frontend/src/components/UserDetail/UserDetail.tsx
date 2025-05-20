import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserProfile } from "../../actions/user.actions";
import { UserDetailProps } from "../../lib/types";
import { setUser } from "../../store/features/user/userSlice";
import { useAppSelector } from "../../store/hooks";

export const UserDetail = ({ onClick }: UserDetailProps) => {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const { success, data } = await fetchUserProfile();
        if (success && data) {
          dispatch(setUser(data));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    getUserProfile();
  }, [dispatch]);

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
