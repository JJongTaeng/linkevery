import {
  CATEGORY,
  MESSAGE_TYPE,
  ProtocolData,
  SCREEN_SHARE_MESSAGE_ID,
} from '../../constants/protocol';
import { CreateProtocolFunctionParam, createProtocolMessage } from './index';

export const screenShareProtocolMessage = (
  protocol: CreateProtocolFunctionParam,
) => {
  const protocolMessage = createProtocolMessage(CATEGORY.SCREEN_SHARE);
  return protocolMessage(protocol);
};

export const screenShareJoinMessage = (data: ProtocolData) => {
  return screenShareProtocolMessage({
    messageId: SCREEN_SHARE_MESSAGE_ID.JOIN,
    messageType: MESSAGE_TYPE.SOCKET,
    data,
  });
};

export const screenShareOfferMessage = (data: ProtocolData) => {
  return screenShareProtocolMessage({
    messageId: SCREEN_SHARE_MESSAGE_ID.OFFER,
    messageType: MESSAGE_TYPE.SOCKET,
    data,
  });
};

export const screenShareAnswerMessage = (data: ProtocolData) => {
  return screenShareProtocolMessage({
    messageId: SCREEN_SHARE_MESSAGE_ID.ANSWER,
    messageType: MESSAGE_TYPE.SOCKET,
    data,
  });
};

export const screenShareIceMessage = (data: ProtocolData) => {
  return screenShareProtocolMessage({
    messageId: SCREEN_SHARE_MESSAGE_ID.ICE,
    messageType: MESSAGE_TYPE.SOCKET,
    data,
  });
};

export const screenShareDisconnectMessage = (data: ProtocolData) => {
  return screenShareProtocolMessage({
    messageId: SCREEN_SHARE_MESSAGE_ID.DISCONNECT,
    messageType: MESSAGE_TYPE.RTC,
    data,
  });
};
