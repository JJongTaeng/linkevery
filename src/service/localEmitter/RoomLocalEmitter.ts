import { inject, injectable } from 'tsyringe';
import EventEmitter from 'events';
import { localEmitter } from '../../decorators/localEmitter';
import { LocalFeature, RoomAction } from '../../constants/localEvent';

@injectable()
export class RoomLocalEmitter {
  constructor(@inject('ee') private ee: EventEmitter) {}

  @localEmitter({
    feature: LocalFeature.ROOM,
    action: RoomAction.LEAVE,
  })
  leave() {}
}
