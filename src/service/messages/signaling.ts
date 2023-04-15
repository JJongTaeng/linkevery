import {
  CATEGORY,
  MESSAGE_TYPE,
  Protocol,
  ProtocolData,
  SIGNALING_MESSAGE_ID,
} from '../../constants/protocol';
import { createProtocolMessage } from './index';

export const signalingProtocolMessage = (
  protocol: Omit<Protocol, 'category'>,
) => {
  const protocolMessage = createProtocolMessage(CATEGORY.SIGNALING);
  return protocolMessage(protocol);
};

export const offerMessage = (data: ProtocolData) => {
  return signalingProtocolMessage({
    messageId: SIGNALING_MESSAGE_ID.OFFER,
    messageType: MESSAGE_TYPE.SOCKET,
    data,
  });
};

export const answerMessage = (data: ProtocolData) => {
  return signalingProtocolMessage({
    messageId: SIGNALING_MESSAGE_ID.ANSWER,
    messageType: MESSAGE_TYPE.SOCKET,
    data,
  });
};

export const iceMessage = (data: ProtocolData) => {
  return signalingProtocolMessage({
    messageId: SIGNALING_MESSAGE_ID.ICE,
    messageType: MESSAGE_TYPE.SOCKET,
    data,
  });
};

export const createDataChannelMessage = (data: ProtocolData) => {
  return signalingProtocolMessage({
    messageId: SIGNALING_MESSAGE_ID.CREATE_DATA_CHANNEL,
    messageType: MESSAGE_TYPE.RTC,
    data,
  });
};
