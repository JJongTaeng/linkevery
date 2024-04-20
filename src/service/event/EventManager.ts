import EventEmitter from 'events';
import { EVENT_NAME, EventType } from 'constants/eventType';
import { storage } from 'service/storage/StorageService.ts';

export class EventManager extends EventEmitter {
  send(protocol: EventType) {
    const clientId = storage.getItem('clientId');

    console.debug(
      `%c[send] to = me`,
      'color:green;font-weight:bold;',
      protocol,
    );
    this.emit(EVENT_NAME, { ...protocol, from: clientId });
  }
}
