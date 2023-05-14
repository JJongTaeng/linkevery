import Dexie from 'dexie';
import { LinkeveryDB, Member, Message, Room } from './LinkeveryDB';

class Query {
  db = new LinkeveryDB();

  constructor() {}

  async getUser() {
    const user = await this.db.user.toCollection().first();
    return user;
  }

  async addUser(name: string, key: string) {
    const user = await this.db.user.toCollection().first();
    if (user) {
      return user;
    }

    await this.db.user.add({ username: name, key });
    return { username: name, key };
  }

  async updateUser(name: string) {
    this.db.user
      .where('id')
      .equals(1)
      .modify((value, ref) => {
        ref.value.username = name;
      });
  }

  async addRoom(newRoom: Room) {
    if (!newRoom?.roomName) return;
    const room = await this.db.room
      .where('roomName')
      .equals(newRoom?.roomName)
      .first();
    if (room) {
      return;
    }

    await this.db.room.add({ ...newRoom });
  }

  async getRoomByRoomName(roomName: string) {
    return await this.db.room.where('roomName').equals(roomName).first();
  }

  async getRoomList() {
    return await this.db.room.toArray((roomList) =>
      roomList.map((room) => room.roomName),
    );
  }

  async addMessage(message: Message) {
    await this.db.message.add(message);
  }

  async addMessageList(messageList: Message[]) {
    await this.db.message
      .bulkAdd(messageList)
      .then(function (lastKey) {
        console.log('[DB] add bulk message'); // Will be 100000.
      })
      .catch(Dexie.BulkError, function (e) {
        console.warn(e);
      });
  }

  async getMessageList(roomName: string) {
    return await this.db.message
      .where('roomName')
      .equals(roomName)
      .sortBy('date');
  }

  async getMessageListByPage(roomName: string, page = 1, offset = 30) {
    return await this.db.message
      .where('roomName')
      .equals(roomName)
      .reverse()
      .offset(offset * (page - 1))
      .limit(offset)
      .sortBy('date');
  }

  async updateMember(roomName: string, member: Member) {
    this.db.room
      .where('roomName')
      .equals(roomName)
      .modify((value, ref) => {
        ref.value.member = member;
      });
  }

  async deleteMember(roomName: string, userKey: string) {
    this.db.room
      .where('roomName')
      .equals(roomName)
      .modify((value, ref) => {
        delete ref.value.member[userKey];
      });
  }
  async deleteAllMember(roomName: string) {
    this.db.room
      .where('roomName')
      .equals(roomName)
      .modify((value, ref) => {
        ref.value.member = {};
      });
  }
}

export const query = new Query();

// @ts-ignore
window.query = query;
