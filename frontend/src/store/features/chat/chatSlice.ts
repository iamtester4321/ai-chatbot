import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatState, Message } from "../../../lib/types";

const initialState: ChatState = {
  messages: [],
  currentResponse: "",
  isLoading: false,
  chatName: "",
  chatList: [],
  isArchived: false,
  isFavorite: false,
  isShare: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setCurrentResponse: (state, action: PayloadAction<string>) => {
      state.currentResponse = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setChatName: (state, action: PayloadAction<string>) => {
      state.chatName = action.payload;
    },
    resetChat: (state) => {
      state.messages = initialState.messages;
      state.currentResponse = initialState.currentResponse;
      state.isLoading = initialState.isLoading;
      state.chatName = initialState.chatName;
    },
    setChatList: (
      state,
      action: PayloadAction<
        Array<{
          id: string;
          name: string;
          isFavorite: boolean;
          isArchived: boolean;
          isShare: boolean;
        }>
      >
    ) => {
      state.chatList = action.payload;
    },
    setIsArchived: (state, action: PayloadAction<boolean>) => {
      state.isArchived = action.payload;
    },
    setIsFavorite: (state, action: PayloadAction<boolean>) => {
      state.isFavorite = action.payload;
    },
    setIsShare: (state, action: PayloadAction<boolean>) => {
      state.isShare = action.payload;
    },
  },
});

export const {
  setMessages,
  addMessage,
  setCurrentResponse,
  setIsLoading,
  setChatName,
  resetChat,
  setChatList,
  setIsArchived,
  setIsFavorite,
  setIsShare,
} = chatSlice.actions;

export default chatSlice.reducer;
