import { toast, ToastOptions, ToastContent } from "react-toastify";

const useToast = () => {
  const showToast = {
    success: (message: string | ToastContent, options?: ToastOptions) => {
      toast(message, {
        ...defaultOptions,
        className: "custom-toast success-toast",
        ...options,
      });
    },
    error: (message: string | ToastContent, options?: ToastOptions) => {
      toast(message, {
        ...defaultOptions,
        className: "custom-toast error-toast",
        ...options,
      });
    },
  };

  const defaultOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  return showToast;
};

export default useToast;
