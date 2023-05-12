import { notification } from 'antd';
import { HandlerMap, VOICE_MESSAGE_ID } from '../../constants/protocol';
import { roomActions } from '../../store/features/roomSlice';
import { store } from '../../store/store';
import { audioManager } from '../media/AudioManager';
import { soundEffect } from '../media/SoundEffect';
import { storage } from '../storage/StorageService';

export const voiceHandlers: HandlerMap<VOICE_MESSAGE_ID> = {
  [VOICE_MESSAGE_ID.READY]: async (protocol, { dispatch, rtcManager }) => {
    const userKey = storage.getItem('userKey');
    if (!store.getState().user.voiceStatus) {
      return;
    }

    dispatch.sendVoiceReadyOkMessage({ to: protocol.from, userKey });
  },
  [VOICE_MESSAGE_ID.READY_OK]: async (protocol, { dispatch, rtcManager }) => {
    const userKey = storage.getItem('userKey');
    const { from } = protocol;
    if (!store.getState().user.voiceStatus) {
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
        store.getState().room.room.member[protocol.data.userKey].username
      }이 보이스채팅에 연결되었습니다.`,
    });

    soundEffect.startVoice();

    store.dispatch(
      roomActions.setMemberVoiceStatus({
        voiceStatus: true,
        userKey: protocol.data.userKey,
      }),
    );
    dispatch.sendVoiceConnectedMessage({ to: from, userKey });
  },
  [VOICE_MESSAGE_ID.CONNECTED]: async (protocol, { dispatch, rtcManager }) => {
    const { from } = protocol;
    if (!store.getState().user.voiceStatus) {
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
        store.getState().room.room.member[protocol.data.userKey].username
      }이 보이스채팅에 연결되었습니다.`,
    });
    soundEffect.startVoice();

    store.dispatch(
      roomActions.setMemberVoiceStatus({
        userKey: protocol.data.userKey,
        voiceStatus: true,
      }),
    );
  },
  [VOICE_MESSAGE_ID.DISCONNECT]: async (protocol, { dispatch, rtcManager }) => {
    const { from } = protocol;
    if (!store.getState().user.voiceStatus) {
      return;
    }
    const peer = rtcManager.getPeer(from);
    peer.removeAudioTrack();
    audioManager.removeAudio(from);
    notification.info({
      message: `${
        store.getState().room.room.member[protocol.data.userKey].username
      }이 보이스채팅에서 나갔습니다.`,
    });
    store.dispatch(
      roomActions.setMemberVoiceStatus({
        userKey: protocol.data.userKey,
        voiceStatus: false,
      }),
    );
  },
};
