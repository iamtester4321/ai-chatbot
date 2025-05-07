interface NewsSource {
  name: string;
  initial: string;
}

const NEWS_SOURCES: NewsSource[] = [
  { name: "BBC News", initial: "B" },
  { name: "Reuters", initial: "R" },
  { name: "Yahoo", initial: "Y" }
];

export const NewsSourcesGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {NEWS_SOURCES.map(({ name, initial }, i) => (
        <div key={i} className="bg-[#202222] p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs mr-2">
              {initial}
            </div>
            <span className="text-sm text-gray-300">{name}</span>
          </div>
          <p className="text-sm">Loading search results...</p>
        </div>
      ))}
    </div>
  );
};