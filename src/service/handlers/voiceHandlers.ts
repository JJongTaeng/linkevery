import { HandlerMap, VOICE_MESSAGE_ID } from '../../constants/protocol';

export const voiceHandlers: HandlerMap<VOICE_MESSAGE_ID> = {
  [VOICE_MESSAGE_ID.JOIN]: (protocol, { dispatch, rtcManager, ee }) => {
    const { from } = protocol;
    navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: true,
      })
      .then((mediaStream) => {
        mediaStream?.getTracks().forEach((track) => {
          const peer = rtcManager.getPeer(from);
          peer.addTrack(track, mediaStream);
        });
      });
    // TODO: connectino start action
    dispatch.sendVoiceConnectionStartMessage({});
  },
  [VOICE_MESSAGE_ID.CONNECTION_START]: (
    protocol,
    { dispatch, rtcManager, ee },
  ) => {
    const { from } = protocol;
  },
  [VOICE_MESSAGE_ID.CONNECTED]: (protocol, { dispatch, rtcManager, ee }) => {},
};
