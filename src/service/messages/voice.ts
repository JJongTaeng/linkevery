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
    messageType: MESSAGE_TYPE.SOCKET,
    data,
  });
};

export const voiceOfferMessage = (data: ProtocolData) => {
  return voiceProtocolMessage({
    messageId: VOICE_MESSAGE_ID.OFFER,
    messageType: MESSAGE_TYPE.SOCKET,
    data,
  });
};

export const voiceAnswerMessage = (data: ProtocolData) => {
  return voiceProtocolMessage({
    messageId: VOICE_MESSAGE_ID.ANSWER,
    messageType: MESSAGE_TYPE.SOCKET,
    data,
  });
};

export const voiceIceMessage = (data: ProtocolData) => {
  return voiceProtocolMessage({
    messageId: VOICE_MESSAGE_ID.ICE,
    messageType: MESSAGE_TYPE.SOCKET,
    data,
  });
};
