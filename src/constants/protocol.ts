import { DispatchEvent } from '../service/dispatch/DispatchEvent';
import { RTCManagerService } from '../service/rtc/RTCManagerService';

export const EVENT_NAME = 'message';

export enum MESSAGE_TYPE {
  RTC = 'RTC',
  SOCKET = 'SOCKET',
}

export enum CATEGORY {
  CONNECTION = 'CONNECTION',
  SIGNALING = 'SIGNALING',
  CHAT = 'CHAT',
  ROOM = 'ROOM',
  VOICE = 'VOICE',
  SCREEN = 'SCREEN',
  NEGOTIATION = 'NEGOTIATION',
}

export enum CONNECTION_MESSAGE_ID {
  CONNECT = 'CONNECT',
  JOIN_ROOM = 'JOIN_ROOM',
  DISCONNECT = 'DISCONNECT',
}

export enum SIGNALING_MESSAGE_ID {
  START = 'START',
  OFFER = 'OFFER',
  ANSWER = 'ANSWER',
  ICE = 'ICE',
  CREATE_DATA_CHANNEL = 'CREATE_DATA_CHANNEL',
  CONNECT_DATA_CHANNEL = 'CONNECT_DATA_CHANNEL',
}

export enum ROOM_MESSAGE_ID {
  MEMBER_NAME_PRE = 'MEMBER_NAME_PRE',
  MEMBER_NAME = 'MEMBER_NAME',
  MEMBER_NAME_POST = 'MEMBER_NAME_POST',
  SYNC_CHAT_LIST = 'SYNC_CHAT_LIST',
  SYNC_CHAT_LIST_OK = 'SYNC_CHAT_LIST_OK',
}

export enum CHAT_MESSAGE_ID {
  SEND = 'SEND',
  OK = 'OK',
}

export enum VOICE_MESSAGE_ID {
  READY = 'READY',
  READY_OK = 'READY_OK',
  CONNECTED = 'CONNECTED',
  DISCONNECT = 'DISCONNECT',
}

export enum SCREEN_SHARE_MESSAGE_ID {
  READY = 'READY',
  READY_OK = 'READY_OK',
  CONNECTED = 'CONNECTED',
  DISCONNECT = 'DISCONNECT',
}

export enum NEGOTIATION_MESSAGE_ID {
  OFFER = 'OFFER',
  ANSWER = 'ANSWER',
}

export type MessageId =
  | CONNECTION_MESSAGE_ID
  | CHAT_MESSAGE_ID
  | SIGNALING_MESSAGE_ID
  | ROOM_MESSAGE_ID
  | VOICE_MESSAGE_ID
  | NEGOTIATION_MESSAGE_ID
  | SCREEN_SHARE_MESSAGE_ID;

export interface ProtocolData {
  [key: string]: any;
}

export interface Protocol {
  messageType: MESSAGE_TYPE;
  category: CATEGORY;
  messageId: MessageId;
  from: string;
  data: ProtocolData;
}

export type HandlerMap<T extends string | number | symbol> = {
  [key in T]: (
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: {
      dispatch: DispatchEvent;
      rtcManager: RTCManagerService;
    },
  ) => void;
};
