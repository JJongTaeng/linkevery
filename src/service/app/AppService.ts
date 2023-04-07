import { DispatchEvent } from './../dispatch/DispatchEvent';
import { Socket } from 'socket.io-client';
export abstract class AppService {
  public abstract getSocket(): Socket;
  public abstract getDispatch(): DispatchEvent;
  public abstract connectSocket(): void;
}
