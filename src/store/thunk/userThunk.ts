import { createAsyncThunk } from '@reduxjs/toolkit';
import { query } from '../../service/db/Query';
import { storage } from './../../service/storage/StorageService';

export const getUser = createAsyncThunk('db/getUser', async () => {
  const user = await query.getUser();
  storage.setItem('userKey', user?.key || '');
  storage.setItem('username', user?.username || '');
  return user;
});

export const addUser = createAsyncThunk(
  'db/addUser',
  async ({ username, key }: { username: string; key: string }) => {
    return await query.addUser(username, key);
  },
);