import type { EventType } from '../../constants/eventType';
import { CATEGORY, VOICE_MESSAGE_ID } from '../../constants/eventType';
import { storage } from 'service/storage/StorageService';
import { store } from 'store/store';
import { roomActions } from 'store/features/roomSlice';
import { messageId } from '../../decorators/messageId';
import { category } from '../../decorators/category';
import { inject, injectable } from 'tsyringe';
import { AudioManager } from 'service/media/AudioManager';
import { SoundEffect } from 'service/media/SoundEffect';
import { RTCManager } from 'service/rtc/RTCManager';
import { VoicePeerEmitter } from '../emitter/VoicePeerEmitter';
import { ScreenSharePeerEmitter } from '../emitter/ScreenSharePeerEmitter';

@category(CATEGORY.VOICE)
@injectable()
export class VoicePeerHandler {
  constructor(
    @inject(AudioManager) private audioManager: AudioManager,
    @inject(SoundEffect) private soundEffect: SoundEffect,
    @inject(VoicePeerEmitter) private voicePeerEmitter: VoicePeerEmitter,
    @inject(ScreenSharePeerEmitter)
    private screenSharePeerEmitter: ScreenSharePeerEmitter,
    @inject(RTCManager) private rtcManager: RTCManager,
  ) {}
  @messageId(VOICE_MESSAGE_ID.READY)
  ready(protocol: EventType) {
    const userKey = storage.getItem('userKey');
    if (!store.getState().user.voiceStatus) {
      return;
    }

    this.voicePeerEmitter.sendVoiceReadyOkMessage({
      to: protocol.from,
      userKey,
    });
  }

  @messageId(VOICE_MESSAGE_ID.READY_OK)
  async readyOk(protocol: EventType) {
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

    store.dispatch(
      roomActions.setMemberVoiceStatus({
        voiceStatus: true,
        userKey: protocol.data.userKey,
      }),
    );
    this.voicePeerEmitter.sendVoiceConnectedMessage({ to: from, userKey });
  }

  @messageId(VOICE_MESSAGE_ID.CONNECTED)
  async connected(protocol: EventType) {
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
      this.screenSharePeerEmitter.sendScreenReadyMessage({});
    }
  }

  @messageId(VOICE_MESSAGE_ID.DISCONNECT)
  disconnect(protocol: EventType) {
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
