import { Socket } from 'socket.io-client';
import {
  EVENT_NAME,
  MESSAGE_TYPE,
  Protocol,
  ProtocolData,
} from '../../constants/protocol';
import { chatMessage, okMessage } from '../messages/chat';
import {
  connectMessage,
  disconnectMessage,
  joinRoomMessage,
} from '../messages/connection';
import {
  negotiationAnswerMessage,
  negotiationOfferMessage,
} from '../messages/negotiation';
import {
  memberNameMessage,
  memberNameOkMessage,
  syncChatListMessage,
  syncChatListOkMessage,
} from '../messages/room';
import {
  screenShareConnectedMessage,
  screenShareDisconnectMessage,
  screenShareReadyMessage,
  screenShareReadyOkMessage,
} from '../messages/screenShare';
import {
  answerMessage,
  connectDataChannelMessage,
  createDataChannelMessage,
  iceMessage,
  offerMessage,
  signalingStartMessage,
} from '../messages/signaling';
import {
  voiceConnectedMessage,
  voiceDisconnectMessage,
  voiceReadyMessage,
  voiceReadyOkMessage,
} from '../messages/voice';
import { RTCManager } from '../rtc/RTCManager';
import { memberNamePreMessage } from './../messages/room';
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

  sendSignalingStartMessage(data: ProtocolData) {
    this.send(signalingStartMessage(data));
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

  sendConnectDataChannelMessage(data: ProtocolData) {
    this.send(connectDataChannelMessage(data));
  }

  sendChatMessage(data: ProtocolData) {
    this.send(chatMessage(data));
  }
  sendChatOkMessage(data: ProtocolData) {
    this.send(okMessage(data));
  }
  sendDisconnectMessage(data: ProtocolData) {
    this.send(disconnectMessage(data));
  }

  sendMemberNamePreMessage(data: ProtocolData) {
    this.send(memberNamePreMessage(data));
  }

  sendMemberNameMessage(data: ProtocolData) {
    this.send(memberNameMessage(data));
  }

  sendMemberNameOkMessage(data: ProtocolData) {
    this.send(memberNameOkMessage(data));
  }

  sendSyncChatListMessage(data: ProtocolData) {
    this.send(syncChatListMessage(data));
  }

  sendSyncChatListOkMessage(data: ProtocolData) {
    this.send(syncChatListOkMessage(data));
  }

  sendVoiceReadyMessage(data: ProtocolData) {
    this.send(voiceReadyMessage(data));
  }

  sendVoiceReadyOkMessage(data: ProtocolData) {
    this.send(voiceReadyOkMessage(data));
  }

  sendVoiceConnectedMessage(data: ProtocolData) {
    this.send(voiceConnectedMessage(data));
  }

  sendVoiceDisconnectMessage(data: ProtocolData) {
    this.send(voiceDisconnectMessage(data));
  }

  sendScreenShareReadyMessage(data: ProtocolData) {
    this.send(screenShareReadyMessage(data));
  }

  sendScreenShareReadyOkMessage(data: ProtocolData) {
    this.send(screenShareReadyOkMessage(data));
  }
  sendScreenShareConnectedMessage(data: ProtocolData) {
    this.send(screenShareConnectedMessage(data));
  }

  sendScreenShareDisconnectMessage(data: ProtocolData) {
    this.send(screenShareDisconnectMessage(data));
  }

  sendNegotiationOfferMessage(data: ProtocolData) {
    this.send(negotiationOfferMessage(data));
  }

  sendNegotiationAnswerMessage(data: ProtocolData) {
    this.send(negotiationAnswerMessage(data));
  }

  send(protocol: Protocol) {
    if (protocol.messageType === MESSAGE_TYPE.SOCKET) {
      console.debug('%c[send] ', 'color:green;font-weight:bold;', protocol);
      this.socket.emit(EVENT_NAME, protocol);
    } else if (protocol.messageType === MESSAGE_TYPE.RTC) {
      console.debug('%c[send] ', 'color:green;font-weight:bold;', protocol);
      const { to } = protocol.data;
      if (to) this.rtcManager.sendTo(protocol);
      else this.rtcManager.sendAll(protocol);
    }
  }
}
