import { CATEGORY } from 'constants/protocol';

export function category(category: CATEGORY) {
  return function (target: any) {
    for (const methodName of Object.getOwnPropertyNames(target.prototype)) {
      if (methodName === 'constructor') continue;

      const message = Reflect.getMetadata(
        target.name,
        target.prototype,
        methodName,
      );

      Reflect.defineMetadata(methodName, category, target, 'category');
      Reflect.defineMetadata(methodName, message, target, 'messageId');
    }
  };
}
