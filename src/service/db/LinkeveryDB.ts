// db.ts
import Dexie, { Table } from 'dexie';

export interface User {
  id?: number;
  key: string;
  username: string;
}

export interface Message {
  userKey: string;
  message: string;
  messageType: string;
  date: string;
}

export interface Member {
  [key: string]: {
    username: string;
    clientId: string;
    voiceStatus?: boolean;
    screenShareStatus?: boolean;
  };
}
export interface Room {
  id?: number;
  roomName: string;
  messageList: Message[];
  member: Member;
}

export class LinkeveryDB extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  user!: Table<User>;
  room!: Table<Room>;
  constructor() {
    super('linkevery');
    this.version(1).stores({
      user: '++id, &key, &username', // Primary key and indexed props
      room: '++id, &roomName, messageList, member',
    });
  }
}
