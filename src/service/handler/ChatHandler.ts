import type { EventType } from '../../constants/eventType';
import { CATEGORY, CHAT_MESSAGE_ID } from '../../constants/eventType';
import { category } from '../../decorators/category';
import { messageId } from '../../decorators/messageId';
import { inject, injectable } from 'tsyringe';
import { chatActions } from 'store/features/chatSlice';
import { store } from 'store/store';
import { addChatByDB, addChatListByDB } from 'store/thunk/chatThunk';
import { storage } from 'service/storage/StorageService';
import { query } from '../db/Query';
import { ChatEmitter } from '../emitter/ChatEmitter';
import { SoundEffect } from '../media/SoundEffect';

@category(CATEGORY.CHAT)
@injectable()
export class ChatHandler {
  constructor(
    @inject(ChatEmitter) private chatPeerEmitter: ChatEmitter,
    @inject(SoundEffect) private soundEffect: SoundEffect,
  ) {}

  @messageId(CHAT_MESSAGE_ID.SEND)
  send(protocol: EventType) {
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
    if (!document.hasFocus()) this.soundEffect.receiveChat();
  }

  @messageId(CHAT_MESSAGE_ID.OK)
  ok(protocol: EventType) {
    const { userKey, message, date, username, messageType, messageKey } =
      protocol.data;
  }

  @messageId(CHAT_MESSAGE_ID.SYNC_CHAT_LIST)
  async syncChatList(protocol: EventType) {
    const roomName = storage.getItem('roomName');
    const username = storage.getItem('username');

    const { messageList } = protocol.data;

    if (messageList.length) {
      store.dispatch(addChatListByDB(messageList));
    }

    const myMessageList = await query.getMessageListByUsername(
      roomName,
      username,
    );
    this.chatPeerEmitter.sendSyncChatListOkMessage({
      messageList: myMessageList,
      to: protocol.from,
    });
  }

  @messageId(CHAT_MESSAGE_ID.SYNC_CHAT_LIST_OK)
  async syncChatListOk(protocol: EventType) {
    const { messageList } = protocol.data;

    if (messageList.length) {
      store.dispatch(addChatListByDB(messageList));
    }
  }
}
