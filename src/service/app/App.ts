import { roomActions } from 'store/features/roomSlice';
import { userActions } from 'store/features/userSlice';
import { store } from 'store/store';
import { DispatchEvent } from '../peerEmitter/DispatchEvent';
import { RTCManager } from 'service/rtc/RTCManager';
import { storage } from 'service/storage/StorageService';
import { inject, singleton } from 'tsyringe';
import { RTCManagerService } from 'service/rtc/RTCManagerService';
import { AudioManager } from 'service/media/AudioManager';
import { ScreenShareDispatch } from '../peerEmitter/ScreenShareDispatch';
import { VoiceDispatch } from '../peerEmitter/VoiceDispatch';
import { ConnectionDispatch } from '../peerEmitter/ConnectionDispatch';

@singleton()
export class App {
  screenMediaStream?: MediaStream;

  constructor(
    @inject(ScreenShareDispatch)
    private screenDispatch: ScreenShareDispatch,
    @inject(VoiceDispatch) private voiceDispatch: VoiceDispatch,
    @inject(ConnectionDispatch) private connectionDispatch: ConnectionDispatch,
    @inject(DispatchEvent) private _dispatch: DispatchEvent,
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
    this.connectionDispatch.sendConnectionDisconnectMessage({ roomName });
    this.disconnectVoice();
    this.rtcManager.clearPeerMap();
  }

  public disconnectVoice() {
    const userKey = storage.getItem('userKey');

    // this._dispatch.sendVoiceDisconnectMessage({ userKey });
    this.voiceDispatch.sendVoiceDisconnectMessage({ userKey });
    this.rtcManager.clearAudioTrack();
    this.audioManager.removeAllAudio();
    this.rtcManager.clearVideoTrack();
  }

  public closeScreenShare() {
    const userKey = storage.getItem('userKey');
    this.screenDispatch.sendScreenDisconnectMessage({ userKey });
    this.rtcManager.clearVideoTrack();
    this.screenMediaStream = undefined;
  }
}
