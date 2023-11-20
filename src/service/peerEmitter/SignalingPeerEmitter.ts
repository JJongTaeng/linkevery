import { inject, injectable } from 'tsyringe';
import type { ProtocolData } from '../../constants/peerEvent';
import { CATEGORY, SIGNALING_MESSAGE_ID } from '../../constants/peerEvent';
import { socketAction } from '../../decorators/socketAction';
import type { EmitterService } from '../dataExchanger/EmitterService';

@injectable()
export class SignalingPeerEmitter {
  constructor(@inject('EmitterService') private sender: EmitterService) {}

  @socketAction({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.START,
  })
  sendSignalingStartMessage(data: ProtocolData) {}

  @socketAction({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.OFFER,
  })
  sendSignalingOfferMessage(data: ProtocolData) {}

  @socketAction({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.ANSWER,
  })
  sendSignalingAnswerMessage(data: ProtocolData) {}

  @socketAction({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.ICE,
  })
  sendSignalingIceMessage(data: ProtocolData) {}

  @socketAction({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.CREATE_DATA_CHANNEL,
  })
  sendSignalingCreateDataChannelMessage(data: ProtocolData) {}

  @socketAction({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.CONNECT_DATA_CHANNEL,
  })
  sendSignalingConnectDataChannelMessage(data: ProtocolData) {}

  @socketAction({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.END,
  })
  sendSignalingEndMessage(data: ProtocolData) {}

  @socketAction({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.END_OK,
  })
  sendSignalingEndOkMessage(data: ProtocolData) {}
}
