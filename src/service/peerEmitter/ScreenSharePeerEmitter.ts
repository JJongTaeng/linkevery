import { inject, injectable } from 'tsyringe';
import { Sender } from '../messages/Sender';
import type { ProtocolData } from 'constants/protocol';
import { CATEGORY, SCREEN_SHARE_MESSAGE_ID } from 'constants/protocol';
import { rtcMessage } from 'decorators/rtcMessage';

@injectable()
export class ScreenSharePeerEmitter {
  constructor(@inject(Sender) private sender: Sender) {}

  @rtcMessage({
    category: CATEGORY.SCREEN,
    messageId: SCREEN_SHARE_MESSAGE_ID.READY,
  })
  sendScreenReadyMessage(data: ProtocolData) {}

  @rtcMessage({
    category: CATEGORY.SCREEN,
    messageId: SCREEN_SHARE_MESSAGE_ID.READY_OK,
  })
  sendScreenReadyOkMessage(data: ProtocolData) {}

  @rtcMessage({
    category: CATEGORY.SCREEN,
    messageId: SCREEN_SHARE_MESSAGE_ID.CONNECTED,
  })
  sendScreenConnectedMessage(data: ProtocolData) {}

  @rtcMessage({
    category: CATEGORY.SCREEN,
    messageId: SCREEN_SHARE_MESSAGE_ID.DISCONNECT,
  })
  sendScreenDisconnectMessage(data: ProtocolData) {}
}
