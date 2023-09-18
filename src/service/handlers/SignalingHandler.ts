import { category } from 'decorators/category';
import type { Protocol } from 'constants/protocol';
import { CATEGORY, SIGNALING_MESSAGE_ID } from 'constants/protocol';
import { messageId } from 'decorators/messageId';
import { store } from 'store/store';
import { SdpType } from 'service/rtc/RTCPeerService';
import { storage } from 'service/storage/StorageService';
import { inject, injectable } from 'tsyringe';
import { RTCManager } from 'service/rtc/RTCManager';
import { roomActions } from 'store/features/roomSlice';
import { SignalingDispatch } from '../peerEmitter/SignalingDispatch';
import { NegotiationDispatch } from '../peerEmitter/NegotiationDispatch';
import { VoiceDispatch } from '../peerEmitter/VoiceDispatch';
import { MemberDispatch } from '../peerEmitter/MemberDispatch';

@category(CATEGORY.SIGNALING)
@injectable()
export class SignalingHandler {
  constructor(
    @inject(SignalingDispatch) private signalingDispatch: SignalingDispatch,
    @inject(NegotiationDispatch)
    private negotiationDispatch: NegotiationDispatch,
    @inject(VoiceDispatch) private voiceDispatch: VoiceDispatch,
    @inject(MemberDispatch) private memberDispatch: MemberDispatch,
    @inject(RTCManager) private rtcManager: RTCManager,
  ) {}

  @messageId(SIGNALING_MESSAGE_ID.START)
  async start(protocol: Protocol) {
    const { roomName, size } = protocol.data;
    const { from } = protocol;
    store.dispatch(roomActions.setMemberSize(size));
    this.rtcManager.createPeer(from);
    const rtcPeer = this.rtcManager.getPeer(from);
    rtcPeer
      .onIceCandidate((ice) => {
        this.signalingDispatch.sendSignalingIceMessage({
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
          this.negotiationDispatch.sendNegotiationOfferMessage({
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
    this.signalingDispatch.sendSignalingOfferMessage({
      offer,
      to: from,
      roomName,
    });
  }

  @messageId(SIGNALING_MESSAGE_ID.OFFER)
  async offer(protocol: Protocol) {
    const { offer } = protocol.data;
    const { from } = protocol;
    // store.dispatch(roomActions.setMemberSize(size));
    this.rtcManager.createPeer(from);
    const rtcPeer = this.rtcManager.getPeer(from);
    rtcPeer
      .onIceCandidate((ice) => {
        this.signalingDispatch.sendSignalingIceMessage({
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
          this.negotiationDispatch.sendNegotiationOfferMessage({
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
    this.signalingDispatch.sendSignalingAnswerMessage({
      answer,
      to: from,
    });
  }

  @messageId(SIGNALING_MESSAGE_ID.ANSWER)
  answer(protocol: Protocol) {
    const { answer } = protocol.data;
    const { from } = protocol;
    const rtcPeer = this.rtcManager.getPeer(from);
    rtcPeer.setSdp({ sdp: answer, type: SdpType.remote });
    this.signalingDispatch.sendSignalingCreateDataChannelMessage({ to: from });
  }

  @messageId(SIGNALING_MESSAGE_ID.ICE)
  ice(protocol: Protocol) {
    const { ice } = protocol.data;
    const rtcPeer = this.rtcManager.getPeer(protocol.from);
    rtcPeer.setIcecandidate(ice);
  }

  @messageId(SIGNALING_MESSAGE_ID.CREATE_DATA_CHANNEL)
  createDataChannel(protocol: Protocol) {
    const { from } = protocol;
    const rtcPeer = this.rtcManager.getPeer(from);
    rtcPeer.onDataChannel((e) => {
      console.debug('[open datachannel]', from);
      this.signalingDispatch.sendSignalingEndMessage({});

      rtcPeer.dataChannel = e.channel;
      rtcPeer.onDataChannelMessage((e) => {
        const parsedMessage = {
          ...JSON.parse(e.data),
        };
        this.rtcManager.emit(RTCManager.RTC_EVENT.DATA, parsedMessage);
      });
    });
    this.signalingDispatch.sendSignalingConnectDataChannelMessage({ to: from });
  }

  @messageId(SIGNALING_MESSAGE_ID.CONNECT_DATA_CHANNEL)
  connectDataChannel(protocol: Protocol): void {
    const roomName = storage.getItem('roomName');
    const { from } = protocol;
    const rtcPeer = this.rtcManager.getPeer(from);
    rtcPeer.createDataChannel(roomName);
    rtcPeer
      .onDataChannelOpen((e) => {
        console.debug('[open datachannel]', from);
      })
      .onDataChannelMessage((e) => {
        const parsedMessage = {
          ...JSON.parse(e.data),
        };
        this.rtcManager.emit(RTCManager.RTC_EVENT.DATA, parsedMessage);
      });
  }

  @messageId(SIGNALING_MESSAGE_ID.END)
  end(protocol: Protocol) {
    const { from } = protocol;
    const { username, userKey } = storage.getAll();

    if (store.getState().user.voiceStatus) {
      this.voiceDispatch.sendVoiceReadyMessage({});
    }

    this.memberDispatch.sendMemberNameMessage({ to: from, username, userKey });
    this.signalingDispatch.sendSignalingEndOkMessage({});
  }

  @messageId(SIGNALING_MESSAGE_ID.END_OK)
  endOk(protocol: Protocol): any {
    const { from } = protocol;
  }
}
