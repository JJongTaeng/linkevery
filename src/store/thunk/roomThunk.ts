import { createAsyncThunk } from '@reduxjs/toolkit';
import { Member, Message, Room } from '../../service/db/LinkeveryDB';
import { query } from '../../service/db/Query';

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

export const updateMember = createAsyncThunk(
  'db/updateMember',
  async ({ roomName, member }: { roomName: string; member: Member }) => {
    return await query.updateMember(roomName, member);
  },
);
