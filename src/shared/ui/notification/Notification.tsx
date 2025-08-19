import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Notification = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={2500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover={false}
      limit={2}
    />
  );
};
