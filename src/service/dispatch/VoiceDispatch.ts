import { inject, injectable } from 'tsyringe';
import { Sender } from '../messages/Sender';
import type { ProtocolData } from 'constants/protocol';
import { CATEGORY, VOICE_MESSAGE_ID } from 'constants/protocol';
import { rtcMessage } from 'decorators/rtcMessage';

@injectable()
export class VoiceDispatch {
  constructor(@inject(Sender) private sender: Sender) {}

  @rtcMessage({
    category: CATEGORY.VOICE,
    messageId: VOICE_MESSAGE_ID.READY,
  })
  sendVoiceReadyMessage(data: ProtocolData) {}

  @rtcMessage({
    category: CATEGORY.VOICE,
    messageId: VOICE_MESSAGE_ID.READY_OK,
  })
  sendVoiceReadyOkMessage(data: ProtocolData) {}

  @rtcMessage({
    category: CATEGORY.VOICE,
    messageId: VOICE_MESSAGE_ID.CONNECTED,
  })
  sendVoiceConnectedMessage(data: ProtocolData) {}

  @rtcMessage({
    category: CATEGORY.VOICE,
    messageId: VOICE_MESSAGE_ID.DISCONNECT,
  })
  sendVoiceDisconnectMessage(data: ProtocolData) {}
}
