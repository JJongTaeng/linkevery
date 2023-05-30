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
  const protocolMessage = createProtocolMessage(CATEGORY.SCREEN);
  return protocolMessage(protocol);
};

export const screenShareReadyMessage = (data: ProtocolData) => {
  return screenShareProtocolMessage({
    messageId: SCREEN_SHARE_MESSAGE_ID.READY,
    messageType: MESSAGE_TYPE.RTC,
    data,
  });
};

export const screenShareReadyOkMessage = (data: ProtocolData) => {
  return screenShareProtocolMessage({
    messageId: SCREEN_SHARE_MESSAGE_ID.READY_OK,
    messageType: MESSAGE_TYPE.RTC,
    data,
  });
};

export const screenShareConnectedMessage = (data: ProtocolData) => {
  return screenShareProtocolMessage({
    messageId: SCREEN_SHARE_MESSAGE_ID.CONNECTED,
    messageType: MESSAGE_TYPE.RTC,
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
