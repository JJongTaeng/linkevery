import { inject, injectable } from 'tsyringe';
import EventEmitter from 'events';
import { localAction } from '../../decorators/localAction';
import { CATEGORY, ROOM_MESSAGE_ID } from '../../constants/localEvent';

@injectable()
export class RoomLocalEmitter {
  constructor(@inject('ee') private ee: EventEmitter) {}

  @localAction({
    category: CATEGORY.ROOM,
    messageId: ROOM_MESSAGE_ID.LEAVE,
  })
  leave() {}

  @localAction({
    category: CATEGORY.ROOM,
    messageId: ROOM_MESSAGE_ID.JOIN,
  })
  joinRoom() {}
}
