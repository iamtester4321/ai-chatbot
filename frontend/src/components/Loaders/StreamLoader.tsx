function StreamLoader() {
  return (
    <div className="flex items-center space-x-2 text-gray-400">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
    </div>
  );
}

export default StreamLoader;
