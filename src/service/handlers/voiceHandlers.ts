import { notification } from 'antd';
import { HandlerMap, VOICE_MESSAGE_ID } from '../../constants/protocol';
import { roomActions } from '../../store/features/roomSlice';
import { store } from '../../store/store';
import { audioManager } from '../media/AudioManager';
import { soundEffect } from '../media/SoundEffect';

export const voiceHandlers: HandlerMap<VOICE_MESSAGE_ID> = {
  [VOICE_MESSAGE_ID.READY]: async (protocol, { dispatch, rtcManager }) => {
    if (!store.getState().room.voiceStatus) {
      return;
    }

    dispatch.sendVoiceReadyOkMessage({ to: protocol.from });
  },
  [VOICE_MESSAGE_ID.READY_OK]: async (protocol, { dispatch, rtcManager }) => {
    const { from } = protocol;
    if (!store.getState().room.voiceStatus) {
      return;
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: { echoCancellation: true, noiseSuppression: true },
    });
    mediaStream?.getTracks().forEach((track) => {
      const peer = rtcManager.getPeer(from);
      peer.addTrack(track, mediaStream);
    });

    notification.info({
      message: `${
        store.getState().room.member[from].username
      }이 보이스채팅에 연결되었습니다.`,
    });

    soundEffect.startVoice();

    store.dispatch(
      roomActions.setMemberVoiceStatus({ clientId: from, voiceStatus: true }),
    );
    dispatch.sendVoiceConnectedMessage({ to: from });
  },
  [VOICE_MESSAGE_ID.CONNECTED]: async (protocol, { dispatch, rtcManager }) => {
    const { from } = protocol;
    if (!store.getState().room.voiceStatus) {
      return;
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: { echoCancellation: true, noiseSuppression: true },
    });
    mediaStream?.getTracks().forEach((track) => {
      const peer = rtcManager.getPeer(from);
      peer.addTrack(track, mediaStream);
    });

    notification.info({
      message: `${
        store.getState().room.member[from].username
      }이 보이스채팅에 연결되었습니다.`,
    });
    soundEffect.startVoice();

    store.dispatch(
      roomActions.setMemberVoiceStatus({ clientId: from, voiceStatus: true }),
    );
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
        store.getState().room.member[from].username
      }이 보이스채팅에서 나갔습니다.`,
    });
    store.dispatch(
      roomActions.setMemberVoiceStatus({ clientId: from, voiceStatus: false }),
    );
  },
};
