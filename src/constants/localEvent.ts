export const EVENT_NAME = 'localEvent';

export enum LocalFeature {
  CHAT = 'CHAT',
  ROOM = 'ROOM',
}

export enum ChatAction {
  SEND = 'SEND',
  RECEIVE = 'RECEIVE',
}

export enum RoomAction {
  LEAVE = 'LEAVE',
}

export type LocalAction = ChatAction | RoomAction;
