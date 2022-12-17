import { RECEIVED_HANDLER_EVENT_NAME } from "./receivedHandlers";

export enum EMIT_HANDLER_EVENT_NAME {
  JOIN_ROOM = "joinRoom",
  OFFER = "offer",
  ANSWER = "answer",
  ICE = "ice",
}

interface EmitHandlers {
  [EMIT_HANDLER_EVENT_NAME.JOIN_ROOM]: () => void;
  [EMIT_HANDLER_EVENT_NAME.OFFER]: () => void;
  [EMIT_HANDLER_EVENT_NAME.ANSWER]: () => void;
  [EMIT_HANDLER_EVENT_NAME.ICE]: () => void;
}
