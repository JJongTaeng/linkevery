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
import { VideoManager } from 'service/media/VideoManager';
import { RTCManager } from 'service/rtc/RTCManager';
import { SignalingEmitter } from '../emitter/SignalingEmitter';
import { router } from '../../main';
import { RoomEmitter } from '../emitter/RoomEmitter';
import { AudioPlayerManager } from 'service/media/AudioPlayerManager.ts';

@category(CATEGORY.CONNECTION)
@injectable()
export class ConnectionHandler {
  constructor(
    @inject(RoomEmitter) private roomEmitter: RoomEmitter,
    @inject(SignalingEmitter)
    private signalingEmitter: SignalingEmitter,

    @inject(AudioPlayerManager) private audioPlayerManager: AudioPlayerManager,
    @inject(VideoManager) private videoManager: VideoManager,
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
      this.roomEmitter.leave();
      router.navigate('/');
    }
    this.signalingEmitter.sendSignalingReadyMessage({
      roomName,
      to: protocol.from,
    });
  }

  @messageId(CONNECTION_MESSAGE_ID.DISCONNECT)
  disconnect(protocol: EventType): void {
    const { from } = protocol;
    const { roomName } = storage.getAll();
    this.audioPlayerManager.removeAudioStream(from);
    this.videoManager.clearVideo(from);
    try {
      this.rtcManager.removePeer(from);
    } catch (e) {}

    const userKey = utils.getUserKeyByClientId(from) || '';
    store.dispatch(roomActions.deleteMember({ userKey }));
    store.dispatch(deleteMemberByDB({ userKey, roomName }));
  }
}
