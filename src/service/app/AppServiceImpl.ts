import { RTCManager } from '../rtc/RTCManager';
import { io, Socket } from 'socket.io-client';
import { DispatchEvent } from '../dispatch/DispatchEvent';
import { HandlerManager } from '../handlers/HandlerManager';
import { AppService } from './AppService';

export class AppServiceImpl extends AppService {
  readonly socket: Socket = io(process.env.REACT_APP_REQUEST_URL + '/rtc');
  readonly rtcManager = new RTCManager();
  readonly dispatch = new DispatchEvent(this.socket, this.rtcManager);
  public static instance: AppServiceImpl;
  private constructor() {
    super();
    new HandlerManager(this.socket, this.rtcManager, this.dispatch);
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new AppServiceImpl();
    }

    return this.instance;
  }
}
