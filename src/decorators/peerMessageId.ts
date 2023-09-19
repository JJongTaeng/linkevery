import { MessageId } from '../constants/peerEvent';

export function peerMessageId(message: MessageId) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata(target.constructor.name, message, target, key);
  };
}
