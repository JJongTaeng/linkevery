import { category } from '../../decorators/category';
import type { EventType } from '../../constants/eventType';
import { CATEGORY, SIGNALING_MESSAGE_ID } from '../../constants/eventType';
import { messageId } from '../../decorators/messageId';
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

@category(CATEGORY.SIGNALING)
@injectable()
export class SignalingHandler {
  constructor(
    @inject(SignalingEmitter)
    private signalingPeerEmitter: SignalingEmitter,
    @inject(NegotiationEmitter)
    private negotiationPeerEmitter: NegotiationEmitter,
    @inject(VoiceEmitter) private voicePeerEmitter: VoiceEmitter,
    @inject(MemberEmitter) private memberPeerEmitter: MemberEmitter,
    @inject(RTCManager) private rtcManager: RTCManager,
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
        this.signalingPeerEmitter.sendSignalingIceMessage({
          to: from,
          ice,
        });
      })
      .onTrack(from)
      .onNegotiationNeeded(async (e: any) => {
        if (e.currentTarget.signalingState === 'stable') {
          const offer = await rtcPeer.createOffer();
          rtcPeer.setSdp({ sdp: offer, type: SdpType.local });
          console.debug(
            '[negotiationneeded connection state] ',
            e.currentTarget?.connectionState,
          );
          this.negotiationPeerEmitter.sendNegotiationOfferMessage({
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
    this.signalingPeerEmitter.sendSignalingOfferMessage({
      offer,
      to: from,
      roomName,
    });
  }

  @messageId(SIGNALING_MESSAGE_ID.OFFER)
  async offer(protocol: EventType) {
    const offer = new RTCSessionDescription(protocol.data.offer);
    console.log(offer);
    const { from } = protocol;
    // store.dispatch(roomActions.setMemberSize(size));
    this.rtcManager.createPeer(from);
    const rtcPeer = this.rtcManager.getPeer(from);
    rtcPeer
      .onIceCandidate((ice) => {
        this.signalingPeerEmitter.sendSignalingIceMessage({
          to: from,
          ice,
        });
      })
      .onTrack(from)
      .onNegotiationNeeded(async (e: any) => {
        if (e.currentTarget.signalingState === 'stable') {
          const offer = await rtcPeer.createOffer();
          rtcPeer.setSdp({ sdp: offer, type: SdpType.local });
          console.debug(
            '[negotiationneeded connection state] ',
            e.currentTarget?.connectionState,
          );
          this.negotiationPeerEmitter.sendNegotiationOfferMessage({
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
    this.signalingPeerEmitter.sendSignalingAnswerMessage({
      answer,
      to: from,
    });
  }

  @messageId(SIGNALING_MESSAGE_ID.ANSWER)
  answer(protocol: EventType) {
    const answer = new RTCSessionDescription(protocol.data.answer);
    console.log(answer);
    const { from } = protocol;
    const rtcPeer = this.rtcManager.getPeer(from);
    rtcPeer.setSdp({ sdp: answer, type: SdpType.remote });
    this.signalingPeerEmitter.sendSignalingCreateDataChannelMessage({
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
      this.signalingPeerEmitter.sendSignalingEndMessage({});

      rtcPeer.dataChannel = e.channel;
      rtcPeer.onDataChannelMessage((e) => {
        this.rtcManager.emit(RTCManager.RTC_EVENT.DATA, e.data);
      });
    });
    this.signalingPeerEmitter.sendSignalingConnectDataChannelMessage({
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
      this.voicePeerEmitter.sendVoiceReadyMessage({ to: from });
    }

    this.memberPeerEmitter.sendMemberNameMessage({
      to: from,
      username,
      userKey,
    });
    this.signalingPeerEmitter.sendSignalingEndOkMessage({ to: from });
  }

  @messageId(SIGNALING_MESSAGE_ID.END_OK)
  endOk(protocol: EventType): any {
    const { from } = protocol;
  }
}
