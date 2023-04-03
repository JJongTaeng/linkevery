import { Socket } from "socket.io-client";
import {
  CATEGORY,
  CHAT_MESSAGE_ID,
  CONNECTION_MESSAGE_ID,
  EVENT_NAME,
  MESSAGE_TYPE,
  Protocol,
  ProtocolData,
  SIGNALING_MESSAGE_ID,
} from "../../constants/protocol";
import { DispatchEventService } from "./DispatchEventService";
import { RTCManager } from "../rtc/RTCManager";

export class DispatchEvent extends DispatchEventService {
  constructor(private socket: Socket, private rtcManager: RTCManager) {
    super();
  }

  joinMessage(data: ProtocolData) {
    this.send({
      category: CATEGORY.CONNECTION,
      messageType: MESSAGE_TYPE.SOCKET,
      messageId: CONNECTION_MESSAGE_ID.JOIN,
      data,
    });
  }

  connectMessage(data: ProtocolData) {
    this.send({
      category: CATEGORY.CONNECTION,
      messageType: MESSAGE_TYPE.SOCKET,
      messageId: CONNECTION_MESSAGE_ID.CONNECT,
      data,
    });
  }

  offerMessage(data: ProtocolData) {
    this.send({
      category: CATEGORY.SIGNALING,
      messageId: SIGNALING_MESSAGE_ID.OFFER,
      messageType: MESSAGE_TYPE.SOCKET,
      data,
    });
  }

  answerMessage(data: ProtocolData) {
    this.send({
      category: CATEGORY.SIGNALING,
      messageId: SIGNALING_MESSAGE_ID.ANSWER,
      messageType: MESSAGE_TYPE.SOCKET,
      data,
    });
  }

  iceMessage(data: ProtocolData) {
    this.send({
      category: CATEGORY.SIGNALING,
      messageId: SIGNALING_MESSAGE_ID.ICE,
      messageType: MESSAGE_TYPE.SOCKET,
      data,
    });
  }

  chatMessage(data: ProtocolData) {
    this.send({
      category: CATEGORY.CHAT,
      messageId: CHAT_MESSAGE_ID.SEND,
      messageType: MESSAGE_TYPE.RTC,
      data,
    });
  }

  send(protocol: Protocol) {
    console.log("[send] ", protocol);
    if (protocol.messageType === MESSAGE_TYPE.SOCKET) {
      this.socket.emit(EVENT_NAME, protocol);
    } else if (protocol.messageType === MESSAGE_TYPE.RTC) {
      this.rtcManager.sendAll(protocol);
    }
  }
}
