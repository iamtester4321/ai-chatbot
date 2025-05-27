const ChatSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 space-y-6">
          {/* Chat Title Skeleton */}
          <div className="w-1/2 h-8 bg-gray-300 rounded animate-pulse mb-6" />

          {/* Message Bubbles */}
          <div className="space-y-4">
            <div className="space-y-2">
              {/* User Bubble */}
              <div className="flex justify-end">
                <div className="bg-gray-300 w-2/3 sm:w-1/2 h-6 rounded-2xl animate-pulse px-4 py-2" />
              </div>
              {/* AI Bubble */}
              <div className="flex justify-start">
                <div className="bg-gray-200 w-3/4 sm:w-2/3 h-24 rounded-xl animate-pulse px-4 py-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prompt Input Skeleton */}
      <div className="sticky bottom-0 bg-[var(--color-bg)] px-4 py-4 border-t border-[var(--color-border)] z-10">
        <div className="max-w-3xl mx-auto">
          <div className="h-32 bg-gray-300 rounded-2xl animate-pulse px-4 py-4" />
        </div>
      </div>
    </div>
  );
};

export default ChatSkeleton;
