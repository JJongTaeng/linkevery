import { createSlice } from '@reduxjs/toolkit';
import { StorageService } from '../../service/storage/StorageService';
import { addRoom, getRoom } from '../thunk/roomThunk';
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
  room: Omit<Room, 'id'>;
  size: number;
}

const storage = StorageService.getInstance();

const initialState: RoomState = {
  roomName: storage.getItem('roomName'),
  member: {},
  room: {
    member: {},
    messageList: [],
    roomName: '',
  },
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
  extraReducers: (builder) => {
    builder
      .addCase(getRoom.fulfilled, (state, { payload }) => {
        state.room = payload;
      })
      .addCase(addRoom.fulfilled, (state, { payload }) => {});
  },
});

// Action creators are generated for each case reducer function
export const roomActions = roomSlice.actions;

export default roomSlice.reducer;
