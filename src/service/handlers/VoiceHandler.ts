import type { Protocol } from '../../constants/protocol';
import {
  CATEGORY,
  HandlerFunction,
  VOICE_MESSAGE_ID,
} from '../../constants/protocol';
import { DispatchEvent } from '../dispatch/DispatchEvent';
import { RTCManagerService } from '../rtc/RTCManagerService';
import { storage } from '../storage/StorageService';
import { store } from '../../store/store';
import { roomActions } from '../../store/features/roomSlice';
import { messageId } from '../../decorators/messageId';
import { category } from '../../decorators/category';
import { inject, injectable } from 'tsyringe';
import { AudioManager } from '../media/AudioManager';
import { SoundEffect } from '../media/SoundEffect';

interface VoiceHandlerInterface {
  ready: HandlerFunction;
  readyOk: HandlerFunction;
  connected: HandlerFunction;
  disconnect: HandlerFunction;
}

@category(CATEGORY.VOICE)
@injectable()
export class VoiceHandler implements VoiceHandlerInterface {
  constructor(
    @inject('AudioManager') private audioManager: AudioManager,
    @inject(SoundEffect) private soundEffect: SoundEffect,
  ) {}
  @messageId(VOICE_MESSAGE_ID.READY)
  ready(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: { dispatch: DispatchEvent; rtcManager: RTCManagerService },
  ) {
    const userKey = storage.getItem('userKey');
    if (!store.getState().user.voiceStatus) {
      return;
    }

    dispatch.sendVoiceReadyOkMessage({ to: protocol.from, userKey });
  }

  @messageId(VOICE_MESSAGE_ID.READY_OK)
  async readyOk(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: {
      dispatch: DispatchEvent;
      rtcManager: RTCManagerService;
    },
  ) {
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

    this.soundEffect.startVoice();

    store.dispatch(
      roomActions.setMemberVoiceStatus({
        voiceStatus: true,
        userKey: protocol.data.userKey,
      }),
    );
    dispatch.sendVoiceConnectedMessage({ to: from, userKey });
  }

  @messageId(VOICE_MESSAGE_ID.CONNECTED)
  async connected(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: {
      dispatch: DispatchEvent;
      rtcManager: RTCManagerService;
    },
  ) {
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

    this.soundEffect.startVoice();

    store.dispatch(
      roomActions.setMemberVoiceStatus({
        userKey: protocol.data.userKey,
        voiceStatus: true,
      }),
    );
    if (store.getState().user.screenShareStatus) {
      dispatch.sendScreenReadyMessage({});
    }
  }

  @messageId(VOICE_MESSAGE_ID.DISCONNECT)
  disconnect(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: {
      dispatch: DispatchEvent;
      rtcManager: RTCManagerService;
    },
  ) {
    const { from } = protocol;
    if (!store.getState().user.voiceStatus) {
      return;
    }
    const peer = rtcManager.getPeer(from);
    peer.removeAudioTrack();
    this.audioManager.removeAudio(from);

    this.soundEffect.closeVoice();

    store.dispatch(
      roomActions.setMemberVoiceStatus({
        userKey: protocol.data.userKey,
        voiceStatus: false,
      }),
    );
  }
}
