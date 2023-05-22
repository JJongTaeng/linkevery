import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../../service/storage/StorageService';
import { addUserByDB, getUserByDB } from '../thunk/userThunk';

interface UserState {
  key: string;
  username: string;
  voiceStatus: boolean;
  screenShareStatus: boolean;
}

const initialState: UserState = {
  key: storage.getItem('userKey'),
  username: storage.getItem('username'),
  voiceStatus: false,
  screenShareStatus: false,
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserByDB.fulfilled, (state, { payload }) => {
        state.username = payload?.username || '';
        state.key = payload?.key || '';
      })
      .addCase(addUserByDB.fulfilled, (state, { payload }) => {
        state.username = payload?.username || '';
        state.key = payload?.key || '';
      });
  },
});

// Action creators are generated for each case reducer function
export const userActions = userSlice.actions;

export default userSlice.reducer;
