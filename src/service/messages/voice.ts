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

export const voiceDisconnectMessage = (data: ProtocolData) => {
  return voiceProtocolMessage({
    messageId: VOICE_MESSAGE_ID.DISCONNECT,
    messageType: MESSAGE_TYPE.RTC,
    data,
  });
};
