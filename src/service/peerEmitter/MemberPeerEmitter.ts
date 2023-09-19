import { socketMessage } from 'decorators/socketMessage';
import { Sender } from 'service/messages/Sender';
import { inject, injectable } from 'tsyringe';
import type { ProtocolData } from '../../constants/peerEvent';
import { CATEGORY, MEMBER_MESSAGE_ID } from '../../constants/peerEvent';

@injectable()
export class MemberPeerEmitter {
  constructor(@inject(Sender) private sender: Sender) {}

  @socketMessage({
    category: CATEGORY.MEMBER,
    messageId: MEMBER_MESSAGE_ID.NAME,
  })
  sendMemberNameMessage(data: ProtocolData) {}

  @socketMessage({
    category: CATEGORY.MEMBER,
    messageId: MEMBER_MESSAGE_ID.NAME_OK,
  })
  sendMemberNameOkMessage(data: ProtocolData) {}
}
