import { HandlerMap, VOICE_MESSAGE_ID } from '../../constants/protocol';

export const voiceHandlers: HandlerMap<VOICE_MESSAGE_ID> = {
  [VOICE_MESSAGE_ID.JOIN_VOICE]: (protocol, { dispatch, rtcManager, ee }) => {},
  [VOICE_MESSAGE_ID.CONNECTION_START]: (
    protocol,
    { dispatch, rtcManager, ee },
  ) => {},
  [VOICE_MESSAGE_ID.CONNECTED]: (protocol, { dispatch, rtcManager, ee }) => {},
};
