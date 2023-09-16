import { MessageId } from 'constants/protocol';

export function messageId(message: MessageId) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata(target.constructor.name, message, target, key);
  };
}
