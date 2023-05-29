import { io } from 'socket.io-client';

class SocketManager {
  socket = io(process.env.REACT_APP_REQUEST_URL + '/rtc');
}

export const socketManager = new SocketManager();
