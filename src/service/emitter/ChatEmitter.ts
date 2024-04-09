import { inject, injectable } from 'tsyringe';
import type { ProtocolData } from 'constants/eventType.ts';
import { CATEGORY, CHAT_MESSAGE_ID } from 'constants/eventType.ts';
import type { EmitterService } from 'service/emitter/EmitterService';
import { socketAction } from 'decorators/socketAction.ts';

@injectable()
export class ChatEmitter {
  constructor(@inject('EmitterService') private sender: EmitterService) {}

  @socketAction({
    category: CATEGORY.CHAT,
    messageId: CHAT_MESSAGE_ID.SEND,
  })
  sendChatSendMessage(data: ProtocolData) {}

  @socketAction({
    category: CATEGORY.CHAT,
    messageId: CHAT_MESSAGE_ID.OK,
  })
  sendChatOkMessage(data: ProtocolData) {}

  @socketAction({
    category: CATEGORY.CHAT,
    messageId: CHAT_MESSAGE_ID.SYNC_CHAT_LIST,
  })
  sendSyncChatListMessage(data: ProtocolData) {}

  @socketAction({
    category: CATEGORY.CHAT,
    messageId: CHAT_MESSAGE_ID.SYNC_CHAT_LIST_OK,
  })
  sendSyncChatListOkMessage(data: ProtocolData) {}
}
