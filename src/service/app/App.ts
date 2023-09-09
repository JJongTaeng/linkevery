import { roomActions } from '../../store/features/roomSlice';
import { userActions } from '../../store/features/userSlice';
import { store } from '../../store/store';
import { DispatchEvent } from '../dispatch/DispatchEvent';
import { HandlerManager } from '../handlers/HandlerManager';
import { audioManager } from '../media/AudioManager';
import { RTCManager } from '../rtc/RTCManager';
import { storage } from '../storage/StorageService';
import { container, inject, injectable, singleton } from 'tsyringe';

@singleton()
export class App {
  screenMediaStream?: MediaStream;

  constructor(
    @inject(DispatchEvent) private _dispatch: DispatchEvent,
    @inject(RTCManager) private _rtcManager: RTCManager,
  ) {
    container.resolve(HandlerManager);
  }

  get dispatch() {
    return this._dispatch;
  }

  static getInstance(): any {}

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
    audioManager.removeAllAudio();
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
