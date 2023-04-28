import { createSlice } from '@reduxjs/toolkit';

export enum UserStatus {
  NONE = 'NONE',
  CHAT = 'CHAT',
  VOICE = 'VOICE',
}

interface UserInfoState {
  status: UserStatus;
}

const initialState: UserInfoState = {
  status: UserStatus.NONE,
};

export const userInfoSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    changeStatus: (state, { payload }: { payload: UserStatus }) => {
      state.status = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const userInfoActions = userInfoSlice.actions;

export default userInfoSlice.reducer;
