import { LinkeveryDB, Member, Message, Room, User } from './LinkeveryDB';

export interface QueryService {
  db: LinkeveryDB;

  getUser(): Promise<User | undefined>;
  addUser(name: string, key: string): Promise<User>;
  updateUser(name: string): void;
  addRoom(newRoom: Room): Promise<any>;
  getRoomByRoomName(roomName: string): Promise<Room | undefined>;
  getRoomList(): Promise<string[]>;
  deleteRoom(roomName: string): void;
  addMessage(message: Message): void;
  addMessageList(messageList: Message[]): void;
  getMessageList(roomName: string): Promise<Message[]>;
  getMessageListByPage(
    roomName: string,
    page: number,
    offset: number,
  ): Promise<Message[]>;
  updateMember(roomName: string, member: Member): void;
  deleteMember(roomName: string, userKey: string): void;
  deleteAllMember(roomName: string): void;
}
