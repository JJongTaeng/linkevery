import { createSlice } from '@reduxjs/toolkit';
import Bowser from 'bowser';
import { getChatListByDB } from '../thunk/chatThunk';
import { getUserByDB } from '../thunk/userThunk';

interface UiState {
  getUserLoading: boolean;
  firstGetChatList: boolean;
  leftMenuVisible: boolean;
}
const agentInfo = Bowser.parse(window.navigator.userAgent);

const initialState: UiState = {
  getUserLoading: true,
  firstGetChatList: false,
  leftMenuVisible: agentInfo.platform.type === 'desktop',
};

export const uiSlice = createSlice({
  name: 'loadingSlice',
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
      .addCase(getChatListByDB.fulfilled, (state, { payload }) => {
        state.firstGetChatList = true;
      });
  },
});

// Action creators are generated for each case reducer function
export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
