import { createSlice } from '@reduxjs/toolkit';
import { query } from '../../service/db/Query';
import { storage } from '../../service/storage/StorageService';
import {
  addRoomByDB,
  deleteRoomByDB,
  getRoomByDB,
  getRoomListByDB,
} from '../thunk/roomThunk';
import { Room } from './../../service/db/LinkeveryDB';

interface RoomState {
  current: Omit<Room, 'id'>;
  roomList: string[];
  size: number;
}

const initialState: RoomState = {
  current: {
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
      state.current.roomName = payload;
    },
    updateMember: (
      state,
      {
        payload,
      }: { payload: { userKey: string; username: string; clientId: string } },
    ) => {
      const { clientId, userKey, username } = payload;
      state.current.member[userKey] = {
        ...state.current.member[userKey],
        clientId,
        username,
      };
    },
    setMemberVoiceStatus: (
      state,
      { payload }: { payload: { voiceStatus: boolean; userKey: string } },
    ) => {
      const { userKey, voiceStatus } = payload;
      state.current.member[userKey] = {
        ...state.current.member[userKey],
        voiceStatus,
      };
    },
    setMemberScreenShareStatus: (
      state,
      { payload }: { payload: { screenShareStatus: boolean; userKey: string } },
    ) => {
      const { userKey, screenShareStatus } = payload;
      state.current.member[userKey] = {
        ...state.current.member[userKey],
        screenShareStatus,
      };
    },
    deleteMember: (state, { payload }) => {
      const { userKey } = payload;
      delete state.current.member[userKey];
    },
    leaveRoom: (state) => {
      storage.setItem('roomName', '');
      state.current.roomName = '';
    },
    setMemberSize: (state, { payload }) => {
      state.size = payload;
    },
    setAllMemberVoiceOff: (state) => {
      for (const key in state.current.member) {
        state.current.member[key].voiceStatus = false;
      }
    },
    setAllMemberScreenShareOff: (state) => {
      for (const key in state.current.member) {
        state.current.member[key].screenShareStatus = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoomByDB.fulfilled, (state, { payload }) => {
        if (!Object.keys(payload.member).length) {
          query.addRoom(payload);
        }
        state.current = payload;
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
