import {
  CATEGORY,
  CHAT_MESSAGE_ID,
  MESSAGE_TYPE,
  Protocol,
  ProtocolData,
} from '../../constants/protocol';
import { createProtocolMessage } from './index';

export const chatProtocolMessage = (protocol: Omit<Protocol, 'category'>) => {
  const protocolMessage = createProtocolMessage(CATEGORY.CHAT);
  return protocolMessage(protocol);
};

export const chatMessage = (data: ProtocolData) => {
  return chatProtocolMessage({
    messageId: CHAT_MESSAGE_ID.SEND,
    messageType: MESSAGE_TYPE.RTC,
    data,
  });
};
