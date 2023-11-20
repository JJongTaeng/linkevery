import type { ProtocolData } from '../../constants/eventType';
import { CATEGORY, CONNECTION_MESSAGE_ID } from '../../constants/eventType';
import { socketAction } from '../../decorators/socketAction';
import { inject, injectable } from 'tsyringe';
import type { EmitterService } from 'service/emitter/EmitterService';

@injectable()
export class ConnectionPeerEmitter {
  constructor(@inject('EmitterService') private sender: EmitterService) {}

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
