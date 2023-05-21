import { createSlice } from '@reduxjs/toolkit';
import { Message } from '../../service/db/LinkeveryDB';
import { getChatListPageByDB } from '../thunk/chatThunk';

interface ChatState {
  messageList: Omit<Message, 'id' | 'roomName'>[];
}

const initialState: ChatState = {
  messageList: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addChat: (
      state,
      {
        payload: { messageType, messageKey, message, userKey, date, username },
      },
    ) => {
      state.messageList.push({
        messageType,
        messageKey,
        message,
        userKey,
        date,
        username,
      });
    },
    resetChatList: (state) => {
      state.messageList = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getChatListPageByDB.fulfilled, (state, { payload }) => {
      state.messageList.unshift(...payload);
    });
  },
});

// Action creators are generated for each case reducer function
export const chatActions = chatSlice.actions;

export default chatSlice.reducer;
