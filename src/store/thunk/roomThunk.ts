import { createAsyncThunk } from '@reduxjs/toolkit';
import { Member, Message, Room } from 'service/db/LinkeveryDB';
import { query } from 'service/db/Query';

export const getRoomByDB = createAsyncThunk(
  'db/getRoom',
  async (roomName: string) => {
    let room = await query.getRoomByRoomName(roomName);
    if (!room) {
      const emptyRoom = {
        roomName,
        member: {},
      };
      return emptyRoom;
    } else {
      return {
        roomName,
        member: room.member,
      };
    }
  },
);

export const getRoomListByDB = createAsyncThunk('db/getRoomList', async () => {
  return await query.getRoomList();
});

export const addRoomByDB = createAsyncThunk(
  'db/addRoom',
  async (room: Room) => {
    await query.addRoom(room);
    return room;
  },
);

export const deleteRoomByDB = createAsyncThunk(
  'db/deleteRoom',
  async ({ roomName }: { roomName: string }) => {
    await query.deleteRoom(roomName);
    return roomName;
  },
);

export const addMessageByDB = createAsyncThunk(
  'db/addMessage',
  async ({ message }: { message: Message }) => {
    return await query.addMessage(message);
  },
);

export const updateMessageListByDB = createAsyncThunk(
  'db/updateMessageList',
  async ({ messageList }: { messageList: Message[] }) => {
    return await query.addMessageList(messageList);
  },
);

export const updateMemberByDB = createAsyncThunk(
  'db/updateMember',
  async ({ roomName, member }: { roomName: string; member: Member }) => {
    return await query.updateMember(roomName, member);
  },
);

export const deleteMemberByDB = createAsyncThunk(
  'db/deleteMember',
  async ({ roomName, userKey }: { roomName: string; userKey: string }) => {
    return await query.deleteMember(roomName, userKey);
  },
);

export const deleteAllMemberByDB = createAsyncThunk(
  'db/deleteMember',
  async ({ roomName }: { roomName: string }) => {
    return await query.deleteAllMember(roomName);
  },
);
