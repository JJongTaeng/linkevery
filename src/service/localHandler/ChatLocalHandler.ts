import { CATEGORY, CHAT_MESSAGE_ID } from '../../constants/localEvent';
import { localCategory } from '../../decorators/localCategory';
import { localMessageId } from '../../decorators/localMessageId';

@localCategory(CATEGORY.CHAT)
export class ChatLocalHandler {
  constructor() {}

  @localMessageId(CHAT_MESSAGE_ID.SEND)
  send() {}

  @localMessageId(CHAT_MESSAGE_ID.RECEIVE)
  receive() {}
}
