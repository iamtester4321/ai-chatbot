import { AlertTriangle, CheckCircle, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

const useToast = () => {
  const showToast = {
    success: (message: string) => {
      toast.success(message, {
        duration: 2000,
        position: "top-center",
        icon: (
          <CheckCircle
            size={20}
            className="text-[color:var(--color-success)]"
          />
        ),
        className: "custom-toast success-toast",
      });
    },
    error: (message: string) => {
      toast.error(message, {
        duration: 2000,
        position: "top-center",
        icon: (
          <TriangleAlert
            size={20}
            className="text-[color:var(--color-error)]"
          />
        ),
        className: "custom-toast error-toast",
      });
    },
    warning: (message: string) => {
      toast(message, {
        duration: 6000,
        position: "top-center",
        icon: (
          <AlertTriangle
            size={20}
            className="text-[color:var(--color-warning)]"
          />
        ),
        className: "custom-toast warning-toast",
      });
    },
  };

  return showToast;
};

export default useToast;
