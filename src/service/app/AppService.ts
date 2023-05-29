import { Socket } from 'socket.io-client';
import { RTCManagerService } from '../rtc/RTCManagerService';
import { DispatchEvent } from './../dispatch/DispatchEvent';
export interface AppService {
  dispatch: DispatchEvent;
  rtcManager: RTCManagerService;
  socket: Socket;
  disconnect(roomName: string): void;
}
