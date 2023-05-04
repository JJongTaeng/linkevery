import { createSlice } from '@reduxjs/toolkit';
import { StorageService } from '../../service/storage/StorageService';

interface RoomState {
  roomName: string;
  username: string;
  member: {
    [key: string]: {
      username: string;
      voiceStatus: boolean;
      screenShareStatus: boolean;
    };
  };
  size: number;
  voiceStatus: boolean;
  screenShareStatus: boolean;
}

const storage = StorageService.getInstance();

const initialState: RoomState = {
  roomName: storage.getItem('roomName'),
  username: storage.getItem('username'),
  member: {},
  size: 0,
  voiceStatus: false,
  screenShareStatus: false,
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomName: (state, { payload }) => {
      state.roomName = payload;
    },
    setUsername: (state, { payload }) => {
      state.username = payload.username;
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
    changeVoiceStatus: (state, { payload }) => {
      state.voiceStatus = payload;
    },
    changeScreenShareStatus: (state, { payload }) => {
      state.screenShareStatus = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const roomActions = roomSlice.actions;

export default roomSlice.reducer;
