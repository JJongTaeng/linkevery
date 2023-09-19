import type { ProtocolData } from '../../constants/peerEvent';
import { CATEGORY, CONNECTION_MESSAGE_ID } from '../../constants/peerEvent';
import { socketMessage } from 'decorators/socketMessage';
import { inject, injectable } from 'tsyringe';
import { Sender } from '../messages/Sender';

@injectable()
export class ConnectionPeerEmitter {
  constructor(@inject(Sender) private sender: Sender) {}

  @socketMessage({
    category: CATEGORY.CONNECTION,
    messageId: CONNECTION_MESSAGE_ID.CONNECT,
  })
  sendConnectionConnectMessage(data: ProtocolData) {}

  @socketMessage({
    category: CATEGORY.CONNECTION,
    messageId: CONNECTION_MESSAGE_ID.JOIN_ROOM,
  })
  sendConnectionJoinRoomMessage(data: ProtocolData) {}

  @socketMessage({
    category: CATEGORY.CONNECTION,
    messageId: CONNECTION_MESSAGE_ID.DISCONNECT,
  })
  sendConnectionDisconnectMessage(data: ProtocolData) {}
}
