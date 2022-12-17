import { Socket } from "socket.io-client";
import { EMIT_HANDLER_EVENT_NAME } from "./emitHandlers";

export enum RECEIVED_HANDLER_EVENT_NAME {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  ERROR = "error",
  WELCOME = "welcome",
  OFFER = "offer",
  ANSWER = "answer",
  ICE = "ice",
}

type ReceivedHandlerType = (
  socket: Socket,
  data: { [key: string]: any }
) => void;

interface ReceivedHandlers {
  [RECEIVED_HANDLER_EVENT_NAME.CONNECT]: ReceivedHandlerType;
  [RECEIVED_HANDLER_EVENT_NAME.DISCONNECT]: ReceivedHandlerType;
  [RECEIVED_HANDLER_EVENT_NAME.ERROR]: ReceivedHandlerType;
  [RECEIVED_HANDLER_EVENT_NAME.WELCOME]: ReceivedHandlerType;
  [RECEIVED_HANDLER_EVENT_NAME.OFFER]: ReceivedHandlerType;
  [RECEIVED_HANDLER_EVENT_NAME.ANSWER]: ReceivedHandlerType;
  [RECEIVED_HANDLER_EVENT_NAME.ICE]: ReceivedHandlerType;
}

export const receivedHandlers: ReceivedHandlers = {
  [RECEIVED_HANDLER_EVENT_NAME.CONNECT]: (socket) => {
    console.log("socket connected");
    socket.emit(EMIT_HANDLER_EVENT_NAME.JOIN_ROOM, "room");
  },
  [RECEIVED_HANDLER_EVENT_NAME.DISCONNECT]: () => {
    console.log("socket disconnected");
  },
  [RECEIVED_HANDLER_EVENT_NAME.ERROR]: () => {
    console.log("socket error");
  },
  [RECEIVED_HANDLER_EVENT_NAME.WELCOME]: (socket, data) => {
    console.log(data);
  },
  [RECEIVED_HANDLER_EVENT_NAME.OFFER]: () => {},
  [RECEIVED_HANDLER_EVENT_NAME.ANSWER]: () => {},
  [RECEIVED_HANDLER_EVENT_NAME.ICE]: () => {},
};
