import {
  CATEGORY,
  EVENT_NAME,
  HandlerMap,
  Protocol,
} from "../../constants/protocol";
import { connectionHandlers } from "./connectionHandlers";
import { Socket } from "socket.io-client";
import { DispatchEvent } from "../dispatch/DispatchEvent";
import { signalingHandlers } from "./signalingHandlers";
import { chatHandlers } from "./chatHandlers";
import { RTCManager } from "../rtc/RTCManager";

type CategoryHandlers = { [key in CATEGORY]: HandlerMap<any> };

export class HandlerManager {
  private handlers: CategoryHandlers = {
    [CATEGORY.CONNECTION]: connectionHandlers,
    [CATEGORY.SIGNALING]: signalingHandlers,
    [CATEGORY.CHAT]: chatHandlers,
  };
  constructor(
    private socket: Socket,
    private rtcManager: RTCManager,
    private dispatch: DispatchEvent
  ) {
    this.subscribeHandlers();
  }

  subscribeHandlers() {
    this.socket.on(EVENT_NAME, (protocol: Protocol) => {
      console.debug("[receive] ", protocol);
      this.handlers[protocol.category][protocol.messageId](
        protocol,
        this.dispatch
      );
    });
    this.rtcManager.on(RTCManager.RTC_EVENT.DATA, (protocol: Protocol) => {
      console.debug("[receive] ", protocol);
      this.handlers[protocol.category][protocol.messageId](
        protocol,
        this.dispatch
      );
    });
  }
}
