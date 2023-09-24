import type { PeerEvent } from '../../constants/peerEvent';
import { CATEGORY, VOICE_MESSAGE_ID } from '../../constants/peerEvent';
import { storage } from 'service/storage/StorageService';
import { store } from 'store/store';
import { roomActions } from 'store/features/roomSlice';
import { peerMessageId } from '../../decorators/peerMessageId';
import { peerCategory } from '../../decorators/peerCategory';
import { inject, injectable } from 'tsyringe';
import { AudioManager } from 'service/media/AudioManager';
import { SoundEffect } from 'service/media/SoundEffect';
import { RTCManager } from 'service/rtc/RTCManager';
import { VoicePeerEmitter } from '../peerEmitter/VoicePeerEmitter';
import { ScreenSharePeerEmitter } from '../peerEmitter/ScreenSharePeerEmitter';

@peerCategory(CATEGORY.VOICE)
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
  @peerMessageId(VOICE_MESSAGE_ID.READY)
  ready(protocol: PeerEvent) {
    const userKey = storage.getItem('userKey');
    if (!store.getState().user.voiceStatus) {
      return;
    }

    this.voicePeerEmitter.sendVoiceReadyOkMessage({
      to: protocol.from,
      userKey,
    });
  }

  @peerMessageId(VOICE_MESSAGE_ID.READY_OK)
  async readyOk(protocol: PeerEvent) {
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
    this.voicePeerEmitter.sendVoiceConnectedMessage({ to: from, userKey });
  }

  @peerMessageId(VOICE_MESSAGE_ID.CONNECTED)
  async connected(protocol: PeerEvent) {
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

  @peerMessageId(VOICE_MESSAGE_ID.DISCONNECT)
  disconnect(protocol: PeerEvent) {
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
