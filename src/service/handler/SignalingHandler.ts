import { category } from 'decorators/category';
import type { EventType } from 'constants/eventType';
import { CATEGORY, SIGNALING_MESSAGE_ID } from 'constants/eventType';
import { messageId } from 'decorators/messageId';
import { store } from 'store/store';
import { storage } from 'service/storage/StorageService';
import { inject, injectable } from 'tsyringe';
import { RTCManager } from 'service/rtc/RTCManager';
import { SignalingEmitter } from '../emitter/SignalingEmitter';
import { NegotiationEmitter } from '../emitter/NegotiationEmitter';
import { VoiceEmitter } from '../emitter/VoiceEmitter';
import { MemberEmitter } from '../emitter/MemberEmitter';
import { VideoManager } from '../media/VideoManager.ts';
import { AudioPlayerManager } from 'service/media/AudioPlayerManager.ts';
import { SdpType } from 'service/rtc/RTCPeerService.ts';

@category(CATEGORY.SIGNALING)
@injectable()
export class SignalingHandler {
  constructor(
    @inject(SignalingEmitter)
    private signalingEmitter: SignalingEmitter,
    @inject(NegotiationEmitter)
    private negotiationEmitter: NegotiationEmitter,
    @inject(VoiceEmitter) private voiceEmitter: VoiceEmitter,
    @inject(MemberEmitter) private memberEmitter: MemberEmitter,
    @inject(RTCManager) private rtcManager: RTCManager,
    @inject(AudioPlayerManager)
    private audioPlayerManager: AudioPlayerManager,
    @inject(VideoManager)
    private videoManager: VideoManager,
  ) {}

  @messageId(SIGNALING_MESSAGE_ID.READY)
  async ready(protocol: EventType) {
    const { from } = protocol;
    this.rtcManager.createPeer(from);
    const rtcPeer = this.rtcManager.getPeer(from);
    rtcPeer
      .onIceCandidate((ice) => {
        this.signalingEmitter.sendSignalingIceMessage({
          to: from,
          ice,
        });
      })
      .onTrack((e) => {
        const videoTrack = e.streams[0].getVideoTracks()[0];
        if (videoTrack) {
          this.videoManager.addVideo(from, e.streams[0]);
        } else {
          this.audioPlayerManager.addAudioStream(from, e.streams[0]);
        }
      })
      .onNegotiationNeeded(async (e: any) => {
        console.debug('[negotiationneed] ', e.currentTarget.signalingState);
        if (e.currentTarget.signalingState !== 'stable') return;
        const offer = await rtcPeer.createOffer();
        await rtcPeer.setSdp({ sdp: offer, type: SdpType.local });

        this.negotiationEmitter.sendNegotiationOfferMessage({
          offer,
          to: from,
        });
      })
      .onSignalingStateChange((e: any) => {
        console.debug('[signalingstate]', e.currentTarget.signalingState);
      })
      .onConnectionStateChange((e: any) => {
        console.debug(
          '[connection state change]',
          e.currentTarget.connectionState,
        );
      })
      .onIceConnectionStateChange((e: any) => {
        console.debug(
          '[ice connection state]',
          e.currentTarget.iceConnectionState,
        );
        if (e.currentTarget.iceConnectionState === 'failed') {
          rtcPeer.restartIce();
        }
      })
      .onIceCandidateError((e: any) => {
        console.debug('[ice candidate error]', e);
      });
    this.signalingEmitter.sendSignalingReadyOkMessage({
      to: from,
    });
  }

  @messageId(SIGNALING_MESSAGE_ID.READY_OK)
  async readyOk(protocol: EventType) {
    const { from } = protocol;
    this.rtcManager.createPeer(from);
    const rtcPeer = this.rtcManager.getPeer(from);
    rtcPeer
      .onIceCandidate((ice) => {
        this.signalingEmitter.sendSignalingIceMessage({
          to: from,
          ice,
        });
      })
      .onTrack((e) => {
        const videoTrack = e.streams[0].getVideoTracks()[0];
        if (videoTrack) {
          this.videoManager.addVideo(from, e.streams[0]);
        } else {
          this.audioPlayerManager.addAudioStream(from, e.streams[0]);
        }
      })
      .onNegotiationNeeded(async (e: any) => {
        console.debug('[negotiationneed] ', e.currentTarget.signalingState);
        if (e.currentTarget.signalingState !== 'stable') return;
        const offer = await rtcPeer.createOffer();
        await rtcPeer.setSdp({ sdp: offer, type: SdpType.local });

        this.negotiationEmitter.sendNegotiationOfferMessage({
          offer,
          to: from,
        });
      })
      .onSignalingStateChange((e: any) => {
        console.debug('[signalingstate]', e.currentTarget.signalingState);
      })
      .onConnectionStateChange((e: any) => {
        console.debug(
          '[connection state change]',
          e.currentTarget.connectionState,
        );
      })
      .onIceConnectionStateChange((e: any) => {
        console.debug(
          '[ice connection state]',
          e.currentTarget.iceConnectionState,
        );
        if (e.currentTarget.iceConnectionState === 'failed') {
          rtcPeer.restartIce();
        }
      })
      .onIceCandidateError((e: any) => {
        console.debug('[ice candidate error]', e);
      });

    this.signalingEmitter.sendSignalingConnectDataChannelMessage({
      to: from,
    });
  }

  @messageId(SIGNALING_MESSAGE_ID.ICE)
  ice(protocol: EventType) {
    const { ice } = protocol.data;
    const rtcPeer = this.rtcManager.getPeer(protocol.from);
    rtcPeer.setIcecandidate(ice);
  }

  @messageId(SIGNALING_MESSAGE_ID.CONNECT_DATA_CHANNEL)
  connectDataChannel(protocol: EventType): void {
    const { from } = protocol;
    const rtcPeer = this.rtcManager.getPeer(from);
    rtcPeer.onDataChannel((e) => {
      console.debug('[open datachannel]', from);
      this.signalingEmitter.sendSignalingEndMessage({});

      rtcPeer.dataChannel = e.channel;
      rtcPeer.onDataChannelMessage((e) => {
        this.rtcManager.emit(RTCManager.RTC_EVENT.DATA, e.data);
      });
    });
    this.signalingEmitter.sendSignalingCreateDataChannelMessage({
      to: from,
    });
  }

  @messageId(SIGNALING_MESSAGE_ID.CREATE_DATA_CHANNEL)
  createDataChannel(protocol: EventType) {
    const roomName = storage.getItem('roomName');
    const { from } = protocol;
    const rtcPeer = this.rtcManager.getPeer(from);
    rtcPeer.createDataChannel(roomName);
    rtcPeer
      .onDataChannelOpen((e) => {
        console.debug('[open datachannel]', from);
      })
      .onDataChannelMessage((e) => {
        this.rtcManager.emit(RTCManager.RTC_EVENT.DATA, e.data);
      });
  }

  @messageId(SIGNALING_MESSAGE_ID.END)
  end(protocol: EventType) {
    const { from } = protocol;
    const { username, userKey } = storage.getAll();

    if (store.getState().user.voiceStatus) {
      this.voiceEmitter.sendVoiceReadyMessage({ to: from });
    }

    this.memberEmitter.sendMemberNameMessage({
      to: from,
      username,
      userKey,
    });
    this.signalingEmitter.sendSignalingEndOkMessage({ to: from });
  }

  @messageId(SIGNALING_MESSAGE_ID.END_OK)
  endOk(protocol: EventType): any {
    const { from } = protocol;
  }
}
