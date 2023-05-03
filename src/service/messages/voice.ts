import {
  CATEGORY,
  MESSAGE_TYPE,
  ProtocolData,
  VOICE_MESSAGE_ID,
} from '../../constants/protocol';
import { CreateProtocolFunctionParam, createProtocolMessage } from './index';

export const voiceProtocolMessage = (protocol: CreateProtocolFunctionParam) => {
  const protocolMessage = createProtocolMessage(CATEGORY.VOICE);
  return protocolMessage(protocol);
};

export const voiceJoinMessage = (data: ProtocolData) => {
  return voiceProtocolMessage({
    messageId: VOICE_MESSAGE_ID.JOIN,
    messageType: MESSAGE_TYPE.RTC,
    data,
  });
};

export const voiceStartMessage = (data: ProtocolData) => {
  return voiceProtocolMessage({
    messageId: VOICE_MESSAGE_ID.START,
    messageType: MESSAGE_TYPE.RTC,
    data,
  });
};

export const voiceDisconnectMessage = (data: ProtocolData) => {
  return voiceProtocolMessage({
    messageId: VOICE_MESSAGE_ID.DISCONNECT,
    messageType: MESSAGE_TYPE.RTC,
    data,
  });
};
