import { DispatchEvent } from 'service/dispatch/DispatchEvent';
import { RTCManagerService } from 'service/rtc/RTCManagerService';

export const EVENT_NAME = 'message';

export enum MESSAGE_TYPE {
  RTC = 'RTC',
  SOCKET = 'SOCKET',
}

export enum CATEGORY {
  CONNECTION = 'CONNECTION',
  SIGNALING = 'SIGNALING',
  CHAT = 'CHAT',
  VOICE = 'VOICE',
  SCREEN = 'SCREEN',
  NEGOTIATION = 'NEGOTIATION',
  MEMBER = 'MEMBER',
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

export type MessageId =
  | CONNECTION_MESSAGE_ID
  | CHAT_MESSAGE_ID
  | SIGNALING_MESSAGE_ID
  | VOICE_MESSAGE_ID
  | NEGOTIATION_MESSAGE_ID
  | SCREEN_SHARE_MESSAGE_ID
  | MEMBER_MESSAGE_ID;

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

export interface Protocol {
  messageType: MESSAGE_TYPE;
  category: CATEGORY;
  messageId: MessageId;
  from: string;
  data: ProtocolData;
  index?: number;
  endIndex?: number;
}

export type HandlerMap<T extends string | number | symbol> = {
  [key in T]: (protocol: Protocol) => void;
};

export type HandlerParameter = {
  dispatch: DispatchEvent;
  rtcManager: RTCManagerService;
};

export type HandlerFunction = (
  protocol: Protocol,
  { dispatch, rtcManager }: HandlerParameter,
) => any;
