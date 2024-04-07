import { category } from '../../decorators/category.ts';
import {
  CATEGORY,
  DRAW_MESSAGE_ID,
  type EventType,
} from '../../constants/eventType.ts';
import { injectable } from 'tsyringe';
import { messageId } from '../../decorators/messageId.ts';

@category(CATEGORY.DRAW)
@injectable()
export class DrawHandler {
  constructor() {}

  @messageId(DRAW_MESSAGE_ID.START)
  startDraw(protocol: EventType) {}
}
