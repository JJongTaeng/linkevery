import type { EventType } from '../../constants/eventType';
import { CATEGORY, NEGOTIATION_MESSAGE_ID } from '../../constants/eventType';
import { SdpType } from 'service/rtc/RTCPeerService';
import { messageId } from '../../decorators/messageId';
import { category } from '../../decorators/category';
import { inject, injectable } from 'tsyringe';
import { RTCManager } from 'service/rtc/RTCManager';
import { NegotiationEmitter } from '../emitter/NegotiationEmitter';

@category(CATEGORY.NEGOTIATION)
@injectable()
export class NegotiationHandler {
  constructor(
    @inject(NegotiationEmitter)
    private negotiationPeerEmitter: NegotiationEmitter,
    @inject(RTCManager) private rtcManager: RTCManager,
  ) {}
  @messageId(NEGOTIATION_MESSAGE_ID.OFFER)
  async offer(protocol: EventType) {
    const { from } = protocol;
    const offer = new RTCSessionDescription(protocol.data.offer);

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
  async answer(protocol: EventType) {
    const answer = new RTCSessionDescription(protocol.data.answer);

    const rtcPeer = this.rtcManager.getPeer(protocol.from);
    rtcPeer.setSdp({ sdp: answer, type: SdpType.remote });
  }
}
