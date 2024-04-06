import { category } from '../../decorators/category';
import type { EventType } from '../../constants/eventType';
import { CATEGORY, CONNECTION_MESSAGE_ID } from '../../constants/eventType';
import { messageId } from '../../decorators/messageId';
import { storage } from 'service/storage/StorageService';
import { utils } from 'service/utils/Utils';
import { store } from 'store/store';
import { roomActions } from 'store/features/roomSlice';
import { deleteMemberByDB } from 'store/thunk/roomThunk';
import { inject, injectable } from 'tsyringe';
import { AudioManager } from 'service/media/AudioManager';
import { VideoManager } from 'service/media/VideoManager';
import { RTCManager } from 'service/rtc/RTCManager';
import { SignalingEmitter } from '../emitter/SignalingEmitter';
import { router } from '../../main';
import { RoomEmitter } from '../emitter/RoomEmitter';

@category(CATEGORY.CONNECTION)
@injectable()
export class ConnectionHandler {
  constructor(
    @inject(RoomEmitter) private roomLocalEmitter: RoomEmitter,
    @inject(AudioManager) private audioManager: AudioManager,
    @inject(VideoManager) private videoManager: VideoManager,
    @inject(SignalingEmitter)
    private signalingPeerEmitter: SignalingEmitter,
    @inject(RTCManager) private rtcManager: RTCManager,
  ) {}
  @messageId(CONNECTION_MESSAGE_ID.CONNECT)
  connect(protocol: EventType): void {
    const { clientId } = protocol.data;
    storage.setItem('clientId', clientId);
  }

  @messageId(CONNECTION_MESSAGE_ID.JOIN_ROOM)
  joinRoom(protocol: EventType): void {
    const { roomName, userKey } = protocol.data;
    const myUserKey = storage.getItem('userKey');

    if (myUserKey === userKey) {
      this.roomLocalEmitter.leave();
      router.navigate('/');
    }
    this.signalingPeerEmitter.sendSignalingStartMessage({
      roomName,
      to: protocol.from,
    });
  }

  @messageId(CONNECTION_MESSAGE_ID.DISCONNECT)
  disconnect(protocol: EventType): void {
    const { from } = protocol;
    const { roomName } = storage.getAll();
    const userKey = utils.getUserKeyByClientId(from) || '';
    store.dispatch(roomActions.deleteMember({ userKey }));
    store.dispatch(deleteMemberByDB({ userKey, roomName }));
    this.audioManager.removeAudio(from);
    this.videoManager.clearVideo(from);
    try {
      this.rtcManager.removePeer(from);
    } catch (e) {}
  }
}
