import {
  CHAT_MESSAGE_ID,
  HandlerMap,
  Protocol,
} from "../../constants/protocol";
import { DispatchEvent } from "../dispatch/DispatchEvent";

export const chatHandlers: HandlerMap<CHAT_MESSAGE_ID> = {
  [CHAT_MESSAGE_ID.SEND]: (protocol: Protocol, dispatch: DispatchEvent) => {
    console.log("chat", protocol);
  },
};
