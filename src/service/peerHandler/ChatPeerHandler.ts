import type { PeerEvent } from '../../constants/peerEvent';
import { CATEGORY, CHAT_MESSAGE_ID } from '../../constants/peerEvent';
import { category } from 'decorators/category';
import { messageId } from 'decorators/messageId';
import { inject, injectable } from 'tsyringe';
import { chatActions } from 'store/features/chatSlice';
import { store } from 'store/store';
import { addChatByDB } from 'store/thunk/chatThunk';
import { storage } from 'service/storage/StorageService';
import { query } from '../db/Query';
import { Message } from '../db/LinkeveryDB';
import { ChatPeerEmitter } from '../peerEmitter/ChatPeerEmitter';

@category(CATEGORY.CHAT)
@injectable()
export class ChatPeerHandler {
  constructor(
    @inject(ChatPeerEmitter) private chatPeerEmitter: ChatPeerEmitter,
  ) {}

  @messageId(CHAT_MESSAGE_ID.SEND)
  send(protocol: PeerEvent) {
    const { userKey, message, date, username, messageType, messageKey } =
      protocol.data;
    const chatInfo = {
      messageType,
      messageKey,
      message,
      userKey,
      date,
      username,
    };

    store.dispatch(chatActions.addChat(chatInfo));
    this.chatPeerEmitter.sendChatOkMessage(chatInfo);
    store.dispatch(
      addChatByDB({
        ...chatInfo,
        roomName: storage.getItem('roomName'),
      }),
    );
  }

  @messageId(CHAT_MESSAGE_ID.OK)
  ok(protocol: PeerEvent) {
    const { userKey, message, date, username, messageType, messageKey } =
      protocol.data;
  }

  @messageId(CHAT_MESSAGE_ID.SYNC_CHAT_LIST)
  async syncChatList(protocol: PeerEvent) {
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
    this.chatPeerEmitter.sendSyncChatListOkMessage({
      messageList: myMessageList,
      to: protocol.from,
    });
  }

  @messageId(CHAT_MESSAGE_ID.SYNC_CHAT_LIST_OK)
  async syncChatListOk(protocol: PeerEvent) {
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
