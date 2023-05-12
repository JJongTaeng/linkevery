import { CATEGORY, Protocol } from '../../constants/protocol';
import { storage } from '../storage/StorageService';

export type CreateProtocolFunctionParam = Omit<Protocol, 'category' | 'from'>;

export const createProtocolMessage = (category: CATEGORY) => {
  const clientId = storage.getItem('clientId');
  return ({ data, messageId, messageType }: CreateProtocolFunctionParam) => {
    const protocol: Protocol = {
      category,
      messageId,
      data,
      messageType,
      from: clientId,
    };

    return protocol;
  };
};
