import { Protocol, ProtocolData } from '../../constants/protocol';
import { Sender } from '../messages/Sender';
import { rtcManager } from '../rtc/RTCManager';
import { socketManager } from './../socket/SocketManager';
import { DispatchEventService } from './DispatchEventService';

@MessageSender
export class DispatchEvent extends DispatchEventService {
  constructor() {
    super();
  }

  @SocketMessage()
  sendConnectionConnectMessage(data: ProtocolData) {}

  @SocketMessage()
  sendConnectionJoinRoomMessage(data: ProtocolData) {}

  @SocketMessage()
  sendConnectionDisconnectMessage(data: ProtocolData) {}

  @SocketMessage()
  sendSignalingStartMessage(data: ProtocolData) {}

  @SocketMessage()
  sendSignalingOfferMessage(data: ProtocolData) {}

  @SocketMessage()
  sendSignalingAnswerMessage(data: ProtocolData) {}

  @SocketMessage()
  sendSignalingIceMessage(data: ProtocolData) {}

  @SocketMessage()
  sendSignalingCreateDataChannelMessage(data: ProtocolData) {}

  @SocketMessage()
  sendSignalingConnectDataChannelMessage(data: ProtocolData) {}

  @RTCMessage()
  sendChatSendMessage(data: ProtocolData) {}

  @RTCMessage()
  sendChatOkMessage(data: ProtocolData) {}

  @SocketMessage()
  sendRoomMemberNamePreMessage(data: ProtocolData) {}

  @SocketMessage()
  sendRoomMemberNameMessage(data: ProtocolData) {}

  @SocketMessage()
  sendRoomMemberNamePostMessage(data: ProtocolData) {}

  @RTCMessage()
  sendRoomSyncChatListMessage(data: ProtocolData) {}

  @RTCMessage()
  sendRoomSyncChatListOkMessage(data: ProtocolData) {}

  @RTCMessage()
  sendVoiceReadyMessage(data: ProtocolData) {}

  @RTCMessage()
  sendVoiceReadyOkMessage(data: ProtocolData) {}

  @RTCMessage()
  sendVoiceConnectedMessage(data: ProtocolData) {}

  @RTCMessage()
  sendVoiceDisconnectMessage(data: ProtocolData) {}

  @RTCMessage()
  sendScreenShareReadyMessage(data: ProtocolData) {}

  @RTCMessage()
  sendScreenShareReadyOkMessage(data: ProtocolData) {}

  @RTCMessage()
  sendScreenShareConnectedMessage(data: ProtocolData) {}

  @RTCMessage()
  sendScreenShareDisconnectMessage(data: ProtocolData) {}

  @SocketMessage()
  sendNegotiationOfferMessage(data: ProtocolData) {}

  @SocketMessage()
  sendNegotiationAnswerMessage(data: ProtocolData) {}
}

function splitCamelCase(sentence: string) {
  // Use regular expression to split the camel case sentence
  var words = sentence.split(/(?=[A-Z])/);

  return words;
}

function RTCMessage() {
  return function (target: any, key: string, desc: PropertyDescriptor): void {
    const method = desc.value;

    let [_, category, ...rest] = splitCamelCase(key);
    rest.pop();

    category = category.toUpperCase();
    const messageId = rest.join('_').toUpperCase();

    desc.value = function (data: any) {
      target.send({ category, messageId, data, messageType: 'RTC' });
    };
  };
}

function SocketMessage() {
  return function (target: any, key: string, desc: PropertyDescriptor): void {
    const method = desc.value;

    let [_, category, ...rest] = splitCamelCase(key);
    rest.pop();

    category = category.toUpperCase();
    const messageId = rest.join('_').toUpperCase();

    desc.value = function (data: any) {
      target.send({ category, messageId, data, messageType: 'SOCKET' });
    };
  };
}

function MessageSender<T extends { new (...args: any[]): {} }>(constructor: T) {
  constructor.prototype.send = (protocol: Protocol) => {
    const sender = new Sender(socketManager, rtcManager);
    sender.send(protocol);
  };
}
