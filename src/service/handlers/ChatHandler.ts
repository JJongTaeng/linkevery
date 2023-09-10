import type { Protocol } from '../../constants/protocol';
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

interface ChatHandlerService {
  send: HandlerFunction;
  ok: HandlerFunction;
}

@category(CATEGORY.CHAT)
export class ChatHandler implements ChatHandlerService {
  @messageId(CHAT_MESSAGE_ID.SEND)
  send(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: { dispatch: DispatchEvent; rtcManager: RTCManagerService },
  ) {
    const { userKey, message, date, username, messageType, messageKey } =
      protocol.data;
    store.dispatch(
      chatActions.addChat({
        messageType,
        messageKey,
        message,
        userKey,
        date,
        username,
      }),
    );

    dispatch.sendChatOkMessage({
      messageType,
      messageKey,
      message,
      userKey,
      date,
      username,
    });

    store.dispatch(
      addChatByDB({
        messageType,
        messageKey,
        message,
        userKey,
        date,
        username,
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
