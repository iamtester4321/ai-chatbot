import { toast, ToastOptions } from "react-toastify";

const useToast = () => {
  const showToast = {
    success: (message: string, options?: ToastOptions) => {
      toast.success(message, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        ...options,
      });
    },
    error: (message: string, options?: ToastOptions) => {
      toast.error(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        ...options,
      });
    },
  };

  return showToast;
};

export default useToast;
