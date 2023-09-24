import { MessageId } from '../constants/localEvent';

export function localMessageId(message: MessageId) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata(target.constructor.name, message, target, key);
  };
}
