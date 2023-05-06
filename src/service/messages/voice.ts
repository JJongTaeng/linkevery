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

export const voiceReadyMessage = (data: ProtocolData) => {
  return voiceProtocolMessage({
    messageId: VOICE_MESSAGE_ID.READY,
    messageType: MESSAGE_TYPE.RTC,
    data,
  });
};

export const voiceReadyOkMessage = (data: ProtocolData) => {
  return voiceProtocolMessage({
    messageId: VOICE_MESSAGE_ID.READY_OK,
    messageType: MESSAGE_TYPE.RTC,
    data,
  });
};

export const voiceConnectedMessage = (data: ProtocolData) => {
  return voiceProtocolMessage({
    messageId: VOICE_MESSAGE_ID.CONNECTED,
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
