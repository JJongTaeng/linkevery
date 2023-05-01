import { createSlice } from '@reduxjs/toolkit';

interface voiceState {
  status: boolean;
}

const initialState: voiceState = {
  status: false,
};

export const voiceSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    changeStatus: (state, { payload }: { payload: boolean }) => {
      state.status = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const voiceActions = voiceSlice.actions;

export default voiceSlice.reducer;
