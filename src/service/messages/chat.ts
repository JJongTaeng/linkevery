import {
  CATEGORY,
  CHAT_MESSAGE_ID,
  MESSAGE_TYPE,
  ProtocolData,
} from '../../constants/protocol';
import { CreateProtocolFunctionParam, createProtocolMessage } from './index';

export const chatProtocolMessage = (protocol: CreateProtocolFunctionParam) => {
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
