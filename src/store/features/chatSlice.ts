import { createSlice } from '@reduxjs/toolkit';
import { Message } from 'service/db/LinkeveryDB';
import { CHAT_ITEM_HEIGHT } from 'style/constants';
import { getChatListPageByDB } from 'store/thunk/chatThunk';

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

      const chatList = document.getElementById('chat-list');
      payload.length &&
        chatList?.scrollTo(0, CHAT_ITEM_HEIGHT * payload.length);
    });
  },
});

// Action creators are generated for each case reducer function
export const chatActions = chatSlice.actions;

export default chatSlice.reducer;
