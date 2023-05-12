import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../../service/storage/StorageService';
import { addRoomByDB, getRoomByDB, getRoomListByDB } from '../thunk/roomThunk';
import { Room } from './../../service/db/LinkeveryDB';

interface RoomState {
  roomName: string;
  room: Omit<Room, 'id'>;
  roomList: string[];
  size: number;
}

const initialState: RoomState = {
  roomName: storage.getItem('roomName'),
  room: {
    member: {},
    roomName: '',
  },
  roomList: [],
  size: 0,
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomName: (state, { payload }) => {
      state.roomName = payload;
    },
    updateMember: (
      state,
      {
        payload,
      }: { payload: { userKey: string; username: string; clientId: string } },
    ) => {
      const { clientId, userKey, username } = payload;
      state.room.member[userKey] = {
        clientId,
        username,
      };
    },
    setMemberVoiceStatus: (
      state,
      { payload }: { payload: { voiceStatus: boolean; userKey: string } },
    ) => {
      const { userKey, voiceStatus } = payload;
      state.room.member[userKey] = {
        ...state.room.member[userKey],
        voiceStatus,
      };
    },
    setMemberScreenShareStatus: (
      state,
      { payload }: { payload: { screenShareStatus: boolean; userKey: string } },
    ) => {
      const { userKey, screenShareStatus } = payload;
      state.room.member[userKey] = {
        ...state.room.member[userKey],
        screenShareStatus,
      };
    },
    deleteMember: (state, { payload }) => {
      const { userKey } = payload;
      delete state.room.member[userKey];
    },
    leaveRoom: (state) => {
      storage.setItem('roomName', '');
      state.roomName = '';
    },
    setMemberSize: (state, { payload }) => {
      state.size = payload;
    },
    setAllMemberVoiceOff: (state) => {
      for (const key in state.room.member) {
        state.room.member[key].voiceStatus = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoomByDB.fulfilled, (state, { payload }) => {
        state.room = payload;
      })
      .addCase(addRoomByDB.fulfilled, (state, { payload }) => {})
      .addCase(getRoomListByDB.fulfilled, (state, { payload }) => {
        state.roomList = payload || [];
      });
  },
});

// Action creators are generated for each case reducer function
export const roomActions = roomSlice.actions;

export default roomSlice.reducer;
