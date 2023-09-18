import type { Protocol } from 'constants/protocol';
import { CATEGORY, MEMBER_MESSAGE_ID } from 'constants/protocol';
import { RTCManager } from '../rtc/RTCManager';
import { inject, injectable } from 'tsyringe';
import { category } from 'decorators/category';
import { messageId } from 'decorators/messageId';
import { storage } from '../storage/StorageService';
import { store } from '../../store/store';
import { roomActions } from '../../store/features/roomSlice';
import { updateMemberByDB } from '../../store/thunk/roomThunk';
import { query } from '../db/Query';
import { MemberDispatch } from '../peerEmitter/MemberDispatch';
import { ChatDispatch } from '../peerEmitter/ChatDispatch';

@category(CATEGORY.MEMBER)
@injectable()
export class MemberHandler {
  constructor(
    @inject(RTCManager) private rtcManager: RTCManager,
    @inject(MemberDispatch) private memberDispatch: MemberDispatch,
    @inject(ChatDispatch) private chatDispatch: ChatDispatch,
  ) {}

  @messageId(MEMBER_MESSAGE_ID.NAME)
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
    this.memberDispatch.sendMemberNameOkMessage({
      username,
      to: protocol.from,
      userKey,
    });
  }

  @messageId(MEMBER_MESSAGE_ID.NAME_OK)
  async memberNameOk(protocol: Protocol) {
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

    this.chatDispatch.sendSyncChatListMessage({
      messageList,
      to: protocol.from,
    });
  }
}
