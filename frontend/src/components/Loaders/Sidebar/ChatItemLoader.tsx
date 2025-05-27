import Skeleton from "../Skeleton";

const ChatItemLoader = () => {
  return (
    <div className="flex items-center justify-between p-2.5 text-sm rounded-lg mb-1.5 w-full hover:bg-[var(--color-hover-bg)]">
      <Skeleton className="h-5 w-[70%]" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
};

export default ChatItemLoader;
