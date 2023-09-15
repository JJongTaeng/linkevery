import { roomActions } from '../../store/features/roomSlice';
import { userActions } from '../../store/features/userSlice';
import { store } from '../../store/store';
import { DispatchEvent } from '../dispatch/DispatchEvent';
import { RTCManager } from '../rtc/RTCManager';
import { storage } from '../storage/StorageService';
import { inject, singleton } from 'tsyringe';
import { RTCManagerService } from '../rtc/RTCManagerService';
import { AudioManager } from '../media/AudioManager';

@singleton()
export class App {
  screenMediaStream?: MediaStream;

  constructor(
    @inject(DispatchEvent) private _dispatch: DispatchEvent,
    @inject(RTCManager) private _rtcManager: RTCManagerService,
    @inject(AudioManager) private audioManager: AudioManager,
  ) {}

  get dispatch() {
    return this._dispatch;
  }

  get rtcManager() {
    return this._rtcManager;
  }

  public disconnect() {
    const roomName = storage.getItem('roomName');
    store.dispatch(roomActions.leaveRoom());
    store.dispatch(userActions.changeVoiceStatus(false));
    this._dispatch.sendConnectionDisconnectMessage({ roomName });
    this.rtcManager.clearPeerMap();
  }

  public disconnectVoice() {
    const userKey = storage.getItem('userKey');

    this._dispatch.sendVoiceDisconnectMessage({ userKey });
    this.rtcManager.clearAudioTrack();
    this.audioManager.removeAllAudio();
    this.rtcManager.clearVideoTrack();
  }

  public closeScreenShare() {
    const userKey = storage.getItem('userKey');
    this._dispatch.sendScreenDisconnectMessage({
      userKey,
    });
    this.rtcManager.clearVideoTrack();
    this.screenMediaStream = undefined;
  }
}
