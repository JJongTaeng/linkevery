import { Socket } from 'socket.io-client';

export interface SocketManagerService {
  socket: Socket;
}
