// src/components/Common/Spinner.tsx
const Spinner = () => {
  return (
    <div className="flex justify-center items-center p-4 py-20">
      <div className="animate-spin rounded-full h-30 w-30 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default Spinner;
