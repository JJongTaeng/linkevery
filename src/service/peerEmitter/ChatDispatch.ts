import { inject, injectable } from 'tsyringe';
import { Sender } from '../messages/Sender';
import type { ProtocolData } from 'constants/protocol';
import { CATEGORY, CHAT_MESSAGE_ID } from 'constants/protocol';
import { rtcMessage } from 'decorators/rtcMessage';

@injectable()
export class ChatDispatch {
  constructor(@inject(Sender) private sender: Sender) {}

  @rtcMessage({
    category: CATEGORY.CHAT,
    messageId: CHAT_MESSAGE_ID.SEND,
  })
  sendChatSendMessage(data: ProtocolData) {}

  @rtcMessage({
    category: CATEGORY.CHAT,
    messageId: CHAT_MESSAGE_ID.OK,
  })
  sendChatOkMessage(data: ProtocolData) {}

  @rtcMessage({
    category: CATEGORY.CHAT,
    messageId: CHAT_MESSAGE_ID.SYNC_CHAT_LIST,
  })
  sendSyncChatListMessage(data: ProtocolData) {}

  @rtcMessage({
    category: CATEGORY.CHAT,
    messageId: CHAT_MESSAGE_ID.SYNC_CHAT_LIST_OK,
  })
  sendSyncChatListOkMessage(data: ProtocolData) {}
}
