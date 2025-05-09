import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  role: string;
  content: string;
  createdAt: string;
}

interface ChatState {
  messages: Message[];
  currentResponse: string;
  isLoading: boolean;
  chatName: string;
}

const initialState: ChatState = {
  messages: [],
  currentResponse: '',
  isLoading: false,
  chatName: '',
};

const chatSlice = createSlice({
  name: 'chat',
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
  },
});

export const {
  setMessages,
  addMessage,
  setCurrentResponse,
  setIsLoading,
  setChatName,
} = chatSlice.actions;

export default chatSlice.reducer;