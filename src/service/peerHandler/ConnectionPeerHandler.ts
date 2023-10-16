import { peerCategory } from '../../decorators/peerCategory';
import type { PeerEvent } from '../../constants/peerEvent';
import { CATEGORY, CONNECTION_MESSAGE_ID } from '../../constants/peerEvent';
import { peerMessageId } from '../../decorators/peerMessageId';
import { storage } from 'service/storage/StorageService';
import { utils } from 'service/utils/Utils';
import { store } from 'store/store';
import { roomActions } from 'store/features/roomSlice';
import { deleteMemberByDB } from 'store/thunk/roomThunk';
import { inject, injectable } from 'tsyringe';
import { AudioManager } from 'service/media/AudioManager';
import { VideoManager } from 'service/media/VideoManager';
import { RTCManager } from 'service/rtc/RTCManager';
import { SignalingPeerEmitter } from '../peerEmitter/SignalingPeerEmitter';
import { router } from '../../index';
import { RoomLocalEmitter } from '../localEmitter/RoomLocalEmitter';

@peerCategory(CATEGORY.CONNECTION)
@injectable()
export class ConnectionPeerHandler {
  constructor(
    @inject(RoomLocalEmitter) private roomLocalEmitter: RoomLocalEmitter,
    @inject(AudioManager) private audioManager: AudioManager,
    @inject(VideoManager) private videoManager: VideoManager,
    @inject(SignalingPeerEmitter)
    private signalingPeerEmitter: SignalingPeerEmitter,
    @inject(RTCManager) private rtcManager: RTCManager,
  ) {}
  @peerMessageId(CONNECTION_MESSAGE_ID.CONNECT)
  connect(protocol: PeerEvent): void {
    const { clientId } = protocol.data;
    storage.setItem('clientId', clientId);
  }

  @peerMessageId(CONNECTION_MESSAGE_ID.JOIN_ROOM)
  joinRoom(protocol: PeerEvent): void {
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

  @peerMessageId(CONNECTION_MESSAGE_ID.DISCONNECT)
  disconnect(protocol: PeerEvent): void {
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
