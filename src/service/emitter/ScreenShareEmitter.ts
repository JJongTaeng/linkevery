import { inject, injectable } from 'tsyringe';
import type { ProtocolData } from 'constants/eventType';
import { CATEGORY, SCREEN_SHARE_MESSAGE_ID } from 'constants/eventType';
import { rtcAction } from 'decorators/rtcAction';
import type { EmitterService } from 'service/emitter/EmitterService';
import { broadcastAction } from 'decorators/broadcastAction.ts';

@injectable()
export class ScreenShareEmitter {
  constructor(@inject('EmitterService') private sender: EmitterService) {}

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

  @broadcastAction({
    category: CATEGORY.SCREEN,
    messageId: SCREEN_SHARE_MESSAGE_ID.POPUP_OPEN,
  })
  sendScreenPopupOpenMessage(data: ProtocolData) {}
}
