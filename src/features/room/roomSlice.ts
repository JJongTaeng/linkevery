import { createSlice } from '@reduxjs/toolkit';

interface RoomState {
  roomName: string;
  username: string;
}

const initialState: RoomState = {
  roomName: '',
  username: '',
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomName: (state, { payload }) => {
      state.roomName = payload.roomName;
    },
    setUsername: (state, { payload }) => {
      state.username = payload.username;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRoomName, setUsername } = roomSlice.actions;

export default roomSlice.reducer;
