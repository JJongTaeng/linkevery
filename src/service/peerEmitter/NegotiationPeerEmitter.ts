import { inject, injectable } from 'tsyringe';
import { Sender } from '../messages/Sender';
import type { ProtocolData } from '../../constants/peerEvent';
import { CATEGORY, NEGOTIATION_MESSAGE_ID } from '../../constants/peerEvent';
import { socketAction } from '../../decorators/socketAction';

@injectable()
export class NegotiationPeerEmitter {
  constructor(@inject(Sender) private sender: Sender) {}

  @socketAction({
    category: CATEGORY.NEGOTIATION,
    messageId: NEGOTIATION_MESSAGE_ID.OFFER,
  })
  sendNegotiationOfferMessage(data: ProtocolData) {}

  @socketAction({
    category: CATEGORY.NEGOTIATION,
    messageId: NEGOTIATION_MESSAGE_ID.ANSWER,
  })
  sendNegotiationAnswerMessage(data: ProtocolData) {}
}
