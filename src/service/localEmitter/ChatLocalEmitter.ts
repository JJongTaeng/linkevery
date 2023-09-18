import { inject, injectable } from 'tsyringe';
import EventEmitter from 'events';
import { localEmitter } from '../../decorators/localEmitter';
import { ChatAction, LocalFeature } from '../../constants/localEvent';

@injectable()
export class ChatLocalEmitter {
  constructor(@inject('ee') private ee: EventEmitter) {}

  @localEmitter({
    feature: LocalFeature.CHAT,
    action: ChatAction.SEND,
  })
  send() {}

  @localEmitter({
    feature: LocalFeature.CHAT,
    action: ChatAction.RECEIVE,
  })
  receive() {}
}
