import { createSlice } from '@reduxjs/toolkit';
import Bowser from 'bowser';
import { PAGE_OFFSET } from '../../style/constants';
import { getChatListPageByDB } from '../thunk/chatThunk';
import { getUserByDB } from '../thunk/userThunk';

interface StatusState {
  getUserLoading: boolean;
  firstGotChatList: boolean;
  leftMenuVisible: boolean;
  getMessageListLoading: boolean;
  isMaxPageMessageList: boolean;
}
const agentInfo = Bowser.parse(window.navigator.userAgent);

const initialState: StatusState = {
  getUserLoading: true,
  firstGotChatList: false,
  leftMenuVisible: agentInfo.platform.type === 'desktop',
  getMessageListLoading: false,
  isMaxPageMessageList: false,
};

export const statusSlice = createSlice({
  name: 'statusSlice',
  initialState,
  reducers: {
    changeLeftMenuVisible: (state, { payload }: { payload: boolean }) => {
      state.leftMenuVisible = payload;
    },
    resetAllStatusState: () => {
      return initialState;
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
        if (payload.length < PAGE_OFFSET) {
          state.isMaxPageMessageList = true;
        }
        state.getMessageListLoading = false;
      });
  },
});

// Action creators are generated for each case reducer function
export const statusActions = statusSlice.actions;

export default statusSlice.reducer;
