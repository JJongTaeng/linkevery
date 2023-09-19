import type { PeerEvent } from '../../constants/peerEvent';
import { CATEGORY, NEGOTIATION_MESSAGE_ID } from '../../constants/peerEvent';
import { SdpType } from 'service/rtc/RTCPeerService';
import { messageId } from 'decorators/messageId';
import { category } from 'decorators/category';
import { inject, injectable } from 'tsyringe';
import { RTCManager } from 'service/rtc/RTCManager';
import { NegotiationPeerEmitter } from '../peerEmitter/NegotiationPeerEmitter';

@category(CATEGORY.NEGOTIATION)
@injectable()
export class NegotiationPeerHandler {
  constructor(
    @inject(NegotiationPeerEmitter)
    private negotiationPeerEmitter: NegotiationPeerEmitter,
    @inject(RTCManager) private rtcManager: RTCManager,
  ) {}
  @messageId(NEGOTIATION_MESSAGE_ID.OFFER)
  async offer(protocol: PeerEvent) {
    const { from } = protocol;
    const { offer } = protocol.data;
    const rtcPeer = this.rtcManager.getPeer(from);

    await rtcPeer.setSdp({ sdp: offer, type: SdpType.remote });
    const answer = await rtcPeer.createAnswer();
    await rtcPeer.setSdp({ sdp: answer, type: SdpType.local });

    this.negotiationPeerEmitter.sendNegotiationAnswerMessage({
      answer,
      to: from,
    });
  }
  @messageId(NEGOTIATION_MESSAGE_ID.ANSWER)
  async answer(protocol: PeerEvent) {
    const { answer } = protocol.data;
    const rtcPeer = this.rtcManager.getPeer(protocol.from);
    rtcPeer.setSdp({ sdp: answer, type: SdpType.remote });
  }
}
