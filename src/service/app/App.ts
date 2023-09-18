import { roomActions } from 'store/features/roomSlice';
import { userActions } from 'store/features/userSlice';
import { store } from 'store/store';
import { RTCManager } from 'service/rtc/RTCManager';
import { storage } from 'service/storage/StorageService';
import { inject, singleton } from 'tsyringe';
import { RTCManagerService } from 'service/rtc/RTCManagerService';
import { AudioManager } from 'service/media/AudioManager';
import { ScreenSharePeerEmitter } from '../peerEmitter/ScreenSharePeerEmitter';
import { VoicePeerEmitter } from '../peerEmitter/VoicePeerEmitter';
import { ConnectionPeerEmitter } from '../peerEmitter/ConnectionPeerEmitter';

@singleton()
export class App {
  screenMediaStream?: MediaStream;

  constructor(
    @inject(ScreenSharePeerEmitter)
    private screenSharePeerEmitter: ScreenSharePeerEmitter,
    @inject(VoicePeerEmitter) private voicePeerEmitter: VoicePeerEmitter,
    @inject(ConnectionPeerEmitter)
    private connectionPeerEmitter: ConnectionPeerEmitter,
    @inject(RTCManager) private _rtcManager: RTCManagerService,
    @inject(AudioManager) private audioManager: AudioManager,
  ) {}

  get rtcManager() {
    return this._rtcManager;
  }

  public disconnect() {
    const roomName = storage.getItem('roomName');
    store.dispatch(roomActions.leaveRoom());
    store.dispatch(userActions.changeVoiceStatus(false));
    store.dispatch(userActions.changeScreenShareStatus(false));
    this.connectionPeerEmitter.sendConnectionDisconnectMessage({ roomName });
    this.disconnectVoice();
    this.rtcManager.clearPeerMap();
  }

  public disconnectVoice() {
    const userKey = storage.getItem('userKey');

    // this._dispatch.sendVoiceDisconnectMessage({ userKey });
    this.voicePeerEmitter.sendVoiceDisconnectMessage({ userKey });
    this.rtcManager.clearAudioTrack();
    this.audioManager.removeAllAudio();
    this.rtcManager.clearVideoTrack();
  }

  public closeScreenShare() {
    const userKey = storage.getItem('userKey');
    this.screenSharePeerEmitter.sendScreenDisconnectMessage({ userKey });
    this.rtcManager.clearVideoTrack();
    this.screenMediaStream = undefined;
  }
}
