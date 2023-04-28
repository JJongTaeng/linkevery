import { createSlice } from '@reduxjs/toolkit';
import { AppServiceImpl } from '../../service/app/AppServiceImpl';
import { StorageService } from '../../service/storage/StorageService';
import { ChatType } from '../../types';

interface ChatState {
  messageList: ChatType[];
}

const storage = StorageService.getInstance();
const initialState: ChatState = {
  messageList: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    sendChat: (state, { payload: { message, clientId, date, username } }) => {
      const { dispatch } = AppServiceImpl.getInstance();
      dispatch.sendChatMessage({ message, date, username });
      state.messageList.push({ message, clientId, date, username });
    },
    receivedChat: (
      state,
      { payload: { message, clientId, date, username } },
    ) => {
      state.messageList.push({ message, clientId, date, username });
    },
  },
});

// Action creators are generated for each case reducer function
export const chatActions = chatSlice.actions;

export default chatSlice.reducer;
