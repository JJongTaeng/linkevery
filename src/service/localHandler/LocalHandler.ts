import { inject, injectable, injectAll } from 'tsyringe';
import { CATEGORY, EVENT_NAME, MessageId } from '../../constants/localEvent';
import EventEmitter from 'events';
import { ERROR_TYPE } from '../../error/error';

type HandlerMap = {
  [key in CATEGORY]?: { [key in MessageId]?: Function };
};
@injectable()
export class LocalHandler {
  private handlerMap: HandlerMap = {};
  constructor(
    @injectAll('LocalHandler') private localHandlers: any,
    @inject('ee') private ee: EventEmitter,
  ) {
    this.setHandler();
    this.subscribe();
  }

  setHandler() {
    for (const instance of this.localHandlers) {
      let methodNames = Object.getOwnPropertyNames(
        Object.getPrototypeOf(instance),
      )
        .filter((prop) => typeof instance[prop] === 'function')
        .filter((name) => name !== 'constructor');

      for (const methodName of methodNames) {
        const method = instance[methodName].bind(instance);
        const feature = Reflect.getMetadata(
          methodName,
          instance.constructor,
          'category',
        ) as CATEGORY;
        const action = Reflect.getMetadata(
          methodName,
          instance.constructor,
          'messageId',
        ) as MessageId;

        if (!this.handlerMap[feature]) {
          this.handlerMap[feature] = {};
        }
        this.handlerMap[feature]![action] = method;
      }
    }
  }

  subscribe() {
    this.ee.on(
      EVENT_NAME,
      ({
        category,
        messageId,
      }: {
        category: CATEGORY;
        messageId: MessageId;
      }) => {
        const handler = this.handlerMap[category]?.[messageId];
        if (!handler) {
          throw new Error(
            `${ERROR_TYPE.NOT_DEFINED_HANDLER} ${category} ${messageId}`,
          );
        }
        handler();
      },
    );
  }
}
