import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  key: string;
  username: string;
  voiceStatus: boolean;
  screenShareStatus: boolean;
  leftSideView: boolean;
  isScrollButtonView: boolean;
}

const initialState: UserState = {
  key: '',
  username: '',
  voiceStatus: false,
  screenShareStatus: false,
  leftSideView: false,
  isScrollButtonView: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeVoiceStatus: (state, { payload }) => {
      state.voiceStatus = payload;
    },
    changeScreenShareStatus: (state, { payload }) => {
      state.screenShareStatus = payload;
    },
    changeLeftSideView: (state, { payload }) => {
      state.leftSideView = payload;
    },
    changeIsScrollBottomView: (state, { payload }) => {
      state.isScrollButtonView = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const userActions = userSlice.actions;

export default userSlice.reducer;
