import { inject, injectable, injectAll } from 'tsyringe';
import {
  CATEGORY,
  EVENT_NAME,
  HandlerMap,
  MessageId,
  Protocol,
  StringifyProtocol,
} from '../../constants/protocol';
import { SocketManager } from '../socket/SocketManager';
import { RTCManager } from '../rtc/RTCManager';
import { DispatchEvent } from '../dispatch/DispatchEvent';
import { MessageAssemble } from '../messages/MessageAssemble';
import { ERROR_TYPE } from '../../error/error';
import { HandlerManagerInterface } from './HandlerManagerInterface';

type CategoryHandlers = { [key in CATEGORY]?: HandlerMap<any> };

@injectable()
export class HandlerManagerV2 implements HandlerManagerInterface {
  private messageAssembleMap: Map<string, MessageAssemble> = new Map();
  private handlerMap: CategoryHandlers = {};
  constructor(
    @injectAll('Handler') private handlers: any,
    @inject(SocketManager) private socketManager: SocketManager,
    @inject(RTCManager) private rtcManager: RTCManager,
    @inject(DispatchEvent) private dispatch: DispatchEvent,
  ) {
    this.setHandlers();
    this.subscribe();
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
        const method = Reflect.getMetadata(
          methodName,
          instance.constructor,
          'method',
        );
        if (!this.handlerMap[category]) {
          this.handlerMap[category] = {};
        }
        this.handlerMap[category]![messageId] = method;
      }
    }
  }

  subscribe() {
    this.socketManager.socket.on(EVENT_NAME, (protocol: Protocol) => {
      const handler = this.handlerMap[protocol.category]?.[protocol.messageId];
      if (!handler) {
        throw new Error(
          ERROR_TYPE.NOT_DEFINED_HANDLER +
            `category = ${protocol.category} messageId = ${protocol.messageId}`,
        );
      }
      try {
        handler(protocol, {
          dispatch: this.dispatch,
          rtcManager: this.rtcManager,
        });
        console.debug('%c[receive] ', 'color:blue;font-weight:bold;', protocol);
      } catch (e) {
        console.debug('%c[Error] ', 'color:red;font-weight:bold;', protocol);
      }
    });
    this.rtcManager.on(
      RTCManager.RTC_EVENT.DATA,
      (protocol: StringifyProtocol) => {
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
            handler(newProtocol, {
              dispatch: this.dispatch,
              rtcManager: this.rtcManager,
            });

            console.debug(
              '%c[receive] ',
              'color:blue;font-weight:bold;',
              newProtocol,
            );
          } catch (e) {
            console.debug(
              '%c[Error] ',
              'color:red;font-weight:bold;',
              protocol,
            );
          }
        }
      },
    );
  }
}
