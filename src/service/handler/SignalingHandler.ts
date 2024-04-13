import { category } from 'decorators/category';
import type { EventType } from 'constants/eventType';
import { CATEGORY, SIGNALING_MESSAGE_ID } from 'constants/eventType';
import { messageId } from 'decorators/messageId';
import { store } from 'store/store';
import { SdpType } from 'service/rtc/RTCPeerService';
import { storage } from 'service/storage/StorageService';
import { inject, injectable } from 'tsyringe';
import { RTCManager } from 'service/rtc/RTCManager';
import { roomActions } from 'store/features/roomSlice';
import { SignalingEmitter } from '../emitter/SignalingEmitter';
import { NegotiationEmitter } from '../emitter/NegotiationEmitter';
import { VoiceEmitter } from '../emitter/VoiceEmitter';
import { MemberEmitter } from '../emitter/MemberEmitter';
import { VideoManager } from '../media/VideoManager.ts';
import { AudioStreamManager } from 'service/media/AudioStreamManager.ts';

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
    @inject(AudioStreamManager)
    private audioStreamManager: AudioStreamManager,
    @inject(VideoManager)
    private videoManager: VideoManager,
  ) {}

  @messageId(SIGNALING_MESSAGE_ID.START)
  async start(protocol: EventType) {
    const { roomName, size } = protocol.data;
    const { from } = protocol;
    store.dispatch(roomActions.setMemberSize(size));
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
          this.audioStreamManager.addAudioStream(from, e.streams[0]);
          const audioStream = this.audioStreamManager.audioStreamMap.get(from);
          audioStream?.onChangeSpeakVolume(100, (volume: number) => {
            // TODO: speaking 구현
          });
        }
      })
      .onNegotiationNeeded(async (e: any) => {
        if (e.currentTarget.signalingState === 'stable') {
          const offer = await rtcPeer.createOffer();
          rtcPeer.setSdp({ sdp: offer, type: SdpType.local });
          console.debug(
            '[negotiationneeded connection state] ',
            e.currentTarget?.connectionState,
          );
          this.negotiationEmitter.sendNegotiationOfferMessage({
            offer,
            to: from,
          });
        }
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
    const offer = await rtcPeer.createOffer();
    rtcPeer.setSdp({ sdp: offer, type: SdpType.local });
    this.signalingEmitter.sendSignalingOfferMessage({
      offer,
      to: from,
      roomName,
    });
  }

  @messageId(SIGNALING_MESSAGE_ID.OFFER)
  async offer(protocol: EventType) {
    const offer = new RTCSessionDescription(protocol.data.offer);
    const { from } = protocol;
    // store.dispatch(roomActions.setMemberSize(size));
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
          this.audioStreamManager.addAudioStream(from, e.streams[0]);
          const audioStream = this.audioStreamManager.audioStreamMap.get(from);
          audioStream?.onChangeSpeakVolume(100, (volume: number) => {
            // TODO: speaking 구현
          });
        }
      })
      .onNegotiationNeeded(async (e: any) => {
        if (e.currentTarget.signalingState === 'stable') {
          const offer = await rtcPeer.createOffer();
          rtcPeer.setSdp({ sdp: offer, type: SdpType.local });
          console.debug(
            '[negotiationneeded connection state] ',
            e.currentTarget?.connectionState,
          );
          this.negotiationEmitter.sendNegotiationOfferMessage({
            offer,
            to: from,
          });
        }
      })
      .onSignalingStateChange((e: any) => {
        console.debug('[signaling state]', e.currentTarget.signalingState);
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

    await rtcPeer.setSdp({ sdp: offer, type: SdpType.remote });
    const answer = await rtcPeer.createAnswer();
    await rtcPeer.setSdp({ sdp: answer, type: SdpType.local });
    this.signalingEmitter.sendSignalingAnswerMessage({
      answer,
      to: from,
    });
  }

  @messageId(SIGNALING_MESSAGE_ID.ANSWER)
  answer(protocol: EventType) {
    const answer = new RTCSessionDescription(protocol.data.answer);
    const { from } = protocol;
    const rtcPeer = this.rtcManager.getPeer(from);
    rtcPeer.setSdp({ sdp: answer, type: SdpType.remote });
    this.signalingEmitter.sendSignalingCreateDataChannelMessage({
      to: from,
    });
  }

  @messageId(SIGNALING_MESSAGE_ID.ICE)
  ice(protocol: EventType) {
    const { ice } = protocol.data;
    const rtcPeer = this.rtcManager.getPeer(protocol.from);
    rtcPeer.setIcecandidate(ice);
  }

  @messageId(SIGNALING_MESSAGE_ID.CREATE_DATA_CHANNEL)
  createDataChannel(protocol: EventType) {
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
    this.signalingEmitter.sendSignalingConnectDataChannelMessage({
      to: from,
    });
  }

  @messageId(SIGNALING_MESSAGE_ID.CONNECT_DATA_CHANNEL)
  connectDataChannel(protocol: EventType): void {
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
