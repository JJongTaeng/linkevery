import { APP_SERVICE_EVENT_NAME } from '../../constants/appEvent';
import { CHAT_MESSAGE_ID, HandlerMap } from '../../constants/protocol';

export const chatHandlers: HandlerMap<CHAT_MESSAGE_ID> = {
  [CHAT_MESSAGE_ID.SEND]: (protocol, { dispatch, rtcManager, ee }) => {
    const { message, clientId, date, username } = protocol.data;

    ee.emit(APP_SERVICE_EVENT_NAME.CHAT_MESSAGE, {
      message,
      clientId,
      date,
      username,
    });
  },
};
