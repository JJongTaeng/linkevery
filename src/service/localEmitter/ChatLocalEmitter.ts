import { inject, injectable } from 'tsyringe';
import EventEmitter from 'events';
import { localAction } from '../../decorators/localAction';
import { ChatAction, LocalFeature } from '../../constants/localEvent';

@injectable()
export class ChatLocalEmitter {
  constructor(@inject('ee') private ee: EventEmitter) {}

  @localAction({
    feature: LocalFeature.CHAT,
    action: ChatAction.SEND,
  })
  send() {}

  @localAction({
    feature: LocalFeature.CHAT,
    action: ChatAction.RECEIVE,
  })
  receive() {}
}
