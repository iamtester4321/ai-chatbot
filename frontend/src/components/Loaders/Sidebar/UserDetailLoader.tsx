import Skeleton from "../Skeleton";

const UserDetailLoader = () => {
  return (
    <div
      className="w-full mt-2 p-2 flex items-center gap-2 rounded-full transition-all duration-200"
      style={{
        backgroundColor: "var(--color-muted)",
        color: "var(--color-text)",
      }}
    >
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <Skeleton className="h-5 w-[70%]" />
    </div>
  );
};

export default UserDetailLoader;