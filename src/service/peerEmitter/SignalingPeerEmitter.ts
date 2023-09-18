import { Sender } from 'service/messages/Sender';
import { inject, injectable } from 'tsyringe';
import type { ProtocolData } from 'constants/protocol';
import { CATEGORY, SIGNALING_MESSAGE_ID } from 'constants/protocol';
import { socketMessage } from 'decorators/socketMessage';

@injectable()
export class SignalingPeerEmitter {
  constructor(@inject(Sender) private sender: Sender) {}

  @socketMessage({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.START,
  })
  sendSignalingStartMessage(data: ProtocolData) {}

  @socketMessage({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.OFFER,
  })
  sendSignalingOfferMessage(data: ProtocolData) {}

  @socketMessage({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.ANSWER,
  })
  sendSignalingAnswerMessage(data: ProtocolData) {}

  @socketMessage({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.ICE,
  })
  sendSignalingIceMessage(data: ProtocolData) {}

  @socketMessage({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.CREATE_DATA_CHANNEL,
  })
  sendSignalingCreateDataChannelMessage(data: ProtocolData) {}

  @socketMessage({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.CONNECT_DATA_CHANNEL,
  })
  sendSignalingConnectDataChannelMessage(data: ProtocolData) {}

  @socketMessage({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.END,
  })
  sendSignalingEndMessage(data: ProtocolData) {}

  @socketMessage({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.END_OK,
  })
  sendSignalingEndOkMessage(data: ProtocolData) {}
}
