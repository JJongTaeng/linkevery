import { category } from '../../decorators/category';
import type { HandlerFunction, Protocol } from '../../constants/protocol';
import { CATEGORY, CONNECTION_MESSAGE_ID } from '../../constants/protocol';
import { messageId } from '../../decorators/messageId';
import { DispatchEvent } from '../dispatch/DispatchEvent';
import { RTCManagerService } from '../rtc/RTCManagerService';
import { storage } from '../storage/StorageService';
import { utils } from '../utils/Utils';
import { store } from '../../store/store';
import { roomActions } from '../../store/features/roomSlice';
import { deleteMemberByDB } from '../../store/thunk/roomThunk';
import { audioManager } from '../media/AudioManager';
import { videoManager } from '../media/VideoManager';

interface ConnectionHandlerService {
  connect: HandlerFunction;
  joinRoom: HandlerFunction;
  disconnect: HandlerFunction;
}

@category(CATEGORY.CONNECTION)
export class ConnectionHandler implements ConnectionHandlerService {
  @messageId(CONNECTION_MESSAGE_ID.CONNECT)
  connect(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: { dispatch: DispatchEvent; rtcManager: RTCManagerService },
  ): void {
    const { clientId } = protocol.data;
    storage.setItem('clientId', clientId);
  }

  @messageId(CONNECTION_MESSAGE_ID.JOIN_ROOM)
  joinRoom(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: {
      dispatch: DispatchEvent;
      rtcManager: RTCManagerService;
    },
  ): void {
    const { roomName } = protocol.data;
    dispatch.sendSignalingStartMessage({
      roomName,
      to: protocol.from,
    });
  }

  @messageId(CONNECTION_MESSAGE_ID.DISCONNECT)
  disconnect(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: {
      dispatch: DispatchEvent;
      rtcManager: RTCManagerService;
    },
  ): void {
    const { from } = protocol;
    const { roomName } = storage.getAll();
    const userKey = utils.getUserKeyByClientId(from) || '';
    store.dispatch(roomActions.deleteMember({ userKey }));
    store.dispatch(deleteMemberByDB({ userKey, roomName }));
    audioManager.removeAudio(from);
    videoManager.clearVideo(from);
    try {
      rtcManager.removePeer(from);
    } catch (e) {}
  }
}
