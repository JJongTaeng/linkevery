import { MessageId } from '../constants/eventType';

export function messageId(message: MessageId) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata(target.constructor.name, message, target, key);
  };
}
