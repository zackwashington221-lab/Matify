import { isRejectedWithValue, type Middleware } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";

const errorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as { data?: { error?: string; message?: string } };
    const message = payload.data?.error || payload.data?.message || "Please try again.";
    Toast.show({ type: "error", text1: "Something went wrong", text2: message });
  }
  return next(action);
};

export default errorLogger;
