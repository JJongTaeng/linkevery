import { io, Socket } from 'socket.io-client';
import { roomActions } from '../../store/features/roomSlice';
import { voiceActions } from '../../store/features/voliceSlice';
import { store } from '../../store/store';
import { DispatchEvent } from '../dispatch/DispatchEvent';
import { HandlerManager } from '../handlers/HandlerManager';
import { RTCManager } from '../rtc/RTCManager';
import { RTCScreenShareManager } from '../rtc/RTCScreenShareManager';
import { StorageService } from '../storage/StorageService';
import { AppService } from './AppService';

const storage = StorageService.getInstance();
export class AppServiceImpl extends AppService {
  readonly socket: Socket = io(process.env.REACT_APP_REQUEST_URL + '/rtc');
  readonly rtcManager = new RTCManager();
  readonly rtcScreenShareManager = new RTCScreenShareManager();
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
    store.dispatch(voiceActions.changeStatus(false));
    this.dispatch.sendDisconnectMessage({ roomName });
    this.rtcManager.clearPeerMap();
  }

  public disconnectVoice() {
    this.dispatch.sendVoiceDisconnectMessage({});
    this.rtcManager.clearTrack();
  }
}
