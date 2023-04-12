import { Socket } from 'socket.io-client';
import { RTCManagerService } from '../rtc/RTCManagerService';
import { DispatchEvent } from './../dispatch/DispatchEvent';
export abstract class AppService {
  abstract readonly dispatch: DispatchEvent;
  abstract readonly rtcManager: RTCManagerService;
  abstract readonly socket: Socket;

  public abstract disconnect(roomName: string): void;
}
