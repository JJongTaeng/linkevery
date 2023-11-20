import { socketAction } from '../../decorators/socketAction';
import { inject, injectable } from 'tsyringe';
import type { ProtocolData } from '../../constants/eventType';
import { CATEGORY, MEMBER_MESSAGE_ID } from '../../constants/eventType';
import type { EmitterService } from 'service/emitter/EmitterService';

@injectable()
export class MemberPeerEmitter {
  constructor(@inject('EmitterService') private sender: EmitterService) {}

  @socketAction({
    category: CATEGORY.MEMBER,
    messageId: MEMBER_MESSAGE_ID.NAME,
  })
  sendMemberNameMessage(data: ProtocolData) {}

  @socketAction({
    category: CATEGORY.MEMBER,
    messageId: MEMBER_MESSAGE_ID.NAME_OK,
  })
  sendMemberNameOkMessage(data: ProtocolData) {}
}
