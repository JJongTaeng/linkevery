// db.ts
import Dexie, { Table } from 'dexie';

export interface User {
  id?: number;
  key: string;
  username: string;
}

export interface Message {
  id?: string;
  roomName: string;
  username: string;
  messageKey: string;
  userKey: string;
  message: string | string[];
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
  member: Member;
}

export class LinkeveryDB extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  user!: Table<User>;
  room!: Table<Room>;
  message!: Table<Message>;
  dbVersion = 3; // DB 리셋이 필요하면 해당 버전을 1씩 올립니다.
  constructor() {
    super('linkevery');
    this.version(1).stores({
      user: '++id, &key, &username', // Primary key and indexed props
      room: '++id, &roomName, member',
      message:
        '&messageKey, roomName, username, userKey, message, messageType, date',
    });

    this.resetDB();
  }

  resetDB() {
    // DB 리셋이 필요하면 dbVersion을 1씩 올립니다.
    if (this.dbVersion > parseInt(localStorage.getItem('dbVersion') || '1')) {
      console.debug('Linkevery DB reset !');
      this.delete();
      localStorage.setItem('dbVersion', this.dbVersion.toString());
      window.location.reload();
    }
  }
}
