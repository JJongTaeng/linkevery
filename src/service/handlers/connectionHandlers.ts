import { CONNECTION_MESSAGE_ID, HandlerMap } from '../../constants/protocol';
import { roomActions } from '../../store/features/roomSlice';
import { store } from '../../store/store';
import { deleteMemberByDB } from '../../store/thunk/roomThunk';
// import { audioManager } from '../media/AudioManager';
// import { videoManager } from '../media/VideoManager';
import { storage } from '../storage/StorageService';
import { utils } from '../utils/Utils';

export const connectionHandlers: HandlerMap<CONNECTION_MESSAGE_ID> = {
  [CONNECTION_MESSAGE_ID.CONNECT]: (protocol, { dispatch }) => {
    const { clientId } = protocol.data;
    storage.setItem('clientId', clientId);
  },
  [CONNECTION_MESSAGE_ID.JOIN_ROOM]: (protocol, { dispatch }) => {
    const { roomName } = protocol.data;
    dispatch.sendSignalingStartMessage({
      roomName,
      to: protocol.from,
    });
  },
  [CONNECTION_MESSAGE_ID.DISCONNECT]: (protocol, { rtcManager, dispatch }) => {
    const { from } = protocol;
    const { roomName } = storage.getAll();
    const userKey = utils.getUserKeyByClientId(from) || '';
    store.dispatch(roomActions.deleteMember({ userKey }));
    store.dispatch(deleteMemberByDB({ userKey, roomName }));
    // audioManager.removeAudio(from);
    // videoManager.clearVideo(from);
    try {
      rtcManager.removePeer(from);
    } catch (e) {}
  },
};
