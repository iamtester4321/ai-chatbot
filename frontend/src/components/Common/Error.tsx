import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ErrorProps {
  message: string;
}

const Error = ({ message }: ErrorProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 px-4">
      <div className="flex flex-col items-center gap-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <div className="text-xl text-red-400 text-center max-w-md">{message}</div>
      </div>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
      >
        Back to Home
      </button>
    </div>
  );
};

export default Error;