const ChatSkeleton = () => {
  return (
    <div className="w-full h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col">
      <div className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 space-y-6">
          {/* Message Bubbles */}
          <div className="space-y-2">
            <div className="space-y-2">
              {/* User Bubble */}
              <div className="flex justify-end">
                <div className="w-1/4 sm:w-1/4 h-6 rounded-2xl animate-pulse bg-[var(--color-muted)] px-2 py-2" />
              </div>
              {/* AI Bubble */}
              <div className="flex justify-start">
                <div className="w-1/2 sm:w-1/2 h-6 rounded-2xl animate-pulse bg-[var(--color-muted)] px-2 py-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSkeleton;
