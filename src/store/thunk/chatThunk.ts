import { createAsyncThunk } from '@reduxjs/toolkit';
import { Message } from '../../service/db/LinkeveryDB';
import { query } from '../../service/db/Query';

export const getChatListByDB = createAsyncThunk('db/getChatList', async () => {
  const messageList = (await query.getMessageList()) || [];
  return messageList;
});

export const addChatByDB = createAsyncThunk(
  'db/addChat',
  async (message: Message) => {
    return await query.addMessage(message);
  },
);
