import { HandlerMap, ROOM_MESSAGE_ID } from '../../constants/protocol';
import { roomActions } from '../../store/features/roomSlice';
import { store } from '../../store/store';
import { updateMemberByDB } from '../../store/thunk/roomThunk';
import { storage } from '../storage/StorageService';

export const roomHandlers: HandlerMap<ROOM_MESSAGE_ID> = {
  [ROOM_MESSAGE_ID.REQUEST_MEMBER_NAME]: (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const { username, userKey, roomName } = storage.getAll();

    store.dispatch(
      roomActions.updateMember({
        username: protocol.data.username,
        clientId: protocol.from,
        userKey: protocol.data.userKey,
      }),
    );
    dispatch.sendResponseMemberMessage({
      username,
      to: protocol.from,
      userKey,
    });
    store.dispatch(
      updateMemberByDB({ roomName, member: store.getState().room.room.member }),
    );
  },
  [ROOM_MESSAGE_ID.RESPONSE_MEMBER_NAME]: (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const roomName = storage.getItem('roomName');

    store.dispatch(
      roomActions.updateMember({
        username: protocol.data.username,
        clientId: protocol.from,
        userKey: protocol.data.userKey,
      }),
    );

    store.dispatch(
      updateMemberByDB({ roomName, member: store.getState().room.room.member }),
    );
  },
};
