import Dexie from 'dexie';
import { LinkeveryDB, Member, Message, Room } from './LinkeveryDB';
import { QueryService } from './QueryService';
import dayjs from 'dayjs';

class Query implements QueryService {
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

  async deleteRoom(roomName: string) {
    await this.db.room.where('roomName').equals(roomName).delete();
  }

  async addMessage(message: Message) {
    await this.db.message.add(message);
  }

  async addMessageList(messageList: Message[]) {
    await this.db.message
      .bulkAdd(messageList)
      .then(function (lastKey) {
        console.log('[DB] add bulk message');
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

  async getMessageListByUsername(roomName: string, username: string) {
    return await this.db.message
      .where('roomName')
      .equals(roomName)
      .and((message) => message.username === username)
      .sortBy('date');
  }

  async getMessageListByPage(roomName: string, page = 1, offset = 30) {
    return await this.db.message
      .where('roomName')
      .equals(roomName)
      .offset(offset * (page - 1))
      .limit(offset)
      .reverse()
      .toArray((messageList) => {
        messageList.sort((a, b) => {
          if (dayjs(a.date).isBefore(b.date)) return 1;
          else if (dayjs(a.date).isAfter(b.date)) return -1;
          else return 0;
        });
        return messageList.reverse();
      });
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
