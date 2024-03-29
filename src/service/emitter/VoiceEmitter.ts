import { inject, injectable } from 'tsyringe';
import type { ProtocolData } from '../../constants/eventType';
import { CATEGORY, VOICE_MESSAGE_ID } from '../../constants/eventType';
import { rtcAction } from '../../decorators/rtcAction';
import type { EmitterService } from 'service/emitter/EmitterService';

@injectable()
export class VoiceEmitter {
  constructor(@inject('EmitterService') private sender: EmitterService) {}

  @rtcAction({
    category: CATEGORY.VOICE,
    messageId: VOICE_MESSAGE_ID.READY,
  })
  sendVoiceReadyMessage(data: ProtocolData) {}

  @rtcAction({
    category: CATEGORY.VOICE,
    messageId: VOICE_MESSAGE_ID.READY_OK,
  })
  sendVoiceReadyOkMessage(data: ProtocolData) {}

  @rtcAction({
    category: CATEGORY.VOICE,
    messageId: VOICE_MESSAGE_ID.CONNECTED,
  })
  sendVoiceConnectedMessage(data: ProtocolData) {}

  @rtcAction({
    category: CATEGORY.VOICE,
    messageId: VOICE_MESSAGE_ID.DISCONNECT,
  })
  sendVoiceDisconnectMessage(data: ProtocolData) {}
}
