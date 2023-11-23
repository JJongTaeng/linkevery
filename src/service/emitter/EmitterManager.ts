import { inject, injectable } from 'tsyringe';
import { SocketManager } from '../socket/SocketManager';
import { RTCManager } from '../rtc/RTCManager';
import { EventManager } from '../event/EventManager';
import { EventType, MESSAGE_TYPE } from '../../constants/eventType';
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
        this.rtcManager.send(protocol);
        break;
      case MESSAGE_TYPE.SOCKET:
        this.socketManager.send(protocol);
        break;
      case MESSAGE_TYPE.EVENT:
        this.eventManager.send(protocol);
        break;
    }
  }
}
