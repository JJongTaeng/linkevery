import { inject, injectable } from 'tsyringe';
import type { EmitterService } from './EmitterService.ts';
import { CATEGORY, DRAW_MESSAGE_ID } from '../../constants/eventType.ts';
import type { ProtocolData } from '../../constants/eventType';
import { socketAction } from '../../decorators/socketAction.ts';

@injectable()
export class DrawEmitter {
  constructor(@inject('EmitterService') private sender: EmitterService) {}

  @socketAction({
    category: CATEGORY.DRAW,
    messageId: DRAW_MESSAGE_ID.START,
  })
  startDraw(data: ProtocolData) {}
}
