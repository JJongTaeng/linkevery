import { inject, injectable } from 'tsyringe';
import { Sender } from '../messages/Sender';
import type { ProtocolData } from '../../constants/peerEvent';
import { CATEGORY, CHAT_MESSAGE_ID } from '../../constants/peerEvent';
import { rtcAction } from '../../decorators/rtcAction';

@injectable()
export class ChatPeerEmitter {
  constructor(@inject(Sender) private sender: Sender) {}

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
