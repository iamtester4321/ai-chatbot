import ChatItemLoader from "./ChatItemLoader";
import Skeleton from "../Skeleton";

interface ChatSectionLoaderProps {
  title?: string;
  count?: number;
}

const ChatSectionLoader = ({ title, count = 3 }: ChatSectionLoaderProps) => {
  return (
    <div className="mb-4 w-full">
      {title && (
        <div className="flex items-center gap-2 px-2.5 py-2 text-sm w-full">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-[30%]" />
        </div>
      )}
      <div className="space-y-1">
        {Array.from({ length: count }).map((_, index) => (
          <ChatItemLoader key={index} />
        ))}
      </div>
    </div>
  );
};

export default ChatSectionLoader;