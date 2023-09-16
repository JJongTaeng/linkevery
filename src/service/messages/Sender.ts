import { EVENT_NAME, MESSAGE_TYPE, Protocol } from 'constants/protocol';
import { RTCManager } from 'service/rtc/RTCManager';
import { SocketManager } from 'service/socket/SocketManager';
import { inject, injectable } from 'tsyringe';

@injectable()
export class Sender {
  constructor(
    @inject(SocketManager) private socketManager: SocketManager,
    @inject(RTCManager) private rtcManager: RTCManager,
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
