import { CATEGORY, Protocol } from '../../constants/protocol';

export const createProtocolMessage = (category: CATEGORY) => {
  return ({ data, messageId, messageType }: Omit<Protocol, 'category'>) => {
    const protocol: Protocol = {
      category,
      messageId,
      data,
      messageType,
    };

    return protocol;
  };
};
