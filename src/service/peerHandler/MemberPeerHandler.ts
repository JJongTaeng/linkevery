import type { PeerEvent } from '../../constants/peerEvent';
import { CATEGORY, MEMBER_MESSAGE_ID } from '../../constants/peerEvent';
import { RTCManager } from '../rtc/RTCManager';
import { inject, injectable } from 'tsyringe';
import { category } from 'decorators/category';
import { messageId } from 'decorators/messageId';
import { storage } from '../storage/StorageService';
import { store } from '../../store/store';
import { roomActions } from '../../store/features/roomSlice';
import { updateMemberByDB } from '../../store/thunk/roomThunk';
import { query } from '../db/Query';
import { MemberPeerEmitter } from '../peerEmitter/MemberPeerEmitter';
import { ChatPeerEmitter } from '../peerEmitter/ChatPeerEmitter';

@category(CATEGORY.MEMBER)
@injectable()
export class MemberPeerHandler {
  constructor(
    @inject(RTCManager) private rtcManager: RTCManager,
    @inject(MemberPeerEmitter) private memberPeerEmitter: MemberPeerEmitter,
    @inject(ChatPeerEmitter) private chatPeerEmitter: ChatPeerEmitter,
  ) {}

  @messageId(MEMBER_MESSAGE_ID.NAME)
  memberName(protocol: PeerEvent) {
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
  async memberNameOk(protocol: PeerEvent) {
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
