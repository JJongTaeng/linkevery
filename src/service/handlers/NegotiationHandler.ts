import type { Protocol } from '../../constants/protocol';
import {
  CATEGORY,
  HandlerFunction,
  NEGOTIATION_MESSAGE_ID,
} from '../../constants/protocol';
import { DispatchEvent } from '../dispatch/DispatchEvent';
import { RTCManagerService } from '../rtc/RTCManagerService';
import { SdpType } from '../rtc/RTCPeerService';
import { messageId } from '../../decorators/messageId';
import { category } from '../../decorators/category';

interface NegotiationHandlerService {
  offer: HandlerFunction;
  answer: HandlerFunction;
}

@category(CATEGORY.NEGOTIATION)
export class NegotiationHandler implements NegotiationHandlerService {
  @messageId(NEGOTIATION_MESSAGE_ID.OFFER)
  async offer(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: { dispatch: DispatchEvent; rtcManager: RTCManagerService },
  ) {
    const { from } = protocol;
    const { offer } = protocol.data;
    const rtcPeer = rtcManager.getPeer(from);

    await rtcPeer.setSdp({ sdp: offer, type: SdpType.remote });
    const answer = await rtcPeer.createAnswer();
    await rtcPeer.setSdp({ sdp: answer, type: SdpType.local });

    dispatch.sendNegotiationAnswerMessage({ answer, to: from });
  }
  @messageId(NEGOTIATION_MESSAGE_ID.ANSWER)
  async answer(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: {
      dispatch: DispatchEvent;
      rtcManager: RTCManagerService;
    },
  ) {
    const { answer } = protocol.data;
    const rtcPeer = rtcManager.getPeer(protocol.from);
    rtcPeer.setSdp({ sdp: answer, type: SdpType.remote });
  }
}
