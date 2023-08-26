import {
  CATEGORY,
  CHAT_MESSAGE_ID,
  CONNECTION_MESSAGE_ID,
  MessageId,
  NEGOTIATION_MESSAGE_ID,
  Protocol,
  ProtocolData,
  ROOM_MESSAGE_ID,
  SCREEN_SHARE_MESSAGE_ID,
  SIGNALING_MESSAGE_ID,
  VOICE_MESSAGE_ID,
} from '../../constants/protocol';
import { Sender } from '../messages/Sender';
import { rtcManager } from '../rtc/RTCManager';
import { storage } from '../storage/StorageService';
import { socketManager } from './../socket/SocketManager';
import { DispatchEventService } from './DispatchEventService';

@MessageSender
export class DispatchEvent extends DispatchEventService {
  constructor() {
    super();
  }

  @SocketMessage({
    category: CATEGORY.CONNECTION,
    messageId: CONNECTION_MESSAGE_ID.CONNECT,
  })
  sendConnectionConnectMessage(data: ProtocolData) {}

  @SocketMessage({
    category: CATEGORY.CONNECTION,
    messageId: CONNECTION_MESSAGE_ID.JOIN_ROOM,
  })
  sendConnectionJoinRoomMessage(data: ProtocolData) {}

  @SocketMessage({
    category: CATEGORY.CONNECTION,
    messageId: CONNECTION_MESSAGE_ID.DISCONNECT,
  })
  sendConnectionDisconnectMessage(data: ProtocolData) {}

  @SocketMessage({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.START,
  })
  sendSignalingStartMessage(data: ProtocolData) {}

  @SocketMessage({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.OFFER,
  })
  sendSignalingOfferMessage(data: ProtocolData) {}

  @SocketMessage({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.ANSWER,
  })
  sendSignalingAnswerMessage(data: ProtocolData) {}

  @SocketMessage({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.ICE,
  })
  sendSignalingIceMessage(data: ProtocolData) {}

  @SocketMessage({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.CREATE_DATA_CHANNEL,
  })
  sendSignalingCreateDataChannelMessage(data: ProtocolData) {}

  @SocketMessage({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.CONNECT_DATA_CHANNEL,
  })
  sendSignalingConnectDataChannelMessage(data: ProtocolData) {}

  @SocketMessage({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.END,
  })
  sendSignalingEndMessage(data: ProtocolData) {}

  @SocketMessage({
    category: CATEGORY.SIGNALING,
    messageId: SIGNALING_MESSAGE_ID.END_OK,
  })
  sendSignalingEndOkMessage(data: ProtocolData) {}

  @RTCMessage({
    category: CATEGORY.CHAT,
    messageId: CHAT_MESSAGE_ID.SEND,
  })
  sendChatSendMessage(data: ProtocolData) {}

  @RTCMessage({
    category: CATEGORY.CHAT,
    messageId: CHAT_MESSAGE_ID.OK,
  })
  sendChatOkMessage(data: ProtocolData) {}

  @SocketMessage({
    category: CATEGORY.ROOM,
    messageId: ROOM_MESSAGE_ID.MEMBER_NAME_PRE,
  })
  sendRoomMemberNamePreMessage(data: ProtocolData) {}

  @SocketMessage({
    category: CATEGORY.ROOM,
    messageId: ROOM_MESSAGE_ID.MEMBER_NAME,
  })
  sendRoomMemberNameMessage(data: ProtocolData) {}

  @SocketMessage({
    category: CATEGORY.ROOM,
    messageId: ROOM_MESSAGE_ID.MEMBER_NAME_POST,
  })
  sendRoomMemberNamePostMessage(data: ProtocolData) {}

  @RTCMessage({
    category: CATEGORY.ROOM,
    messageId: ROOM_MESSAGE_ID.SYNC_CHAT_LIST,
  })
  sendRoomSyncChatListMessage(data: ProtocolData) {}

  @RTCMessage({
    category: CATEGORY.ROOM,
    messageId: ROOM_MESSAGE_ID.SYNC_CHAT_LIST_OK,
  })
  sendRoomSyncChatListOkMessage(data: ProtocolData) {}

  @RTCMessage({
    category: CATEGORY.VOICE,
    messageId: VOICE_MESSAGE_ID.READY,
  })
  sendVoiceReadyMessage(data: ProtocolData) {}

  @RTCMessage({
    category: CATEGORY.VOICE,
    messageId: VOICE_MESSAGE_ID.READY_OK,
  })
  sendVoiceReadyOkMessage(data: ProtocolData) {}

  @RTCMessage({
    category: CATEGORY.VOICE,
    messageId: VOICE_MESSAGE_ID.CONNECTED,
  })
  sendVoiceConnectedMessage(data: ProtocolData) {}

  @RTCMessage({
    category: CATEGORY.VOICE,
    messageId: VOICE_MESSAGE_ID.DISCONNECT,
  })
  sendVoiceDisconnectMessage(data: ProtocolData) {}

  @RTCMessage({
    category: CATEGORY.SCREEN,
    messageId: SCREEN_SHARE_MESSAGE_ID.READY,
  })
  sendScreenReadyMessage(data: ProtocolData) {}

  @RTCMessage({
    category: CATEGORY.SCREEN,
    messageId: SCREEN_SHARE_MESSAGE_ID.READY_OK,
  })
  sendScreenReadyOkMessage(data: ProtocolData) {}

  @RTCMessage({
    category: CATEGORY.SCREEN,
    messageId: SCREEN_SHARE_MESSAGE_ID.CONNECTED,
  })
  sendScreenConnectedMessage(data: ProtocolData) {}

  @RTCMessage({
    category: CATEGORY.SCREEN,
    messageId: SCREEN_SHARE_MESSAGE_ID.DISCONNECT,
  })
  sendScreenDisconnectMessage(data: ProtocolData) {}

  @SocketMessage({
    category: CATEGORY.NEGOTIATION,
    messageId: NEGOTIATION_MESSAGE_ID.OFFER,
  })
  sendNegotiationOfferMessage(data: ProtocolData) {}

  @SocketMessage({
    category: CATEGORY.NEGOTIATION,
    messageId: NEGOTIATION_MESSAGE_ID.ANSWER,
  })
  sendNegotiationAnswerMessage(data: ProtocolData) {}
}

function RTCMessage({
  category,
  messageId,
}: {
  category: CATEGORY;
  messageId: MessageId;
}) {
  return function (target: any, key: string, desc: PropertyDescriptor): void {
    desc.value = function (data: any) {
      const clientId = storage.getItem('clientId');
      target.send({
        category,
        messageId,
        data,
        messageType: 'RTC',
        from: clientId,
      });
    };
  };
}

function SocketMessage({
  category,
  messageId,
}: {
  category: CATEGORY;
  messageId: MessageId;
}) {
  return function (target: any, key: string, desc: PropertyDescriptor): void {
    desc.value = function (data: any) {
      const clientId = storage.getItem('clientId');
      target.send({
        category,
        messageId,
        data,
        messageType: 'SOCKET',
        from: clientId,
      });
    };
  };
}

function MessageSender<T extends { new (...args: any[]): {} }>(constructor: T) {
  constructor.prototype.send = (protocol: Protocol) => {
    const sender = new Sender(socketManager, rtcManager);
    sender.send(protocol);
  };
}
