import { nanoid } from 'nanoid';
import { StorageService } from '../storage/StorageService';
import { LinkeveryDB, Message, Room } from './LinkeveryDB';

const storage = StorageService.getInstance();

class Query {
  db = new LinkeveryDB();

  constructor() {}

  async getUser() {
    const user = await this.db.user.toCollection().first();
    return user;
  }

  async addUser(name: string) {
    const user = await this.db.user.toCollection().first();
    if (user) {
      return;
    }

    this.db.user.add({ username: name, key: nanoid() });
  }

  async updateUser(name: string) {
    this.db.user
      .where('id')
      .equals(1)
      .modify((value, ref) => {
        ref.value.username = name;
      });
  }

  async addRoomInfo(newRoom: Room) {
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

  async updateMessageList(roomName: string, message: Message) {
    this.db.room
      .where('roomName')
      .equals(roomName)
      .modify((value, ref) => {
        const messageList = ref.value.messageList;
        messageList?.push(message);
        ref.value.messageList = messageList;
      });
  }

  async getRoomInfo(roomName: string) {
    return await this.db.room.where('roomName').equals(roomName).first();
  }
}

export const query = new Query();
