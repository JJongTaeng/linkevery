import type { Protocol } from '../../constants/protocol';
import {
  CATEGORY,
  HandlerFunction,
  NEGOTIATION_MESSAGE_ID,
} from '../../constants/protocol';
import { DispatchEvent } from '../dispatch/DispatchEvent';
import { SdpType } from '../rtc/RTCPeerService';
import { messageId } from '../../decorators/messageId';
import { category } from '../../decorators/category';
import { inject, injectable } from 'tsyringe';
import { RTCManager } from '../rtc/RTCManager';

@category(CATEGORY.NEGOTIATION)
@injectable()
export class NegotiationHandler {
  constructor(
    @inject(DispatchEvent) private dispatch: DispatchEvent,
    @inject(RTCManager) private rtcManager: RTCManager,
  ) {}
  @messageId(NEGOTIATION_MESSAGE_ID.OFFER)
  async offer(protocol: Protocol) {
    const { from } = protocol;
    const { offer } = protocol.data;
    const rtcPeer = this.rtcManager.getPeer(from);

    await rtcPeer.setSdp({ sdp: offer, type: SdpType.remote });
    const answer = await rtcPeer.createAnswer();
    await rtcPeer.setSdp({ sdp: answer, type: SdpType.local });

    this.dispatch.sendNegotiationAnswerMessage({ answer, to: from });
  }
  @messageId(NEGOTIATION_MESSAGE_ID.ANSWER)
  async answer(protocol: Protocol) {
    const { answer } = protocol.data;
    const rtcPeer = this.rtcManager.getPeer(protocol.from);
    rtcPeer.setSdp({ sdp: answer, type: SdpType.remote });
  }
}
