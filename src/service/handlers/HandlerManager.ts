import { Socket } from 'socket.io-client';
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
import { negotiationHandlers } from './negotiationHandlers';
import { roomHandlers } from './roomHandlers';
import { screenShareHandlers } from './screenShareHandlers';
import { signalingHandlers } from './signalingHandlers';
import { voiceHandlers } from './voiceHandlers';

type CategoryHandlers = { [key in CATEGORY]: HandlerMap<any> };

export class HandlerManager {
  private handlers: CategoryHandlers = {
    [CATEGORY.CONNECTION]: connectionHandlers,
    [CATEGORY.SIGNALING]: signalingHandlers,
    [CATEGORY.CHAT]: chatHandlers,
    [CATEGORY.ROOM]: roomHandlers,
    [CATEGORY.VOICE]: voiceHandlers,
    [CATEGORY.NEGOTIATION]: negotiationHandlers,
    [CATEGORY.SCREEN]: screenShareHandlers,
  };
  constructor(
    private socket: Socket,
    private rtcManager: RTCManager,
    private dispatch: DispatchEvent,
  ) {
    this.subscribeHandlers();
  }

  subscribeHandlers() {
    this.socket.on(EVENT_NAME, (protocol: Protocol) => {
      console.debug('%c[receive] ', 'color:blue;font-weight:bold;', protocol);
      try {
        this.handlers[protocol.category][protocol.messageId](protocol, {
          dispatch: this.dispatch,
          rtcManager: this.rtcManager,
        });
      } catch (e) {
        console.debug('%c[Error] ', 'color:red;font-weight:bold;', protocol);
      }
    });
    this.rtcManager.on(RTCManager.RTC_EVENT.DATA, (protocol: Protocol) => {
      console.debug('%c[receive] ', 'color:blue;font-weight:bold;', protocol);
      try {
        this.handlers[protocol.category][protocol.messageId](protocol, {
          dispatch: this.dispatch,
          rtcManager: this.rtcManager,
        });
      } catch (e) {
        console.debug('%c[Error] ', 'color:red;font-weight:bold;', protocol);
      }
    });
  }
}
