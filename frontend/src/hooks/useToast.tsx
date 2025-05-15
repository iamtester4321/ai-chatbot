import { toast } from 'sonner';
import { CheckCircle, TriangleAlert } from 'lucide-react';

const useToast = () => {
  const showToast = {
    success: (message: string) => {
      toast.success(message, {
        duration: 2000,
        position: 'top-center',
        icon: (
          <CheckCircle
            size={20}
            className="text-[color:var(--color-success)]"
          />
        ),
        className: 'custom-toast success-toast',
      });
    },
    error: (message: string) => {
      toast.error(message, {
        duration: 2000,
        position: 'top-center',
        icon: (
          <TriangleAlert
            size={20}
            className="text-[color:var(--color-error)]"
          />
        ),
        className: 'custom-toast error-toast',
      });
    },
  };

  return showToast;
};

export default useToast;
