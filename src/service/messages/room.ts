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

export const memberNamePreMessage = (data: ProtocolData) => {
  return roomProtocolMessage({
    messageId: ROOM_MESSAGE_ID.MEMBER_NAME_PRE,
    messageType: MESSAGE_TYPE.RTC,
    data,
  });
};

export const memberNameMessage = (data: ProtocolData) => {
  return roomProtocolMessage({
    messageId: ROOM_MESSAGE_ID.MEMBER_NAME,
    messageType: MESSAGE_TYPE.RTC,
    data,
  });
};

export const memberNameOkMessage = (data: ProtocolData) => {
  return roomProtocolMessage({
    messageId: ROOM_MESSAGE_ID.MEMBER_NAME_POST,
    messageType: MESSAGE_TYPE.RTC,
    data,
  });
};

export const syncChatListMessage = (data: ProtocolData) => {
  return roomProtocolMessage({
    messageId: ROOM_MESSAGE_ID.SYNC_CHAT_LIST,
    messageType: MESSAGE_TYPE.RTC,
    data,
  });
};

export const syncChatListOkMessage = (data: ProtocolData) => {
  return roomProtocolMessage({
    messageId: ROOM_MESSAGE_ID.SYNC_CHAT_LIST_OK,
    messageType: MESSAGE_TYPE.RTC,
    data,
  });
};
