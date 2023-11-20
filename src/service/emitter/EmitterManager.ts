import { inject, injectable } from 'tsyringe';
import { SocketManager } from '../socket/SocketManager';
import { RTCManager } from '../rtc/RTCManager';
import { EventManager } from '../event/EventManager';
import { EVENT_NAME, MESSAGE_TYPE, EventType } from '../../constants/eventType';
import { EmitterService } from './EmitterService';

@injectable()
export class EmitterManager implements EmitterService {
  constructor(
    @inject(SocketManager) private socketManager: SocketManager,
    @inject(RTCManager) private rtcManager: RTCManager,
    @inject(EventManager) private eventManager: EventManager,
  ) {}

  send(protocol: EventType) {
    switch (protocol.messageType) {
      case MESSAGE_TYPE.RTC:
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
        break;
      case MESSAGE_TYPE.SOCKET:
        console.debug('%c[send] ', 'color:green;font-weight:bold;', protocol);
        this.socketManager.socket.emit(EVENT_NAME, protocol);
        break;
      case MESSAGE_TYPE.EVENT:
        this.eventManager.emit(EVENT_NAME, protocol);
        break;
    }
  }
}
