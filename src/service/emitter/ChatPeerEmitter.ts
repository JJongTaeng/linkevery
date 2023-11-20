import { inject, injectable } from 'tsyringe';
import type { ProtocolData } from '../../constants/peerEvent';
import { CATEGORY, CHAT_MESSAGE_ID } from '../../constants/peerEvent';
import { rtcAction } from '../../decorators/rtcAction';
import type { EmitterService } from 'service/emitter/EmitterService';

@injectable()
export class ChatPeerEmitter {
  constructor(@inject('EmitterService') private sender: EmitterService) {}

  @rtcAction({
    category: CATEGORY.CHAT,
    messageId: CHAT_MESSAGE_ID.SEND,
  })
  sendChatSendMessage(data: ProtocolData) {}

  @rtcAction({
    category: CATEGORY.CHAT,
    messageId: CHAT_MESSAGE_ID.OK,
  })
  sendChatOkMessage(data: ProtocolData) {}

  @rtcAction({
    category: CATEGORY.CHAT,
    messageId: CHAT_MESSAGE_ID.SYNC_CHAT_LIST,
  })
  sendSyncChatListMessage(data: ProtocolData) {}

  @rtcAction({
    category: CATEGORY.CHAT,
    messageId: CHAT_MESSAGE_ID.SYNC_CHAT_LIST_OK,
  })
  sendSyncChatListOkMessage(data: ProtocolData) {}
}
