import { createSlice } from '@reduxjs/toolkit';
import Bowser from 'bowser';
import { getChatListPageByDB } from '../thunk/chatThunk';
import { getUserByDB } from '../thunk/userThunk';

interface StatusState {
  getUserLoading: boolean;
  firstGotChatList: boolean;
  leftMenuVisible: boolean;
  getMessageListLoading: boolean;
}
const agentInfo = Bowser.parse(window.navigator.userAgent);

const initialState: StatusState = {
  getUserLoading: true,
  firstGotChatList: false,
  leftMenuVisible: agentInfo.platform.type === 'desktop',
  getMessageListLoading: false,
};

export const statusSlice = createSlice({
  name: 'statusSlice',
  initialState,
  reducers: {
    changeLeftMenuVisible: (state, { payload }: { payload: boolean }) => {
      state.leftMenuVisible = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserByDB.pending, (state, { payload }) => {
        state.getUserLoading = true;
      })
      .addCase(getUserByDB.fulfilled, (state, { payload }) => {
        state.getUserLoading = false;
      })
      .addCase(getChatListPageByDB.pending, (state, { payload }) => {
        state.getMessageListLoading = true;
      })
      .addCase(getChatListPageByDB.fulfilled, (state, { payload }) => {
        state.getMessageListLoading = false;
      });
  },
});

// Action creators are generated for each case reducer function
export const statusActions = statusSlice.actions;

export default statusSlice.reducer;
