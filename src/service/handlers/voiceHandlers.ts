import { HandlerMap, VOICE_MESSAGE_ID } from '../../constants/protocol';
import {
  UserStatus,
  userInfoActions,
} from '../../store/features/userInfoSlice';
import { store } from '../../store/store';

export const voiceHandlers: HandlerMap<VOICE_MESSAGE_ID> = {
  [VOICE_MESSAGE_ID.JOIN]: (protocol, { dispatch, rtcManager }) => {
    // voice 상태 확인 후 connection 시작
    const { from } = protocol;
    if (store.getState().userInfo.status === UserStatus.VOICE) {
      dispatch.sendVoiceConnectionStartMessage({ to: from });
    }
  },
  [VOICE_MESSAGE_ID.CONNECTION_START]: async (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const { from } = protocol;
    if (store.getState().userInfo.status !== UserStatus.VOICE) {
      return;
    }
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    mediaStream?.getTracks().forEach((track) => {
      const peer = rtcManager.getPeer(from);
      console.log(track, mediaStream);
      peer.addTrack(track, mediaStream);
    });
    store.dispatch(userInfoActions.changeStatus(UserStatus.VOICE));
    dispatch.sendVoiceConnectedMessage({ to: from });
  },
  [VOICE_MESSAGE_ID.CONNECTING]: async (protocol, { dispatch, rtcManager }) => {
    const { from } = protocol;
    if (store.getState().userInfo.status !== UserStatus.VOICE) {
      return;
    }
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    mediaStream?.getTracks().forEach((track) => {
      const peer = rtcManager.getPeer(from);
      console.log(track, mediaStream);
      peer.addTrack(track, mediaStream);
    });
  },
};
