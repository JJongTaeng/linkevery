import { inject, injectable } from 'tsyringe';
import type { ProtocolData } from '../../constants/eventType';
import { CATEGORY, SIGNALING_MESSAGE_ID } from '../../constants/eventType';
import { socketAction } from '../../decorators/socketAction';
import type { EmitterService } from 'service/emitter/EmitterService';

@injectable()
export class SignalingEmitter {
  constructor(@inject('EmitterService') private sender: EmitterService) {}

  @socketAction({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.READY,
  })
  sendSignalingReadyMessage(data: ProtocolData) {}

  @socketAction({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.READY_OK,
  })
  sendSignalingReadyOkMessage(data: ProtocolData) {}

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
