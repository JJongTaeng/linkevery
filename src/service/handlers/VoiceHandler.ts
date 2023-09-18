import type { Protocol } from 'constants/protocol';
import { CATEGORY, VOICE_MESSAGE_ID } from 'constants/protocol';
import { storage } from 'service/storage/StorageService';
import { store } from 'store/store';
import { roomActions } from 'store/features/roomSlice';
import { messageId } from 'decorators/messageId';
import { category } from 'decorators/category';
import { inject, injectable } from 'tsyringe';
import { AudioManager } from 'service/media/AudioManager';
import { SoundEffect } from 'service/media/SoundEffect';
import { RTCManager } from 'service/rtc/RTCManager';
import { VoiceDispatch } from '../peerEmitter/VoiceDispatch';
import { ScreenShareDispatch } from '../peerEmitter/ScreenShareDispatch';

@category(CATEGORY.VOICE)
@injectable()
export class VoiceHandler {
  constructor(
    @inject(AudioManager) private audioManager: AudioManager,
    @inject(SoundEffect) private soundEffect: SoundEffect,
    @inject(VoiceDispatch) private voiceDispatch: VoiceDispatch,
    @inject(ScreenShareDispatch) private screenDispatch: ScreenShareDispatch,
    @inject(RTCManager) private rtcManager: RTCManager,
  ) {}
  @messageId(VOICE_MESSAGE_ID.READY)
  ready(protocol: Protocol) {
    const userKey = storage.getItem('userKey');
    if (!store.getState().user.voiceStatus) {
      return;
    }

    this.voiceDispatch.sendVoiceReadyOkMessage({ to: protocol.from, userKey });
  }

  @messageId(VOICE_MESSAGE_ID.READY_OK)
  async readyOk(protocol: Protocol) {
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
      const peer = this.rtcManager.getPeer(from);
      peer.addTrack(track, mediaStream);
    });

    this.soundEffect.startVoice();

    store.dispatch(
      roomActions.setMemberVoiceStatus({
        voiceStatus: true,
        userKey: protocol.data.userKey,
      }),
    );
    this.voiceDispatch.sendVoiceConnectedMessage({ to: from, userKey });
  }

  @messageId(VOICE_MESSAGE_ID.CONNECTED)
  async connected(protocol: Protocol) {
    const { from } = protocol;
    if (!store.getState().user.voiceStatus) {
      return;
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: { echoCancellation: true, noiseSuppression: true },
    });
    mediaStream?.getTracks().forEach((track) => {
      const peer = this.rtcManager.getPeer(from);
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
      this.screenDispatch.sendScreenReadyMessage({});
    }
  }

  @messageId(VOICE_MESSAGE_ID.DISCONNECT)
  disconnect(protocol: Protocol) {
    const { from } = protocol;
    if (!store.getState().user.voiceStatus) {
      return;
    }
    const peer = this.rtcManager.getPeer(from);
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
