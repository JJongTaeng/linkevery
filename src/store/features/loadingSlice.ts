import { createSlice } from '@reduxjs/toolkit';
import { getUser } from '../thunk/userThunk';

interface LoadingState {
  getUser: boolean;
}

const initialState: LoadingState = {
  getUser: false,
};

export const loadingSlice = createSlice({
  name: 'loadingSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state, { payload }) => {
        state.getUser = true;
      })
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.getUser = false;
      });
  },
});

// Action creators are generated for each case reducer function
export const chatActions = loadingSlice.actions;

export default loadingSlice.reducer;
