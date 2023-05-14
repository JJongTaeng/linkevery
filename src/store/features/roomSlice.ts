import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../../service/storage/StorageService';
import {
  addRoomByDB,
  deleteRoomByDB,
  getRoomByDB,
  getRoomListByDB,
} from '../thunk/roomThunk';
import { Room } from './../../service/db/LinkeveryDB';

interface RoomState {
  room: Omit<Room, 'id'>;
  roomList: string[];
  size: number;
}

const initialState: RoomState = {
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
      state.room.roomName = payload;
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
      state.room.roomName = '';
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
        if (!state.roomList.includes(payload.roomName)) {
          state.roomList.push(payload.roomName);
        }
      })
      .addCase(addRoomByDB.fulfilled, (state, { payload }) => {
        if (!state.roomList.includes(payload.roomName)) {
          state.roomList.push(payload.roomName);
        }
      })
      .addCase(getRoomListByDB.fulfilled, (state, { payload }) => {
        state.roomList = payload || [];
      })
      .addCase(
        deleteRoomByDB.fulfilled,
        (state, { payload }: { payload: string }) => {
          const newRoomList = state.roomList.filter(
            (roomName) => !(roomName === payload),
          );
          state.roomList = newRoomList;
        },
      );
  },
});

// Action creators are generated for each case reducer function
export const roomActions = roomSlice.actions;

export default roomSlice.reducer;
