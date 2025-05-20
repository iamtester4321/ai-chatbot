import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./features/chat/chatSlice";
import themeReducer from "./features/theme/themeSlice";
import userReducer from "./features/user/userSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    theme: themeReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
