// db.ts
import Dexie, { Table } from 'dexie';

export interface UserKey {
  id?: number;
  userKey: string;
}

export interface RoomList {
  id?: number;
  roomName: string;
  messageList: {
    userKey: string;
    message: string;
    messageType: string;
    date: string;
  }[];
}

export class LinkeveryDB extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  userKey!: Table<UserKey>;
  roomList!: Table<RoomList>;
  constructor() {
    super('linkevery');
    this.version(1).stores({
      userKey: '++id, userKey', // Primary key and indexed props
      roomList: '++id, roomName, messageList',
    });
  }
}
