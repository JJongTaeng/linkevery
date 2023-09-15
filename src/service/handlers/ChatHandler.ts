import type { Protocol, HandlerParameter } from '../../constants/protocol';
import {
  CATEGORY,
  CHAT_MESSAGE_ID,
  HandlerFunction,
} from '../../constants/protocol';
import { category } from '../../decorators/category';
import { DispatchEvent } from '../dispatch/DispatchEvent';
import { RTCManagerService } from '../rtc/RTCManagerService';
import { messageId } from '../../decorators/messageId';
import { store } from '../../store/store';
import { chatActions } from '../../store/features/chatSlice';
import { addChatByDB } from '../../store/thunk/chatThunk';
import { storage } from '../storage/StorageService';
import { inject, delay, injectable } from 'tsyringe';
import { RTCManager } from '../rtc/RTCManager';

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
  ok(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: {
      dispatch: DispatchEvent;
      rtcManager: RTCManagerService;
    },
  ) {
    const { userKey, message, date, username, messageType, messageKey } =
      protocol.data;
  }
}
