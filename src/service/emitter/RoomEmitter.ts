import { inject, injectable } from 'tsyringe';
import { eventAction } from '../../decorators/eventAction';
import { CATEGORY, ROOM_MESSAGE_ID } from '../../constants/eventType';
import type { EmitterService } from './EmitterService';

@injectable()
export class RoomEmitter {
  constructor(@inject('EmitterService') private sender: EmitterService) {}

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
