import { createSlice } from '@reduxjs/toolkit';
import { StorageService } from '../../service/storage/StorageService';
import { addUser, getUser } from '../thunk/userThunk';

interface UserState {
  key: string;
  username: string;
  voiceStatus: boolean;
  screenShareStatus: boolean;
  leftSideView: boolean;
  isScrollButtonView: boolean;
}

const storage = StorageService.getInstance();

const initialState: UserState = {
  key: storage.getItem('userKey'),
  username: storage.getItem('username'),
  voiceStatus: false,
  screenShareStatus: false,
  leftSideView: false,
  isScrollButtonView: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state, { payload }) => {
      state.username = payload.username;
    },
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
  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, { payload }) => {
        console.log(payload);
        state.username = payload?.username || '';
        state.key = payload?.key || '';
      })
      .addCase(addUser.fulfilled, (state, { payload }) => {});
  },
});

// Action creators are generated for each case reducer function
export const userActions = userSlice.actions;

export default userSlice.reducer;
