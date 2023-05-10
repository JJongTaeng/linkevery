// db.ts
import Dexie, { Table } from 'dexie';

export interface User {
  id?: number;
  key: string;
  name: string;
}

export interface Message {
  userKey: string;
  message: string;
  messageType: string;
  date: string;
}
export interface Room {
  id?: number;
  roomName: string;
  messageList: Message[];
}

export class LinkeveryDB extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  user!: Table<User>;
  room!: Table<Room>;
  constructor() {
    super('linkevery');
    this.version(1).stores({
      user: '++id, &key, &name', // Primary key and indexed props
      room: '++id, &roomName, messageList',
    });
  }
}
