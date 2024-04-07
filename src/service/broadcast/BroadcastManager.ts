import { EventType } from '../../constants/eventType.ts';

export class BroadcastManager {
  broadcastChannel: BroadcastChannel = new BroadcastChannel('linkevery');

  send(protocol: EventType) {
    console.debug('%c[send] ', 'color:green;font-weight:bold;', protocol);
    this.broadcastChannel.postMessage(protocol);
  }
}
