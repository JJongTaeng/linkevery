import { Socket } from 'socket.io-client';
import { EventEmitter } from 'stream';
import {
  CATEGORY,
  EVENT_NAME,
  HandlerMap,
  Protocol,
} from '../../constants/protocol';
import { DispatchEvent } from '../dispatch/DispatchEvent';
import { RTCManager } from '../rtc/RTCManager';
import { chatHandlers } from './chatHandlers';
import { connectionHandlers } from './connectionHandlers';
import { roomHandlers } from './roomHandlers';
import { signalingHandlers } from './signalingHandlers';

type CategoryHandlers = { [key in CATEGORY]: HandlerMap<any> };

export class HandlerManager {
  private handlers: CategoryHandlers = {
    [CATEGORY.CONNECTION]: connectionHandlers,
    [CATEGORY.SIGNALING]: signalingHandlers,
    [CATEGORY.CHAT]: chatHandlers,
    [CATEGORY.ROOM]: roomHandlers,
  };
  constructor(
    private socket: Socket,
    private rtcManager: RTCManager,
    private dispatch: DispatchEvent,
    private ee: EventEmitter,
  ) {
    this.subscribeHandlers();
  }

  subscribeHandlers() {
    this.socket.on(EVENT_NAME, (protocol: Protocol) => {
      console.debug('[receive] ', protocol);
      this.handlers[protocol.category][protocol.messageId](protocol, {
        dispatch: this.dispatch,
        rtcManager: this.rtcManager,
        ee: this.ee,
      });
    });
    this.rtcManager.on(RTCManager.RTC_EVENT.DATA, (protocol: Protocol) => {
      console.debug('[receive] ', protocol);
      this.handlers[protocol.category][protocol.messageId](protocol, {
        dispatch: this.dispatch,
        rtcManager: this.rtcManager,
        ee: this.ee,
      });
    });
  }
}
