import { inject, injectable } from 'tsyringe';
import EventEmitter from 'events';
import { localAction } from '../../decorators/localAction';
import { CATEGORY, CHAT_MESSAGE_ID } from '../../constants/localEvent';

@injectable()
export class ChatLocalEmitter {
  constructor(@inject('ee') private ee: EventEmitter) {}

  @localAction({
    category: CATEGORY.CHAT,
    messageId: CHAT_MESSAGE_ID.SEND,
  })
  send() {}

  @localAction({
    category: CATEGORY.CHAT,
    messageId: CHAT_MESSAGE_ID.RECEIVE,
  })
  receive() {}
}
