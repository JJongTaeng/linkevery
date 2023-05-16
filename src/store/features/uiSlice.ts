import { createSlice } from '@reduxjs/toolkit';
import { getUserByDB } from '../thunk/userThunk';

interface UiState {
  getUserLoading: boolean;
  firstGetChatList: boolean;
}

const initialState: UiState = {
  getUserLoading: false,
  firstGetChatList: false,
};

export const uiSlice = createSlice({
  name: 'loadingSlice',
  initialState,
  reducers: {},
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
export const chatActions = uiSlice.actions;

export default uiSlice.reducer;
