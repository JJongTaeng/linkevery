import type { ProtocolData } from '../../constants/protocol';
import {
  CATEGORY,
  CHAT_MESSAGE_ID,
  CONNECTION_MESSAGE_ID,
  MESSAGE_TYPE,
  NEGOTIATION_MESSAGE_ID,
  Protocol,
  ROOM_MESSAGE_ID,
  SCREEN_SHARE_MESSAGE_ID,
  SIGNALING_MESSAGE_ID,
  VOICE_MESSAGE_ID,
} from '../../constants/protocol';
import { Sender } from '../messages/Sender';
import { storage } from '../storage/StorageService';
import { inject, injectable } from 'tsyringe';

@injectable()
export class DispatchEvent {
  constructor(@inject(Sender) private sender: Sender) {}

  sendConnectionConnectMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.CONNECTION,
      messageId: CONNECTION_MESSAGE_ID.CONNECT,
      messageType: MESSAGE_TYPE.SOCKET,
    });
  }

  sendConnectionJoinRoomMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.CONNECTION,
      messageId: CONNECTION_MESSAGE_ID.JOIN_ROOM,
      messageType: MESSAGE_TYPE.SOCKET,
    });
  }

  sendConnectionDisconnectMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.CONNECTION,
      messageId: CONNECTION_MESSAGE_ID.DISCONNECT,
      messageType: MESSAGE_TYPE.SOCKET,
    });
  }

  sendSignalingStartMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.SIGNALING,
      messageId: SIGNALING_MESSAGE_ID.START,
      messageType: MESSAGE_TYPE.SOCKET,
    });
  }

  sendSignalingOfferMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.SIGNALING,
      messageId: SIGNALING_MESSAGE_ID.OFFER,
      messageType: MESSAGE_TYPE.SOCKET,
    });
  }

  sendSignalingAnswerMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.SIGNALING,
      messageId: SIGNALING_MESSAGE_ID.ANSWER,
      messageType: MESSAGE_TYPE.SOCKET,
    });
  }

  sendSignalingIceMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.SIGNALING,
      messageId: SIGNALING_MESSAGE_ID.ICE,
      messageType: MESSAGE_TYPE.SOCKET,
    });
  }

  sendSignalingCreateDataChannelMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.SIGNALING,
      messageId: SIGNALING_MESSAGE_ID.CREATE_DATA_CHANNEL,
      messageType: MESSAGE_TYPE.SOCKET,
    });
  }

  sendSignalingConnectDataChannelMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.SIGNALING,
      messageId: SIGNALING_MESSAGE_ID.CONNECT_DATA_CHANNEL,
      messageType: MESSAGE_TYPE.SOCKET,
    });
  }

  sendSignalingEndMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.SIGNALING,
      messageId: SIGNALING_MESSAGE_ID.END,
      messageType: MESSAGE_TYPE.SOCKET,
    });
  }

  sendSignalingEndOkMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.SIGNALING,
      messageId: SIGNALING_MESSAGE_ID.END_OK,
      messageType: MESSAGE_TYPE.SOCKET,
    });
  }

  sendChatSendMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.CHAT,
      messageId: CHAT_MESSAGE_ID.SEND,
      messageType: MESSAGE_TYPE.RTC,
    });
  }

  sendChatOkMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.CHAT,
      messageId: CHAT_MESSAGE_ID.OK,
      messageType: MESSAGE_TYPE.RTC,
    });
  }

  sendRoomMemberNamePreMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.ROOM,
      messageId: ROOM_MESSAGE_ID.MEMBER_NAME_PRE,
      messageType: MESSAGE_TYPE.SOCKET,
    });
  }

  sendRoomMemberNameMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.ROOM,
      messageId: ROOM_MESSAGE_ID.MEMBER_NAME,
      messageType: MESSAGE_TYPE.SOCKET,
    });
  }

  sendRoomMemberNamePostMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.ROOM,
      messageId: ROOM_MESSAGE_ID.MEMBER_NAME_POST,
      messageType: MESSAGE_TYPE.SOCKET,
    });
  }

  sendRoomSyncChatListMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.ROOM,
      messageId: ROOM_MESSAGE_ID.SYNC_CHAT_LIST,
      messageType: MESSAGE_TYPE.RTC,
    });
  }

  sendRoomSyncChatListOkMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.ROOM,
      messageId: ROOM_MESSAGE_ID.SYNC_CHAT_LIST_OK,
      messageType: MESSAGE_TYPE.RTC,
    });
  }

  sendVoiceReadyMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.VOICE,
      messageId: VOICE_MESSAGE_ID.READY,
      messageType: MESSAGE_TYPE.RTC,
    });
  }

  sendVoiceReadyOkMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.VOICE,
      messageId: VOICE_MESSAGE_ID.READY_OK,
      messageType: MESSAGE_TYPE.RTC,
    });
  }

  sendVoiceConnectedMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.VOICE,
      messageId: VOICE_MESSAGE_ID.CONNECTED,
      messageType: MESSAGE_TYPE.RTC,
    });
  }

  sendVoiceDisconnectMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.VOICE,
      messageId: VOICE_MESSAGE_ID.DISCONNECT,
      messageType: MESSAGE_TYPE.RTC,
    });
  }

  sendScreenReadyMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.SCREEN,
      messageId: SCREEN_SHARE_MESSAGE_ID.READY,
      messageType: MESSAGE_TYPE.RTC,
    });
  }
  sendScreenReadyOkMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.SCREEN,
      messageId: SCREEN_SHARE_MESSAGE_ID.READY_OK,
      messageType: MESSAGE_TYPE.RTC,
    });
  }

  sendScreenConnectedMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.SCREEN,
      messageId: SCREEN_SHARE_MESSAGE_ID.CONNECTED,
      messageType: MESSAGE_TYPE.RTC,
    });
  }

  sendScreenDisconnectMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.SCREEN,
      messageId: SCREEN_SHARE_MESSAGE_ID.DISCONNECT,
      messageType: MESSAGE_TYPE.RTC,
    });
  }

  sendNegotiationOfferMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.NEGOTIATION,
      messageId: NEGOTIATION_MESSAGE_ID.OFFER,
      messageType: MESSAGE_TYPE.SOCKET,
    });
  }

  sendNegotiationAnswerMessage(data: ProtocolData) {
    this.send({
      data,
      category: CATEGORY.NEGOTIATION,
      messageId: NEGOTIATION_MESSAGE_ID.ANSWER,
      messageType: MESSAGE_TYPE.SOCKET,
    });
  }

  send(protocol: Omit<Protocol, 'from'>) {
    const clientId = storage.getItem('clientId');
    this.sender.send({ ...protocol, from: clientId });
  }
}
