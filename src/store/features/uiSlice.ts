import { createSlice } from '@reduxjs/toolkit';
import Bowser from 'bowser';
import { getUserByDB } from '../thunk/userThunk';

interface UiState {
  getUserLoading: boolean;
  firstGetChatList: boolean;
  leftMenuVisible: boolean;
}
const agentInfo = Bowser.parse(window.navigator.userAgent);

const initialState: UiState = {
  getUserLoading: false,
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
      });
  },
});

// Action creators are generated for each case reducer function
export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
