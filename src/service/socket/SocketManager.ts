import { message } from 'antd';
import { io } from 'socket.io-client';
import { singleton } from 'tsyringe';

@singleton()
export class SocketManager {
  socket = io(process.env.REACT_APP_REQUEST_URL + '/rtc');

  constructor() {
    this.socket.on('connect_error', () => {
      message.error('일시적으로 이용이 불가합니다. 잠시 후 다시 이용해주세요.');
    });
  }
}
