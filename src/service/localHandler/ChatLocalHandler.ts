import { localEventFeature } from '../../decorators/localEventFeature';
import { ChatAction, LocalFeature } from '../../constants/localEvent';
import { localEventAction } from '../../decorators/localEventAction';

@localEventFeature(LocalFeature.CHAT)
export class ChatLocalHandler {
  constructor() {}

  @localEventAction(ChatAction.SEND)
  send() {}

  @localEventAction(ChatAction.RECEIVE)
  receive() {}
}
