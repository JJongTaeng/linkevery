import { CATEGORY, MessageId } from '../constants/peerEvent';
import { storage } from 'service/storage/StorageService';

export function socketAction({
  category,
  messageId,
}: {
  category: CATEGORY;
  messageId: MessageId;
}) {
  return function (target: any, key: string, desc: any): void {
    const originalMethod = desc.value;
    desc.value = function (data: any) {
      const clientId = storage.getItem('clientId');
      const result = originalMethod.apply(this, data);
      this.sender.send({
        category,
        messageId,
        data,
        messageType: 'SOCKET',
        from: clientId,
      });
      return result;
    };
  };
}
