import { CATEGORY, EVENT_NAME, HandlerMap, Protocol } from "./protocol";
import { connectionHandlers } from "./connectionHandlers";
import { Socket } from "socket.io-client";
import { DispatchEvent } from "./DispatchEvent";
import { signalingHandlers } from "./signalingHandlers";
import { chatHandlers } from "./chatHandlers";
import { RTCManager } from "../lib/RTCManager";

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
    console.log("construct HandlerManger");
    this.subscribeHandlers();
  }

  subscribeHandlers() {
    this.socket.on(EVENT_NAME, (protocol: Protocol) => {
      console.log("[receive] ", protocol);
      this.handlers[protocol.category][protocol.messageId](
        protocol,
        this.dispatch
      );
    });
    this.rtcManager.on(RTCManager.RTC_EVENT.DATA, (protocol: Protocol) => {
      console.log("[receive] ", protocol);
      this.handlers[protocol.category][protocol.messageId](
        protocol,
        this.dispatch
      );
    });
  }
}
