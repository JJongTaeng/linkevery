import { CATEGORY, EVENT_NAME, MessageId } from '../constants/localEvent';

export function localAction({
  category,
  messageId,
}: {
  category: CATEGORY;
  messageId: MessageId;
}) {
  return function (target: any, key: string, desc: any): void {
    const originalMethod = desc.value;
    desc.value = function (data: any) {
      const result = originalMethod.apply(this, data);
      this.ee.emit(EVENT_NAME, {
        category: category,
        messageId: messageId,
      });
      return result;
    };
  };
}
