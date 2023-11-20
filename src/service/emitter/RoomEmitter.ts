import { inject, injectable } from 'tsyringe';
import { eventAction } from '../../decorators/eventAction';
import { CATEGORY, ROOM_MESSAGE_ID } from '../../constants/eventType';
import { EventManager } from '../event/EventManager';

@injectable()
export class RoomEmitter {
  constructor(@inject(EventManager) private eventManager: EventManager) {}

  @eventAction({
    category: CATEGORY.ROOM,
    messageId: ROOM_MESSAGE_ID.LEAVE,
  })
  leave() {}

  @eventAction({
    category: CATEGORY.ROOM,
    messageId: ROOM_MESSAGE_ID.JOIN,
  })
  joinRoom() {}
}
