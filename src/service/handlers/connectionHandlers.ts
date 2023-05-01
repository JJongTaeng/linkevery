import { CONNECTION_MESSAGE_ID, HandlerMap } from '../../constants/protocol';
import { roomActions } from '../../store/features/roomSlice';
import { store } from '../../store/store';
import { StorageService } from '../storage/StorageService';

const storage = StorageService.getInstance();

export const connectionHandlers: HandlerMap<CONNECTION_MESSAGE_ID> = {
  [CONNECTION_MESSAGE_ID.CONNECT]: (protocol, { dispatch }) => {
    const { clientId } = protocol.data;
    storage.setItem('clientId', clientId);
  },
  [CONNECTION_MESSAGE_ID.DISCONNECT]: (protocol, { rtcManager }) => {
    const { from } = protocol;
    store.dispatch(roomActions.deleteMember({ clientId: from }));
    rtcManager.removePeer(from);
  },
};
