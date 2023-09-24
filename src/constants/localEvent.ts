export const EVENT_NAME = 'localEvent';

export enum CATEGORY {
  CHAT = 'CHAT',
  ROOM = 'ROOM',
}

export enum CHAT_MESSAGE_ID {
  SEND = 'SEND',
  RECEIVE = 'RECEIVE',
}

export enum ROOM_MESSAGE_ID {
  LEAVE = 'LEAVE',

  JOIN = 'JOIN',
}

export type MessageId = CHAT_MESSAGE_ID | ROOM_MESSAGE_ID;
