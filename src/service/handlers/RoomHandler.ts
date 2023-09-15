import type { Protocol } from '../../constants/protocol';
import { CATEGORY, ROOM_MESSAGE_ID } from '../../constants/protocol';
import { category } from '../../decorators/category';
import { messageId } from '../../decorators/messageId';
import { storage } from '../storage/StorageService';
import { store } from '../../store/store';
import { roomActions } from '../../store/features/roomSlice';
import { updateMemberByDB } from '../../store/thunk/roomThunk';
import { query } from '../db/Query';
import { Message } from '../db/LinkeveryDB';
import { inject, injectable } from 'tsyringe';
import { DispatchEvent } from '../dispatch/DispatchEvent';
import { RTCManager } from '../rtc/RTCManager';

@category(CATEGORY.ROOM)
@injectable()
export class RoomHandler {
  constructor(
    @inject(DispatchEvent) private dispatch: DispatchEvent,
    @inject(RTCManager) private rtcManager: RTCManager,
  ) {}

  @messageId(ROOM_MESSAGE_ID.MEMBER_NAME_PRE)
  memberNamePre(protocol: Protocol) {
    const username = storage.getItem('username');
    const userKey = storage.getItem('userKey');
    this.dispatch.sendRoomMemberNameMessage({
      username,
      to: protocol.from,
      userKey,
    });
  }

  @messageId(ROOM_MESSAGE_ID.MEMBER_NAME)
  memberName(protocol: Protocol) {
    const { username, userKey, roomName } = storage.getAll();

    store.dispatch(
      roomActions.updateMember({
        username: protocol.data.username,
        clientId: protocol.from,
        userKey: protocol.data.userKey,
      }),
    );

    store.dispatch(
      updateMemberByDB({
        roomName,
        member: store.getState().room.current.member,
      }),
    );
    this.dispatch.sendRoomMemberNamePostMessage({
      username,
      to: protocol.from,
      userKey,
    });
  }

  @messageId(ROOM_MESSAGE_ID.MEMBER_NAME_POST)
  async memberNamePost(protocol: Protocol) {
    const roomName = storage.getItem('roomName');

    store.dispatch(
      roomActions.updateMember({
        username: protocol.data.username,
        clientId: protocol.from,
        userKey: protocol.data.userKey,
      }),
    );

    store.dispatch(
      updateMemberByDB({
        roomName,
        member: store.getState().room.current.member,
      }),
    );

    const messageList = await query.getMessageList(roomName);

    this.dispatch.sendRoomSyncChatListMessage({
      messageList,
      to: protocol.from,
    });
  }

  @messageId(ROOM_MESSAGE_ID.SYNC_CHAT_LIST)
  async syncChatList(protocol: Protocol) {
    const roomName = storage.getItem('roomName');

    const { messageList } = protocol.data;

    if (messageList.length) {
      await query.addMessageList(
        messageList.map((message: Message) => ({
          message: message.message,
          date: message.date,
          messageKey: message.messageKey,
          userKey: message.userKey,
          username: message.username,
          roomName: message.roomName,
          messageType: message.messageType,
        })),
      );
    }

    const myMessageList = await query.getMessageList(roomName);
    this.dispatch.sendRoomSyncChatListOkMessage({
      messageList: myMessageList,
      to: protocol.from,
    });
  }

  @messageId(ROOM_MESSAGE_ID.SYNC_CHAT_LIST_OK)
  async syncChatListOk(protocol: Protocol) {
    const { messageList } = protocol.data;

    if (messageList.length) {
      await query.addMessageList(
        messageList.map((message: Message) => ({
          message: message.message,
          date: message.date,
          messageKey: message.messageKey,
          userKey: message.userKey,
          username: message.username,
          roomName: message.roomName,
          messageType: message.messageType,
        })),
      );
    }
  }
}
