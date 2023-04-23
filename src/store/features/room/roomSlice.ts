import { createSlice } from '@reduxjs/toolkit';
import { StorageService } from '../../../service/storage/StorageService';

interface RoomState {
  roomName: string;
  username: string;
  member: {
    [key: string]: string;
  };
}

const storage = StorageService.getInstance();

const initialState: RoomState = {
  roomName: storage.getItem('roomName'),
  username: storage.getItem('username'),
  member: {},
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
    setMember: (state, { payload }) => {
      const { clientId, username } = payload;
      state.member[clientId] = username;
    },
    deleteMember: (state, { payload }) => {
      const { clientId } = payload;
      delete state.member[clientId];
    },
    leaveRoom: (state) => {
      storage.setItem('roomName', '');
      state.roomName = '';
    },
  },
});

// Action creators are generated for each case reducer function
export const roomActions = roomSlice.actions;

export default roomSlice.reducer;
