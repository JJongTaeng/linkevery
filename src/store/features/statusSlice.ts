import { createSlice } from '@reduxjs/toolkit';
import Bowser from 'bowser';

interface StatusState {
  leftMenuVisible: boolean;
  usernameModalVisible: boolean;
}
const agentInfo = Bowser.parse(window.navigator.userAgent);

const initialState: StatusState = {
  leftMenuVisible: agentInfo.platform.type === 'desktop',
  usernameModalVisible: false,
};

export const statusSlice = createSlice({
  name: 'statusSlice',
  initialState,
  reducers: {
    changeLeftMenuVisible: (state, { payload }: { payload: boolean }) => {
      state.leftMenuVisible = payload;
    },
    setUsernameModalVisible: (state, { payload }) => {
      state.usernameModalVisible = payload;
    },
    resetAllStatusState: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const statusActions = statusSlice.actions;

export default statusSlice.reducer;
