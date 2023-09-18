import { LocalAction, LocalFeature } from '../constants/localEvent';

export function localEventFeature(name: LocalFeature) {
  return function (target: any) {
    for (const methodName of Object.getOwnPropertyNames(target.prototype)) {
      if (methodName === 'constructor') continue;

      const type = Reflect.getMetadata(
        target.name,
        target.prototype,
        methodName,
      ) as LocalAction;

      Reflect.defineMetadata(methodName, name, target, 'feature');
      Reflect.defineMetadata(methodName, type, target, 'action');
    }
  };
}
