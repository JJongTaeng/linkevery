import { CHAT_MESSAGE_ID, HandlerMap } from '../../constants/protocol';
import { chatActions } from '../../store/features/chatSlice';
import { store } from '../../store/store';
import { addChatByDB } from '../../store/thunk/chatThunk';
import { storage } from '../storage/StorageService';

export const chatHandlers: HandlerMap<CHAT_MESSAGE_ID> = {
  [CHAT_MESSAGE_ID.SEND]: (protocol, { dispatch, rtcManager }) => {
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
  },
  [CHAT_MESSAGE_ID.OK]: (protocol, { dispatch, rtcManager }) => {
    const { userKey, message, date, username, messageType, messageKey } =
      protocol.data;
  },
};
