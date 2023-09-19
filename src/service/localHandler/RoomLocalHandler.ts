import { CATEGORY, ROOM_MESSAGE_ID } from '../../constants/localEvent';
import { inject, injectable } from 'tsyringe';
import { StorageService } from '../storage/StorageService';
import type { StoreType } from '../../store/store';
import { roomActions } from '../../store/features/roomSlice';
import { userActions } from '../../store/features/userSlice';
import { ConnectionPeerEmitter } from '../peerEmitter/ConnectionPeerEmitter';
import { RTCManager } from '../rtc/RTCManager';
import { RTCManagerService } from '../rtc/RTCManagerService';
import { VoicePeerEmitter } from '../peerEmitter/VoicePeerEmitter';
import { AudioManager } from '../media/AudioManager';
import { chatActions } from '../../store/features/chatSlice';
import { statusActions } from '../../store/features/statusSlice';
import { localCategory } from '../../decorators/localCategory';
import { localMessageId } from 'decorators/localMessageId';

@localCategory(CATEGORY.ROOM)
@injectable()
export class RoomLocalHandler {
  constructor(
    @inject('storage') private storage: StorageService,
    @inject('store') private store: StoreType,
    @inject(ConnectionPeerEmitter)
    private connectionPeerEmitter: ConnectionPeerEmitter,
    @inject(RTCManager) private rtcManager: RTCManagerService,
    @inject(VoicePeerEmitter) private voicePeerEmitter: VoicePeerEmitter,
    @inject(AudioManager) private audioManager: AudioManager,
  ) {}
  @localMessageId(ROOM_MESSAGE_ID.LEAVE)
  leave() {
    const roomName = this.storage.getItem('roomName');
    const userKey = this.storage.getItem('userKey');

    this.store.dispatch(roomActions.leaveRoom());
    this.store.dispatch(userActions.changeVoiceStatus(false));
    this.store.dispatch(userActions.changeScreenShareStatus(false));
    this.store.dispatch(chatActions.resetChatState());
    this.store.dispatch(statusActions.resetAllStatusState());

    this.connectionPeerEmitter.sendConnectionDisconnectMessage({ roomName });
    this.voicePeerEmitter.sendVoiceDisconnectMessage({ userKey });
    this.rtcManager.clearAudioTrack();
    this.audioManager.removeAllAudio();
    this.rtcManager.clearVideoTrack();
    this.rtcManager.clearPeerMap();
  }
}
