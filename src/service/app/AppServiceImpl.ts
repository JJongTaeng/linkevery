import { io, Socket } from 'socket.io-client';
import { roomActions } from '../../store/features/roomSlice';
import { userActions } from '../../store/features/userSlice';
import { store } from '../../store/store';
import { DispatchEvent } from '../dispatch/DispatchEvent';
import { HandlerManager } from '../handlers/HandlerManager';
import { audioManager } from '../media/AudioManager';
import { RTCManager } from '../rtc/RTCManager';
import { storage } from '../storage/StorageService';
import { AppService } from './AppService';

export class AppServiceImpl extends AppService {
  readonly socket: Socket = io(process.env.REACT_APP_REQUEST_URL + '/rtc');
  readonly rtcManager = new RTCManager();
  readonly dispatch = new DispatchEvent(this.socket, this.rtcManager);

  public static instance: AppServiceImpl;
  private constructor() {
    super();
    new HandlerManager(this.socket, this.rtcManager, this.dispatch);

    window.debug = {
      rtcManager: this.rtcManager,
    };
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new AppServiceImpl();
    }

    return this.instance;
  }

  public disconnect() {
    const roomName = storage.getItem('roomName');
    store.dispatch(roomActions.leaveRoom());
    store.dispatch(userActions.changeVoiceStatus(false));
    this.dispatch.sendDisconnectMessage({ roomName });
    this.rtcManager.clearPeerMap();
  }

  public disconnectVoice() {
    const userKey = storage.getItem('userKey');

    this.dispatch.sendVoiceDisconnectMessage({ userKey });
    this.rtcManager.clearAudioTrack();
    audioManager.removeAllAudio();
    this.rtcManager.clearVideoTrack();
  }

  public closeScreenShare() {
    const userKey = storage.getItem('userKey');
    this.dispatch.sendScreenShareDisconnectMessage({
      userKey,
    });
    this.rtcManager.clearVideoTrack();
  }
}
