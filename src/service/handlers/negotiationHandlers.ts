import { HandlerMap, NEGOTIATION_MESSAGE_ID } from '../../constants/protocol';
import { SdpType } from '../rtc/RTCPeerService';

export const negotiationHandlers: HandlerMap<NEGOTIATION_MESSAGE_ID> = {
  [NEGOTIATION_MESSAGE_ID.OFFER]: async (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const { from } = protocol;
    const { offer } = protocol.data;
    const rtcPeer = rtcManager.getPeer(from);

    await rtcPeer.setSdp({ sdp: offer, type: SdpType.remote });
    const answer = await rtcPeer.createAnswer();
    await rtcPeer.setSdp({ sdp: answer, type: SdpType.local });

    dispatch.sendNegotiationAnswerMessage({ answer, to: from });
  },
  [NEGOTIATION_MESSAGE_ID.ANSWER]: (protocol, { dispatch, rtcManager }) => {
    const { answer } = protocol.data;
    const rtcPeer = rtcManager.getPeer(protocol.from);
    rtcPeer.setSdp({ sdp: answer, type: SdpType.remote });
  },
};
