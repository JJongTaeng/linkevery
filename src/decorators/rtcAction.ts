import { CATEGORY, MESSAGE_TYPE, MessageId } from '../constants/eventType';

export function rtcAction({
  category,
  messageId,
}: {
  category: CATEGORY;
  messageId: MessageId;
}) {
  return function (target: any, key: string, desc: any): void {
    const originalMethod = desc.value;
    desc.value = function (data: any) {
      try {
        const result = originalMethod.apply(this, data);
        this.sender.send({
          category,
          messageId,
          data,
          messageType: MESSAGE_TYPE.RTC,
        });
        return result;
      } catch (e) {
        console.error('[rtcAction error]', e);
      }
    };
  };
}
