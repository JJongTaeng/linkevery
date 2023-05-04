import { notification } from 'antd';
import { HandlerMap, VOICE_MESSAGE_ID } from '../../constants/protocol';
import { store } from '../../store/store';
import { audioManager } from '../audio/AudioManager';

export const voiceHandlers: HandlerMap<VOICE_MESSAGE_ID> = {
  [VOICE_MESSAGE_ID.JOIN]: async (protocol, { dispatch, rtcManager }) => {
    const { from } = protocol;
    if (!store.getState().room.voiceStatus) {
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

    notification.info({
      message: `${
        store.getState().room.member[from]
      }이 보이스채팅에 연결되었습니다.`,
    });

    dispatch.sendVoiceStartMessage({});
  },
  [VOICE_MESSAGE_ID.START]: async (protocol, { dispatch, rtcManager }) => {
    const { from } = protocol;
    if (!store.getState().room.voiceStatus) {
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

    notification.info({
      message: `${
        store.getState().room.member[from]
      }이 보이스채팅에 연결되었습니다.`,
    });
  },
  [VOICE_MESSAGE_ID.DISCONNECT]: async (protocol, { dispatch, rtcManager }) => {
    const { from } = protocol;
    if (!store.getState().room.voiceStatus) {
      return;
    }
    const peer = rtcManager.getPeer(from);
    peer.removeAudioTrack();
    audioManager.removeAudio(from);
    notification.info({
      message: `${
        store.getState().room.member[from]
      }이 보이스채팅에서 나갔습니다.`,
    });
  },
};
