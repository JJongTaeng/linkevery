import { createSlice } from '@reduxjs/toolkit';
import { StorageService } from '../../service/storage/StorageService';

interface RoomState {
  roomName: string;
  username: string;
}

const storage = StorageService.getInstance();

const initialState: RoomState = {
  roomName: storage.getItem('roomName'),
  username: storage.getItem('username'),
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
