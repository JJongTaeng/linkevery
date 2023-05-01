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
}

export enum CONNECTION_MESSAGE_ID {
  CONNECT = 'CONNECT',
  JOIN_ROOM = 'JOIN_ROOM',
  DISCONNECT = 'DISCONNECT',
}

export enum SIGNALING_MESSAGE_ID {
  OFFER = 'OFFER',
  ANSWER = 'ANSWER',
  ICE = 'ICE',
  CREATE_DATA_CHANNEL = 'CREATE_DATA_CHANNEL',
}

export enum ROOM_MESSAGE_ID {
  REQUEST_MEMBER_NAME = 'REQUEST_MEMBER_NAME',
  RESPONSE_MEMBER_NAME = 'RESPONSE_MEMBER_NAME',
}

export enum CHAT_MESSAGE_ID {
  SEND = 'SEND',
}

export enum VOICE_MESSAGE_ID {
  JOIN = 'JOIN',
  OFFER = 'OFFER',
  ANSWER = 'ANSWER',
  ICE = 'ICE',
  DISCONNECT = 'DISCONNECT',
}

export type MessageId =
  | CONNECTION_MESSAGE_ID
  | CHAT_MESSAGE_ID
  | SIGNALING_MESSAGE_ID
  | ROOM_MESSAGE_ID
  | VOICE_MESSAGE_ID;

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
      rtcVoiceManager,
    }: {
      dispatch: DispatchEvent;
      rtcManager: RTCManagerService;
      rtcVoiceManager: RTCManagerService;
    },
  ) => void;
};
