import { Socket } from 'socket.io-client';
import { roomActions } from '../../store/features/roomSlice';
import { userActions } from '../../store/features/userSlice';
import { store } from '../../store/store';
import { DispatchEvent } from '../dispatch/DispatchEvent';
import { HandlerManager } from '../handlers/HandlerManager';
import { audioManager } from '../media/AudioManager';
import { rtcManager } from '../rtc/RTCManager';
import { socketManager } from '../socket/SocketManager';
import { storage } from '../storage/StorageService';
import { AppService } from './AppService';

export class App implements AppService {
  readonly socket: Socket = socketManager.socket;
  readonly rtcManager = rtcManager;
  readonly dispatch = new DispatchEvent();
  screenMediaStream?: MediaStream;

  public static instance: App;
  private constructor() {
    new HandlerManager(this.socket, this.rtcManager, this.dispatch);

    window.debug = {
      rtcManager: this.rtcManager,
    };
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new App();
    }

    return this.instance;
  }

  public disconnect() {
    const roomName = storage.getItem('roomName');
    store.dispatch(roomActions.leaveRoom());
    store.dispatch(userActions.changeVoiceStatus(false));
    this.dispatch.sendConnectionDisconnectMessage({ roomName });
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
    this.dispatch.sendScreenDisconnectMessage({
      userKey,
    });
    this.rtcManager.clearVideoTrack();
  }
}
