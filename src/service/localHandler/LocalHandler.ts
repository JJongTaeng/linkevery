import { inject, injectable, injectAll } from 'tsyringe';
import {
  EVENT_NAME,
  LocalAction,
  LocalFeature,
} from '../../constants/localEvent';
import EventEmitter from 'events';
import { ERROR_TYPE } from '../../error/error';

type HandlerMap = {
  [key in LocalFeature]?: { [key in LocalAction]?: Function };
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
          'feature',
        ) as LocalFeature;
        const action = Reflect.getMetadata(
          methodName,
          instance.constructor,
          'action',
        ) as LocalAction;

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
      ({ feature, action }: { feature: LocalFeature; action: LocalAction }) => {
        const handler = this.handlerMap[feature]?.[action];
        if (!handler) {
          throw new Error(ERROR_TYPE.NOT_DEFINED_HANDLER);
        }
        handler();
      },
    );
  }
}
