import { EVENT_NAME, LocalAction, LocalFeature } from '../constants/localEvent';

export function localAction({
  feature,
  action,
}: {
  feature: LocalFeature;
  action: LocalAction;
}) {
  return function (target: any, key: string, desc: any): void {
    const originalMethod = desc.value;
    desc.value = function (data: any) {
      const result = originalMethod.apply(this, data);
      this.ee.emit(EVENT_NAME, {
        feature,
        action,
      });
      return result;
    };
  };
}
