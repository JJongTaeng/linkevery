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
      return;
    }

    this.db.user.add({ username: name, key });
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

  async addMessage(roomName: string, message: Message) {
    this.db.room
      .where('roomName')
      .equals(roomName)
      .modify((value, ref) => {
        const messageList = ref.value.messageList;
        messageList?.push(message);
        ref.value.messageList = messageList;
      });
  }

  async updateMessageList(roomName: string, messageList: Message[]) {
    this.db.room
      .where('roomName')
      .equals(roomName)
      .modify((value, ref) => {
        ref.value.messageList = messageList;
      });
  }

  async getRoomByRoomName(roomName: string) {
    return await this.db.room.where('roomName').equals(roomName).first();
  }

  async updateMember(roomName: string, member: Member) {
    this.db.room
      .where('roomName')
      .equals(roomName)
      .modify((value, ref) => {
        ref.value.member = member;
      });
  }
}

export const query = new Query();
