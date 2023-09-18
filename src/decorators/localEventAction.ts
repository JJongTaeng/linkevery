import { LocalAction } from '../constants/localEvent';

export function localEventAction(type: LocalAction) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata(target.constructor.name, type, target, key);
  };
}
