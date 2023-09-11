import { CHAT_MESSAGE_ID, HandlerMap } from '../../constants/protocol';
import { chatActions } from '../../store/features/chatSlice';
import { store } from '../../store/store';
import { addChatByDB } from '../../store/thunk/chatThunk';
import { storage } from '../storage/StorageService';

export const chatHandlers: HandlerMap<CHAT_MESSAGE_ID> = {
  [CHAT_MESSAGE_ID.SEND]: (protocol, { dispatch, rtcManager }) => {
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
    dispatch.sendChatOkMessage(chatInfo);
    store.dispatch(
      addChatByDB({
        ...chatInfo,
        roomName: storage.getItem('roomName'),
      }),
    );
  },
  [CHAT_MESSAGE_ID.OK]: (protocol, { dispatch, rtcManager }) => {
    const { userKey, message, date, username, messageType, messageKey } =
      protocol.data;
  },
};
