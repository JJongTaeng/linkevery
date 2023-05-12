import { CONNECTION_MESSAGE_ID, HandlerMap } from '../../constants/protocol';
import { roomActions } from '../../store/features/roomSlice';
import { store } from '../../store/store';
import { audioManager } from '../media/AudioManager';
import { videoManager } from '../media/VideoManager';
import { storage } from '../storage/StorageService';

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
    store.dispatch(roomActions.deleteMember({ clientId: from }));
    audioManager.removeAudio(from);
    videoManager.clearVideo(from);
    rtcManager.removePeer(from);
  },
};
