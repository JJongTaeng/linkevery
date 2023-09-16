import { CATEGORY, CHAT_MESSAGE_ID } from 'constants/protocol';
import type { Protocol } from 'constants/protocol';
import { category } from 'decorators/category';
import { messageId } from 'decorators/messageId';
import { DispatchEvent } from 'service/dispatch/DispatchEvent';
import { RTCManager } from 'service/rtc/RTCManager';
import { inject, injectable } from 'tsyringe';
import { chatActions } from 'store/features/chatSlice';
import { store } from 'store/store';
import { addChatByDB } from 'store/thunk/chatThunk';
import { storage } from 'service/storage/StorageService';

@category(CATEGORY.CHAT)
@injectable()
export class ChatHandler {
  constructor(
    @inject(DispatchEvent) private dispatch: DispatchEvent,
    @inject(RTCManager) private rtcManager: RTCManager,
  ) {}

  @messageId(CHAT_MESSAGE_ID.SEND)
  send(protocol: Protocol) {
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
    this.dispatch.sendChatOkMessage(chatInfo);
    store.dispatch(
      addChatByDB({
        ...chatInfo,
        roomName: storage.getItem('roomName'),
      }),
    );
  }

  @messageId(CHAT_MESSAGE_ID.OK)
  ok(protocol: Protocol) {
    const { userKey, message, date, username, messageType, messageKey } =
      protocol.data;
  }
}
