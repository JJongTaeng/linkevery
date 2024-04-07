import { inject, injectable, injectAll } from 'tsyringe';
import {
  CATEGORY,
  EVENT_NAME,
  HandlerMap,
  MessageId,
  StringifyProtocol,
} from '../../constants/eventType';
import { SocketManager } from 'service/socket/SocketManager';
import { RTCManager } from 'service/rtc/RTCManager';
import { MessageAssemble } from 'service/messages/MessageAssemble';
import { ERROR_TYPE } from 'error/error';
import { EventManager } from '../event/EventManager';
import { BroadcastManager } from '../broadcast/BroadcastManager.ts';

type CategoryHandlers = { [key in CATEGORY]?: HandlerMap<any> };

@injectable()
export class HandlerManager {
  private messageAssembleMap: Map<string, MessageAssemble> = new Map();
  private handlerMap: CategoryHandlers = {};

  constructor(
    @injectAll('PeerHandler') private handlers: any,
    @inject(SocketManager) private socketManager: SocketManager,
    @inject(RTCManager) private rtcManager: RTCManager,
    @inject(EventManager) private eventManager: EventManager,
    @inject(BroadcastManager) private broadcastManager: BroadcastManager,
  ) {
    this.setHandlers();
    this.subscribe();
  }

  handleHandler(stringifyProtocol: string) {
    const protocol = JSON.parse(stringifyProtocol) as StringifyProtocol;
    const key = protocol.from + protocol.category + protocol.messageId;
    if (!this.messageAssembleMap.has(key))
      this.messageAssembleMap.set(key, new MessageAssemble());
    const messageAssemble = this.messageAssembleMap.get(key);
    messageAssemble?.push(protocol.data);

    if (protocol.index === protocol.endIndex) {
      const dataString = messageAssemble?.getJoinedMessage() ?? '';
      messageAssemble?.clear();
      this.messageAssembleMap.delete(key);
      const parsedData = JSON.parse(dataString);
      const newProtocol = {
        ...protocol,
        data: parsedData,
      };

      try {
        const handler =
          this.handlerMap[protocol.category]?.[protocol.messageId];
        if (!handler) {
          throw new Error(ERROR_TYPE.FAILED_SEND_OFFER);
        }
        console.debug(
          '%c[receive] ',
          'color:blue;font-weight:bold;',
          newProtocol,
        );
        handler(newProtocol);
      } catch (e) {
        console.error(e);
        console.debug('%c[Error] ', 'color:red;font-weight:bold;', newProtocol);
      }
    }
  }

  setHandlers() {
    for (const instance of this.handlers) {
      let methodNames = Object.getOwnPropertyNames(
        Object.getPrototypeOf(instance),
      )
        .filter((prop) => typeof instance[prop] === 'function')
        .filter((name) => name !== 'constructor');

      for (const methodName of methodNames) {
        const category = Reflect.getMetadata(
          methodName,
          instance.constructor,
          'category',
        ) as CATEGORY;
        const messageId = Reflect.getMetadata(
          methodName,
          instance.constructor,
          'messageId',
        ) as MessageId;

        console.debug(
          `[init] category = ${category}, messageId = ${messageId}`,
        );
        const method = instance[methodName].bind(instance);
        if (!this.handlerMap[category]) {
          this.handlerMap[category] = {};
        }
        this.handlerMap[category]![messageId] = method;
      }
    }
  }

  subscribe() {
    this.socketManager.socket.on(EVENT_NAME, (stringifyProtocol: string) => {
      this.handleHandler(stringifyProtocol);
    });
    this.rtcManager.on(
      RTCManager.RTC_EVENT.DATA,
      (stringifyProtocol: string) => {
        this.handleHandler(stringifyProtocol);
      },
    );
    this.eventManager.on(EVENT_NAME, (stringifyProtocol: string) => {
      this.handleHandler(stringifyProtocol);
    });
    console.log(this.broadcastManager);
    this.broadcastManager.broadcastChannel.addEventListener(
      'message',
      (event) => {
        this.handleHandler(event.data);
      },
    );
  }
}
