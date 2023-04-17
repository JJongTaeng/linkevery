import {
  CATEGORY,
  MESSAGE_TYPE,
  ProtocolData,
  ROOM_MESSAGE_ID,
} from '../../constants/protocol';
import { CreateProtocolFunctionParam, createProtocolMessage } from './index';

export const roomProtocolMessage = (protocol: CreateProtocolFunctionParam) => {
  const protocolMessage = createProtocolMessage(CATEGORY.ROOM);
  return protocolMessage(protocol);
};

export const requestMemberNameMessage = (data: ProtocolData) => {
  return roomProtocolMessage({
    messageId: ROOM_MESSAGE_ID.REQUEST_MEMBER_NAME,
    messageType: MESSAGE_TYPE.RTC,
    data,
  });
};

export const responseMemberNameMessage = (data: ProtocolData) => {
  return roomProtocolMessage({
    messageId: ROOM_MESSAGE_ID.RESPONSE_MEMBER_NAME,
    messageType: MESSAGE_TYPE.RTC,
    data,
  });
};
