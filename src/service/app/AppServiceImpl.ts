import { RTCManager } from '../rtc/RTCManager';
import { io, Socket } from 'socket.io-client';
import { DispatchEvent } from '../dispatch/DispatchEvent';
import { HandlerManager } from '../handlers/HandlerManager';

export class AppService {
  private socket: Socket = io(process.env.REACT_APP_REQUEST_URL + '/rtc');
  private rtcManager = new RTCManager();
  private dispatch = new DispatchEvent(this.socket, this.rtcManager);
  public static instance: AppService;
  private constructor() {
    new HandlerManager(this.socket, this.rtcManager, this.dispatch);
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new AppService();
    }

    return this.instance;
  }

  public getSocket() {
    return this.socket;
  }

  public getDispatch() {
    return this.dispatch;
  }

  public start() {
    this.dispatch.joinMessage({});
  }
}
