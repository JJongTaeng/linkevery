import { inject, injectable } from 'tsyringe';
import { Sender } from '../messages/Sender';
import type { ProtocolData } from '../../constants/peerEvent';
import { CATEGORY, SCREEN_SHARE_MESSAGE_ID } from '../../constants/peerEvent';
import { rtcAction } from '../../decorators/rtcAction';

@injectable()
export class ScreenSharePeerEmitter {
  constructor(@inject(Sender) private sender: Sender) {}

  @rtcAction({
    category: CATEGORY.SCREEN,
    messageId: SCREEN_SHARE_MESSAGE_ID.READY,
  })
  sendScreenReadyMessage(data: ProtocolData) {}

  @rtcAction({
    category: CATEGORY.SCREEN,
    messageId: SCREEN_SHARE_MESSAGE_ID.READY_OK,
  })
  sendScreenReadyOkMessage(data: ProtocolData) {}

  @rtcAction({
    category: CATEGORY.SCREEN,
    messageId: SCREEN_SHARE_MESSAGE_ID.CONNECTED,
  })
  sendScreenConnectedMessage(data: ProtocolData) {}

  @rtcAction({
    category: CATEGORY.SCREEN,
    messageId: SCREEN_SHARE_MESSAGE_ID.DISCONNECT,
  })
  sendScreenDisconnectMessage(data: ProtocolData) {}
}
