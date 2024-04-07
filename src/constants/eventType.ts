export const EVENT_NAME = 'message';

export enum MESSAGE_TYPE {
  RTC = 'RTC',
  SOCKET = 'SOCKET',
  EVENT = 'EVENT',
  BROADCAST = 'BROADCAST',
}

export enum CATEGORY {
  CONNECTION = 'CONNECTION',
  SIGNALING = 'SIGNALING',
  CHAT = 'CHAT',
  VOICE = 'VOICE',
  SCREEN = 'SCREEN',
  NEGOTIATION = 'NEGOTIATION',
  MEMBER = 'MEMBER',
  ROOM = 'ROOM',
  DRAW = 'DRAW',
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
  END = 'END',
  END_OK = 'END_OK',
}

export enum MEMBER_MESSAGE_ID {
  NAME = 'NAME',
  NAME_OK = 'NAME_OK',
}

export enum CHAT_MESSAGE_ID {
  SEND = 'SEND',
  OK = 'OK',
  SYNC_CHAT_LIST = 'SYNC_CHAT_LIST',
  SYNC_CHAT_LIST_OK = 'SYNC_CHAT_LIST_OK',
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

export enum ROOM_MESSAGE_ID {
  JOIN = 'JOIN',
  LEAVE = 'LEAVE',
}
export enum DRAW_MESSAGE_ID {
  START = 'START',
}

export type MessageId =
  | CONNECTION_MESSAGE_ID
  | CHAT_MESSAGE_ID
  | SIGNALING_MESSAGE_ID
  | VOICE_MESSAGE_ID
  | NEGOTIATION_MESSAGE_ID
  | SCREEN_SHARE_MESSAGE_ID
  | MEMBER_MESSAGE_ID
  | ROOM_MESSAGE_ID
  | DRAW_MESSAGE_ID;

export interface ProtocolData {
  [key: string]: any;
}

export interface StringifyProtocol {
  messageType: MESSAGE_TYPE;
  category: CATEGORY;
  messageId: MessageId;
  from: string;
  data: string;
  index: number;
  endIndex: number;
}

export interface EventType {
  messageType: MESSAGE_TYPE;
  category: CATEGORY;
  messageId: MessageId;
  from: string;
  data: ProtocolData;
  index?: number;
  endIndex?: number;
}

export type HandlerMap<T extends string | number | symbol> = {
  [key in T]: (protocol: EventType) => void;
};
