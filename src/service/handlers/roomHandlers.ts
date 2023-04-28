import { HandlerMap, ROOM_MESSAGE_ID } from '../../constants/protocol';
import { roomActions } from '../../store/features/roomSlice';
import { store } from '../../store/store';
import { StorageService } from '../storage/StorageService';

const storage = StorageService.getInstance();

export const roomHandlers: HandlerMap<ROOM_MESSAGE_ID> = {
  [ROOM_MESSAGE_ID.REQUEST_MEMBER_NAME]: (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const username = storage.getItem('username');
    store.dispatch(
      roomActions.setMember({
        username: protocol.data.username,
        clientId: protocol.from,
      }),
    );
    dispatch.sendResponseMemberMessage({ username, to: protocol.from });
  },
  [ROOM_MESSAGE_ID.RESPONSE_MEMBER_NAME]: (
    protocol,
    { dispatch, rtcManager },
  ) => {
    store.dispatch(
      roomActions.setMember({
        username: protocol.data.username,
        clientId: protocol.from,
      }),
    );
  },
};
