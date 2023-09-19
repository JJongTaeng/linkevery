import type { ProtocolData } from '../../constants/peerEvent';
import { CATEGORY, CONNECTION_MESSAGE_ID } from '../../constants/peerEvent';
import { socketAction } from '../../decorators/socketAction';
import { inject, injectable } from 'tsyringe';
import { Sender } from '../messages/Sender';

@injectable()
export class ConnectionPeerEmitter {
  constructor(@inject(Sender) private sender: Sender) {}

  @socketAction({
    category: CATEGORY.CONNECTION,
    messageId: CONNECTION_MESSAGE_ID.CONNECT,
  })
  sendConnectionConnectMessage(data: ProtocolData) {}

  @socketAction({
    category: CATEGORY.CONNECTION,
    messageId: CONNECTION_MESSAGE_ID.JOIN_ROOM,
  })
  sendConnectionJoinRoomMessage(data: ProtocolData) {}

  @socketAction({
    category: CATEGORY.CONNECTION,
    messageId: CONNECTION_MESSAGE_ID.DISCONNECT,
  })
  sendConnectionDisconnectMessage(data: ProtocolData) {}
}
