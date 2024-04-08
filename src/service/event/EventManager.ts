import EventEmitter from 'events';
import { EVENT_NAME, EventType } from '../../constants/eventType';

export class EventManager extends EventEmitter {
  send(protocol: EventType) {
    console.debug('%c[send] ', 'color:green;font-weight:bold;', protocol);
    this.emit(EVENT_NAME, protocol);
  }
}
