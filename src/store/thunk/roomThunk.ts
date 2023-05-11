import { createAsyncThunk } from '@reduxjs/toolkit';
import { Message, Room } from '../../service/db/LinkeveryDB';
import { query } from '../../service/db/Query';
import { StorageService } from './../../service/storage/StorageService';

const storage = StorageService.getInstance();

export const getRoom = createAsyncThunk(
  'db/getRoom',
  async (roomName: string) => {
    let room = await query.getRoomByRoomName(roomName);
    if (!room) {
      const emptyRoom = {
        roomName,
        member: {},
        messageList: [],
      };
      await query.addRoom(emptyRoom);
      return emptyRoom;
    } else {
      return {
        roomName,
        member: room.member,
        messageList: room.messageList,
      };
    }
  },
);

export const addRoom = createAsyncThunk('db/addRoom', async (room: Room) => {
  return await query.addRoom(room);
});

export const addMessage = createAsyncThunk(
  'db/addMessage',
  async ({ roomName, message }: { roomName: string; message: Message }) => {
    return await query.addMessage(roomName, message);
  },
);

export const updateMessageList = createAsyncThunk(
  'db/updateMessageList',
  async ({
    roomName,
    messageList,
  }: {
    roomName: string;
    messageList: Message[];
  }) => {
    return await query.updateMessageList(roomName, messageList);
  },
);
