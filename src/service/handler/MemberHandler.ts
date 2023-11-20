import type { EventType } from '../../constants/eventType';
import { CATEGORY, MEMBER_MESSAGE_ID } from '../../constants/eventType';
import { RTCManager } from '../rtc/RTCManager';
import { inject, injectable } from 'tsyringe';
import { category } from '../../decorators/category';
import { messageId } from '../../decorators/messageId';
import { storage } from '../storage/StorageService';
import { store } from '../../store/store';
import { roomActions } from '../../store/features/roomSlice';
import { updateMemberByDB } from '../../store/thunk/roomThunk';
import { query } from '../db/Query';
import { MemberEmitter } from '../emitter/MemberEmitter';
import { ChatEmitter } from '../emitter/ChatEmitter';

@category(CATEGORY.MEMBER)
@injectable()
export class MemberHandler {
  constructor(
    @inject(RTCManager) private rtcManager: RTCManager,
    @inject(MemberEmitter) private memberPeerEmitter: MemberEmitter,
    @inject(ChatEmitter) private chatPeerEmitter: ChatEmitter,
  ) {}

  @messageId(MEMBER_MESSAGE_ID.NAME)
  memberName(protocol: EventType) {
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
    this.memberPeerEmitter.sendMemberNameOkMessage({
      username,
      to: protocol.from,
      userKey,
    });
  }

  @messageId(MEMBER_MESSAGE_ID.NAME_OK)
  async memberNameOk(protocol: EventType) {
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

    this.chatPeerEmitter.sendSyncChatListMessage({
      messageList,
      to: protocol.from,
    });
  }
}
