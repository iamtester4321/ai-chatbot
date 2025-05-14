import { toast } from 'sonner';
import { CheckCircle, TriangleAlert } from 'lucide-react';

const useToast = () => {
  const showToast = {
    success: (message: string) => {
      toast.success(message, {
        duration: 2000,
        position: 'top-center',
        icon: <CheckCircle size={20} className="text-green-500"/>,
      });
    },
    error: (message: string) => {
      toast.error(message, {
        duration: 2000,
        position: 'top-center',
        icon: <TriangleAlert size={20} className="text-red-500" />,
      });
    },
  };

  return showToast;
};

export default useToast;
