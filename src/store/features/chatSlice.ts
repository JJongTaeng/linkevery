import { createSlice } from '@reduxjs/toolkit';
import { Message } from 'service/db/LinkeveryDB';
import { CHAT_ITEM_HEIGHT, PAGE_OFFSET } from 'style/constants';
import { getChatListPageByDB } from 'store/thunk/chatThunk';

interface ChatState {
  messageList: Omit<Message, 'id' | 'roomName'>[];
  page: number;
  isVisibleScrollButton: boolean;
  isMaxPage: boolean;
}

const initialState: ChatState = {
  messageList: [],
  page: 0,
  isVisibleScrollButton: false,
  isMaxPage: false,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setIsVisibleScrollButton: (state, { payload }) => {
      state.isVisibleScrollButton = payload.isVisibleScrollButton;
    },

    setPage: (state, { payload }) => {
      state.page = payload.page ?? 0;
    },

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
      if (payload.length < PAGE_OFFSET) {
        state.isMaxPage = true;
      }
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
