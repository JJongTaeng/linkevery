import { createAsyncThunk } from '@reduxjs/toolkit';
import { Message } from 'service/db/LinkeveryDB';
import { query } from 'service/db/Query';
import { storage } from '../../service/storage/StorageService';

export const getChatListByDB = createAsyncThunk(
  'db/getChatList',
  async ({ roomName }: { roomName: string }) => {
    const messageList = (await query.getMessageList(roomName)) || [];
    return messageList;
  },
);

export const getChatListPageByDB = createAsyncThunk(
  'db/getChatListPage',
  async ({
    roomName,
    page,
    offset,
  }: {
    roomName: string;
    page: number;
    offset?: number;
  }) => {
    const messageList =
      (await query.getMessageListByPage(roomName, page, offset)) || [];
    return messageList;
  },
);

export const addChatByDB = createAsyncThunk(
  'db/addChat',
  async (message: Message) => {
    return await query.addMessage(message);
  },
);

export const addChatListByDB = createAsyncThunk(
  'db/addChatList',
  async (messageList: Message[]) => {
    const roomName = storage.getItem('roomName');
    await query.addMessageList(messageList);

    return query.getMessageListByPage(roomName);
  },
);
