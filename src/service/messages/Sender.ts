import { EVENT_NAME, MESSAGE_TYPE, Protocol } from '../../constants/protocol';
import { RTCManager } from '../rtc/RTCManager';
import { SocketManagerService } from '../socket/SocketManagerService';

interface SenderService {
  send(protocol: Protocol): void;
}

export class Sender implements SenderService {
  constructor(
    private socketManager: SocketManagerService,
    private rtcManager: RTCManager,
  ) {}

  send(protocol: Protocol) {
    if (protocol.messageType === MESSAGE_TYPE.SOCKET) {
      console.debug('%c[send] ', 'color:green;font-weight:bold;', protocol);
      this.socketManager.socket.emit(EVENT_NAME, protocol);
    } else if (protocol.messageType === MESSAGE_TYPE.RTC) {
      console.debug('%c[send] ', 'color:green;font-weight:bold;', protocol);
      const { to } = protocol.data;
      if (to) {
        try {
          this.rtcManager.sendTo(protocol);
        } catch (e) {
          this.send({ ...protocol, messageType: MESSAGE_TYPE.SOCKET });
        }
      } else {
        try {
          this.rtcManager.sendAll(protocol);
        } catch (e) {
          this.send({ ...protocol, messageType: MESSAGE_TYPE.SOCKET });
        }
      }
    }
  }
}
