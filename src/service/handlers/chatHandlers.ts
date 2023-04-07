import { CHAT_MESSAGE_ID, HandlerMap } from "../../constants/protocol";

export const chatHandlers: HandlerMap<CHAT_MESSAGE_ID> = {
  [CHAT_MESSAGE_ID.SEND]: (protocol, { dispatch, rtcManager }) => {},
};
