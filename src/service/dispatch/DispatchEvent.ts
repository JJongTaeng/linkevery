import { Socket } from 'socket.io-client';
import {
  EVENT_NAME,
  MESSAGE_TYPE,
  Protocol,
  ProtocolData,
} from '../../constants/protocol';
import { chatMessage } from '../messages/chat';
import { connectMessage, disconnectMessage } from '../messages/connection';
import {
  requestMemberNameMessage,
  responseMemberNameMessage,
} from '../messages/room';
import {
  answerMessage,
  createDataChannelMessage,
  iceMessage,
  joinRoomMessage,
  offerMessage,
} from '../messages/signaling';
import {
  voiceAnswerMessage,
  voiceDisconnectMessage,
  voiceIceMessage,
  voiceJoinMessage,
  voiceOfferMessage,
} from '../messages/voice';
import { RTCManager } from '../rtc/RTCManager';
import { DispatchEventService } from './DispatchEventService';

export class DispatchEvent extends DispatchEventService {
  constructor(private socket: Socket, private rtcManager: RTCManager) {
    super();
  }

  sendConnectMessage(data: ProtocolData) {
    this.send(connectMessage(data));
  }

  sendJoinRoomMessage(data: ProtocolData) {
    this.send(joinRoomMessage(data));
  }

  sendOfferMessage(data: ProtocolData) {
    this.send(offerMessage(data));
  }

  sendAnswerMessage(data: ProtocolData) {
    this.send(answerMessage(data));
  }

  sendIceMessage(data: ProtocolData) {
    this.send(iceMessage(data));
  }

  sendCreateDataChannelMessage(data: ProtocolData) {
    this.send(createDataChannelMessage(data));
  }

  sendChatMessage(data: ProtocolData) {
    this.send(chatMessage(data));
  }

  sendDisconnectMessage(data: ProtocolData) {
    this.send(disconnectMessage(data));
  }

  sendRequestMemberMessage(data: ProtocolData) {
    this.send(requestMemberNameMessage(data));
  }

  sendResponseMemberMessage(data: ProtocolData) {
    this.send(responseMemberNameMessage(data));
  }

  sendVoiceJoinMessage(data: ProtocolData) {
    this.send(voiceJoinMessage(data));
  }

  sendVoiceOfferMessage(data: ProtocolData) {
    this.send(voiceOfferMessage(data));
  }

  sendVoiceAnswerMessage(data: ProtocolData) {
    this.send(voiceAnswerMessage(data));
  }

  sendVoiceIceMessage(data: ProtocolData) {
    this.send(voiceIceMessage(data));
  }

  sendVoiceDisconnectMessage(data: ProtocolData) {
    this.send(voiceDisconnectMessage(data));
  }

  send(protocol: Protocol) {
    if (protocol.messageType === MESSAGE_TYPE.SOCKET) {
      console.debug('[send] ', protocol);
      this.socket.emit(EVENT_NAME, protocol);
    } else if (protocol.messageType === MESSAGE_TYPE.RTC) {
      const { to } = protocol.data;
      if (to) this.rtcManager.sendTo(protocol);
      else this.rtcManager.sendAll(protocol);
    }
  }
}
