import { createProtocolMessage } from '.';
import {
  CATEGORY,
  CONNECTION_MESSAGE_ID,
  MESSAGE_TYPE,
  Protocol,
  ProtocolData,
} from '../../constants/protocol';

export const connectionProtocolMessage = (
  protocol: Omit<Protocol, 'category'>,
) => {
  const protocolMessage = createProtocolMessage(CATEGORY.CONNECTION);
  return protocolMessage(protocol);
};

export const connectMessage = (data: ProtocolData) => {
  return connectionProtocolMessage({
    messageId: CONNECTION_MESSAGE_ID.CONNECT,
    messageType: MESSAGE_TYPE.SOCKET,
    data,
  });
};

export const joinRoomMessage = (data: ProtocolData) => {
  return connectionProtocolMessage({
    messageId: CONNECTION_MESSAGE_ID.JOIN_ROOM,
    messageType: MESSAGE_TYPE.SOCKET,
    data,
  });
};

export const disconnectMessage = (data: ProtocolData) => {
  return connectionProtocolMessage({
    messageId: CONNECTION_MESSAGE_ID.DISCONNECT,
    messageType: MESSAGE_TYPE.SOCKET,
    data,
  });
};
