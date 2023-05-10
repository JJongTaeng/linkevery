import { createSlice } from '@reduxjs/toolkit';
import { StorageService } from '../../service/storage/StorageService';
import { Room } from './../../service/db/LinkeveryDB';

interface RoomState {
  roomName: string;
  member: {
    [key: string]: {
      username: string;
      voiceStatus: boolean;
      screenShareStatus: boolean;
    };
  };
  room: Room;
  size: number;
}

const storage = StorageService.getInstance();

const initialState: RoomState = {
  roomName: storage.getItem('roomName'),
  member: {},
  room: {},
  size: 0,
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomName: (state, { payload }) => {
      state.roomName = payload;
    },
    setMemberUsername: (
      state,
      { payload }: { payload: { username: string; clientId: string } },
    ) => {
      const { clientId, username } = payload;
      state.member[clientId] = {
        ...state.member[clientId],
        username,
      };
    },
    setMemberVoiceStatus: (
      state,
      { payload }: { payload: { voiceStatus: boolean; clientId: string } },
    ) => {
      const { clientId, voiceStatus } = payload;
      state.member[clientId] = {
        ...state.member[clientId],
        voiceStatus,
      };
    },
    setMemberScreenShareStatus: (
      state,
      {
        payload,
      }: { payload: { screenShareStatus: boolean; clientId: string } },
    ) => {
      const { clientId, screenShareStatus } = payload;
      state.member[clientId] = {
        ...state.member[clientId],
        screenShareStatus,
      };
    },
    deleteMember: (state, { payload }) => {
      const { clientId } = payload;
      delete state.member[clientId];
    },
    leaveRoom: (state) => {
      storage.setItem('roomName', '');
      state.roomName = '';
    },
    setMemberSize: (state, { payload }) => {
      state.size = payload;
    },
    setAllMemberVoiceOff: (state) => {
      for (const key in state.member) {
        state.member[key].voiceStatus = false;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const roomActions = roomSlice.actions;

export default roomSlice.reducer;
