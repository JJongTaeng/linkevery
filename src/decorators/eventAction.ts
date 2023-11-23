import { CATEGORY, MESSAGE_TYPE, MessageId } from '../constants/eventType';

export function eventAction({
  category,
  messageId,
}: {
  category: CATEGORY;
  messageId: MessageId;
}) {
  return function (target: any, key: string, desc: any): void {
    const originalMethod = desc.value;
    desc.value = function (data: any = {}) {
      const result = originalMethod.apply(this, data);
      this.sender.send({
        category: category,
        messageId: messageId,
        data,
        messageType: MESSAGE_TYPE.EVENT,
      });
      return result;
    };
  };
}
