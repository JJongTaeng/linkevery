import { inject, injectable } from 'tsyringe';
import type { ProtocolData } from '../../constants/peerEvent';
import { CATEGORY, NEGOTIATION_MESSAGE_ID } from '../../constants/peerEvent';
import { socketAction } from '../../decorators/socketAction';
import type { EmitterService } from 'service/emitter/EmitterService';

@injectable()
export class NegotiationPeerEmitter {
  constructor(@inject('EmitterService') private sender: EmitterService) {}

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
