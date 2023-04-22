import { APP_SERVICE_EVENT_NAME } from '../../constants/appEvent';
import { HandlerMap, ROOM_MESSAGE_ID } from '../../constants/protocol';
import { StorageService } from '../storage/StorageService';

const storage = StorageService.getInstance();

export const roomHandlers: HandlerMap<ROOM_MESSAGE_ID> = {
  [ROOM_MESSAGE_ID.REQUEST_MEMBER_NAME]: (
    protocol,
    { dispatch, rtcManager, ee },
  ) => {
    const username = storage.getItem('username');
    ee.emit(APP_SERVICE_EVENT_NAME.ROOM_USERNAME, {
      username: protocol.data.username,
      clientId: protocol.from,
    });
    dispatch.sendResponseMemberMessage({ username });
  },
  [ROOM_MESSAGE_ID.RESPONSE_MEMBER_NAME]: (
    protocol,
    { dispatch, rtcManager, ee },
  ) => {
    const { username } = protocol.data;
    ee.emit(APP_SERVICE_EVENT_NAME.ROOM_USERNAME, {
      username,
      clientId: protocol.from,
    });
  },
};
