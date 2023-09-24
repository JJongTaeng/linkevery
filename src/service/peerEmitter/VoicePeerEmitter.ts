import { inject, injectable } from 'tsyringe';
import { Sender } from '../messages/Sender';
import type { ProtocolData } from '../../constants/peerEvent';
import { CATEGORY, VOICE_MESSAGE_ID } from '../../constants/peerEvent';
import { rtcAction } from '../../decorators/rtcAction';

@injectable()
export class VoicePeerEmitter {
  constructor(@inject(Sender) private sender: Sender) {}

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
