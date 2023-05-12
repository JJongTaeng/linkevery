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
      };
      await query.addRoom(emptyRoom);
      return emptyRoom;
    } else {
      return {
        roomName,
        member: room.member,
      };
    }
  },
);

export const addRoom = createAsyncThunk('db/addRoom', async (room: Room) => {
  return await query.addRoom(room);
});

export const addMessage = createAsyncThunk(
  'db/addMessage',
  async ({ message }: { message: Message }) => {
    return await query.addMessage(message);
  },
);

export const updateMessageList = createAsyncThunk(
  'db/updateMessageList',
  async ({ messageList }: { messageList: Message[] }) => {
    return await query.addMessageList(messageList);
  },
);

export const updateMember = createAsyncThunk(
  'db/updateMember',
  async ({ roomName, member }: { roomName: string; member: Member }) => {
    return await query.updateMember(roomName, member);
  },
);
