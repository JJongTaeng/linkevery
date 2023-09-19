import { inject, injectable } from 'tsyringe';
import { Sender } from '../messages/Sender';
import type { ProtocolData } from '../../constants/peerEvent';
import { CATEGORY, NEGOTIATION_MESSAGE_ID } from '../../constants/peerEvent';
import { socketMessage } from 'decorators/socketMessage';

@injectable()
export class NegotiationPeerEmitter {
  constructor(@inject(Sender) private sender: Sender) {}

  @socketMessage({
    category: CATEGORY.NEGOTIATION,
    messageId: NEGOTIATION_MESSAGE_ID.OFFER,
  })
  sendNegotiationOfferMessage(data: ProtocolData) {}

  @socketMessage({
    category: CATEGORY.NEGOTIATION,
    messageId: NEGOTIATION_MESSAGE_ID.ANSWER,
  })
  sendNegotiationAnswerMessage(data: ProtocolData) {}
}
