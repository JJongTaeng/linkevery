import { inject, injectable } from 'tsyringe';
import { SocketManager } from '../socket/SocketManager';
import { RTCManager } from '../rtc/RTCManager';
import { EventManager } from '../event/EventManager';
import { EventType, MESSAGE_TYPE } from '../../constants/eventType';
import { EmitterService } from './EmitterService';
import { BroadcastManager } from '../broadcast/BroadcastManager.ts';

@injectable()
export class EmitterManager implements EmitterService {
  constructor(
    @inject(SocketManager) private socketManager: SocketManager,
    @inject(RTCManager) private rtcManager: RTCManager,
    @inject(EventManager) private eventManager: EventManager,
    @inject(BroadcastManager) private broadcastManager: BroadcastManager,
  ) {}

  send(protocol: EventType) {
    switch (protocol.messageType) {
      case MESSAGE_TYPE.RTC:
        try {
          this.rtcManager.send(protocol);
        } catch (e) {
          this.socketManager.send(protocol);
        }
        break;
      case MESSAGE_TYPE.SOCKET:
        this.socketManager.send(protocol);
        break;
      case MESSAGE_TYPE.EVENT:
        this.eventManager.send(protocol);
        break;
      case MESSAGE_TYPE.BROADCAST:
        this.broadcastManager.send(protocol);
        break;
      default:
        throw new Error('Invalid message type = ' + protocol.messageType);
    }
  }
}
