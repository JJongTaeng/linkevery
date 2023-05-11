import { HandlerMap, ROOM_MESSAGE_ID } from '../../constants/protocol';
import { roomActions } from '../../store/features/roomSlice';
import { store } from '../../store/store';
import { updateMember } from '../../store/thunk/roomThunk';
import { StorageService } from '../storage/StorageService';

const storage = StorageService.getInstance();

export const roomHandlers: HandlerMap<ROOM_MESSAGE_ID> = {
  [ROOM_MESSAGE_ID.REQUEST_MEMBER_NAME]: (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const username = storage.getItem('username');
    const userKey = storage.getItem('userKey');
    const roomName = storage.getItem('roomName');
    store.dispatch(
      roomActions.setMemberUsername({
        username: protocol.data.username,
        clientId: protocol.from,
      }),
    );

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
      updateMember({ roomName, member: store.getState().room.room.member }),
    );
  },
  [ROOM_MESSAGE_ID.RESPONSE_MEMBER_NAME]: (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const roomName = storage.getItem('roomName');
    store.dispatch(
      roomActions.setMemberUsername({
        username: protocol.data.username,
        clientId: protocol.from,
      }),
    );
    store.dispatch(
      roomActions.updateMember({
        username: protocol.data.username,
        clientId: protocol.from,
        userKey: protocol.data.userKey,
      }),
    );

    console.log(store.getState().room.room.member);
    store.dispatch(
      updateMember({ roomName, member: store.getState().room.room.member }),
    );
  },
};
