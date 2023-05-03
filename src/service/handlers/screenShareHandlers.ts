import { HandlerMap, SCREEN_SHARE_MESSAGE_ID } from '../../constants/protocol';
import { store } from '../../store/store';

export const screenShareHandlers: HandlerMap<SCREEN_SHARE_MESSAGE_ID> = {
  [SCREEN_SHARE_MESSAGE_ID.READY]: async (
    protocol,
    { dispatch, rtcManager },
  ) => {
    if (!store.getState().voice.status) {
      return;
    }

    dispatch.sendScreenShareReadyOkMessage({});
  },
  [SCREEN_SHARE_MESSAGE_ID.READY_OK]: async (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: { echoCancellation: true, noiseSuppression: true },
    });
    mediaStream?.getTracks().forEach((track) => {
      const peer = rtcManager.getPeer(protocol.from);
      console.log(track, mediaStream);
      peer.addTrack(track, mediaStream);
    });
  },
  [SCREEN_SHARE_MESSAGE_ID.DISCONNECT]: (
    protocol,
    { dispatch, rtcManager },
  ) => {},
};
