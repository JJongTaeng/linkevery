import { category } from 'decorators/category';
import type { Protocol } from 'constants/protocol';
import { CATEGORY, CONNECTION_MESSAGE_ID } from 'constants/protocol';
import { messageId } from 'decorators/messageId';
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

@category(CATEGORY.CONNECTION)
@injectable()
export class ConnectionPeerHandler {
  constructor(
    @inject(AudioManager) private audioManager: AudioManager,
    @inject(VideoManager) private videoManager: VideoManager,
    @inject(SignalingPeerEmitter)
    private signalingPeerEmitter: SignalingPeerEmitter,
    @inject(RTCManager) private rtcManager: RTCManager,
  ) {}
  @messageId(CONNECTION_MESSAGE_ID.CONNECT)
  connect(protocol: Protocol): void {
    const { clientId } = protocol.data;
    storage.setItem('clientId', clientId);
  }

  @messageId(CONNECTION_MESSAGE_ID.JOIN_ROOM)
  joinRoom(protocol: Protocol): void {
    const { roomName } = protocol.data;
    this.signalingPeerEmitter.sendSignalingStartMessage({
      roomName,
      to: protocol.from,
    });
  }

  @messageId(CONNECTION_MESSAGE_ID.DISCONNECT)
  disconnect(protocol: Protocol): void {
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
