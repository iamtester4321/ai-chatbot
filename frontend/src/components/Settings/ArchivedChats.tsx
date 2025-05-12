const ArchivedChats = () => {
  return (
    <div className="space-y-4">
      <div className="bg-[#202222] rounded-lg p-4">
        <h3 className="text-white font-medium mb-2">Previous Chat #1</h3>
        <p className="text-[#e8e8e6b3] text-sm mb-3">Last active: 2 days ago</p>
        <button className="text-[#20b8cd] text-sm hover:underline">
          Restore Chat
        </button>
      </div>
      <div className="bg-[#202222] rounded-lg p-4">
        <h3 className="text-white font-medium mb-2">Previous Chat #2</h3>
        <p className="text-[#e8e8e6b3] text-sm mb-3">Last active: 5 days ago</p>
        <button className="text-[#20b8cd] text-sm hover:underline">
          Restore Chat
        </button>
      </div>
    </div>
  );
};

export default ArchivedChats;