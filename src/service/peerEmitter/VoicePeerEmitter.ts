import { inject, injectable } from 'tsyringe';
import type { ProtocolData } from '../../constants/peerEvent';
import { CATEGORY, VOICE_MESSAGE_ID } from '../../constants/peerEvent';
import { rtcAction } from '../../decorators/rtcAction';
import type { EmitterService } from 'service/dataExchanger/EmitterService';

@injectable()
export class VoicePeerEmitter {
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
