import { createSlice } from '@reduxjs/toolkit';
import Bowser from 'bowser';
import { PAGE_OFFSET } from '../../style/constants';
import { getChatListPageByDB } from '../thunk/chatThunk';

interface StatusState {
  leftMenuVisible: boolean;
  isMaxPageMessageList: boolean;
  isLeftSideView: boolean;
  isScrollButtonView: boolean;
}
const agentInfo = Bowser.parse(window.navigator.userAgent);

const initialState: StatusState = {
  leftMenuVisible: agentInfo.platform.type === 'desktop',
  isMaxPageMessageList: false,
  isLeftSideView: false,
  isScrollButtonView: false,
};

export const statusSlice = createSlice({
  name: 'statusSlice',
  initialState,
  reducers: {
    changeLeftMenuVisible: (state, { payload }: { payload: boolean }) => {
      state.leftMenuVisible = payload;
    },
    changeLeftSideView: (state, { payload }) => {
      state.isLeftSideView = payload;
    },
    changeIsScrollBottomView: (state, { payload }) => {
      state.isScrollButtonView = payload;
    },
    resetAllStatusState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getChatListPageByDB.fulfilled, (state, { payload }) => {
      if (payload.length < PAGE_OFFSET) {
        state.isMaxPageMessageList = true;
      }
    });
  },
});

// Action creators are generated for each case reducer function
export const statusActions = statusSlice.actions;

export default statusSlice.reducer;
