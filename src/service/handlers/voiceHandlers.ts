import { HandlerMap, VOICE_MESSAGE_ID } from '../../constants/protocol';
import { store } from '../../store/store';
import { audioManager } from '../audio/AudioManager';

export const voiceHandlers: HandlerMap<VOICE_MESSAGE_ID> = {
  [VOICE_MESSAGE_ID.JOIN]: async (protocol, { dispatch, rtcManager }) => {
    const { from } = protocol;
    if (!store.getState().voice.status) {
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

    dispatch.sendVoiceStartMessage({});
  },
  [VOICE_MESSAGE_ID.START]: async (protocol, { dispatch, rtcManager }) => {
    const { from } = protocol;
    if (!store.getState().voice.status) {
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
  [VOICE_MESSAGE_ID.DISCONNECT]: async (protocol, { dispatch, rtcManager }) => {
    const { from } = protocol;
    if (!store.getState().voice.status) {
      return;
    }
    const peer = rtcManager.getPeer(from);
    peer.removeTrack();
    audioManager.removeAudio(from);
  },
};
