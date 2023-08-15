import { Socket } from 'socket.io-client';
import {
  CATEGORY,
  EVENT_NAME,
  HandlerMap,
  Protocol,
  StringifyProtocol,
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
  private dataQueue: { [key: string]: string[] } = {};
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
    this.rtcManager.on(
      RTCManager.RTC_EVENT.DATA,
      (protocol: StringifyProtocol) => {
        const key = protocol.from + protocol.category + protocol.messageId;
        if (!this.dataQueue[key]) this.dataQueue[key] = [];
        this.dataQueue[key][protocol.index] = protocol.data;
        if (protocol.index === protocol.endIndex) {
          const dataString = this.dataQueue[key].join('');
          this.dataQueue[key] = [];
          const parsedData = JSON.parse(dataString);
          const newProtocol = {
            ...protocol,
            data: parsedData,
          };
          console.debug(
            '%c[receive] ',
            'color:blue;font-weight:bold;',
            newProtocol,
          );

          this.handlers[protocol.category][protocol.messageId](newProtocol, {
            dispatch: this.dispatch,
            rtcManager: this.rtcManager,
          });
        }
        try {
        } catch (e) {
          console.debug('%c[Error] ', 'color:red;font-weight:bold;', protocol);
        }
      },
    );
  }
}
