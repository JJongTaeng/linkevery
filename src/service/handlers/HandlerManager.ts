import { Socket } from 'socket.io-client';
import {
  CATEGORY,
  EVENT_NAME,
  HandlerMap,
  Protocol,
} from '../../constants/protocol';
import { DispatchEvent } from '../dispatch/DispatchEvent';
import { RTCManager } from '../rtc/RTCManager';
import { RTCVoiceManager } from '../rtc/RTCVoiceManager';
import { RTC_MANAGER_TYPE } from './../../constants/protocol';
import { chatHandlers } from './chatHandlers';
import { connectionHandlers } from './connectionHandlers';
import { roomHandlers } from './roomHandlers';
import { signalingHandlers } from './signalingHandlers';
import { voiceHandlers } from './voiceHandlers';

type CategoryHandlers = { [key in CATEGORY]: HandlerMap<any> };

export class HandlerManager {
  private handlers: CategoryHandlers = {
    [CATEGORY.CONNECTION]: connectionHandlers,
    [CATEGORY.SIGNALING]: signalingHandlers,
    [CATEGORY.CHAT]: chatHandlers,
    [CATEGORY.ROOM]: roomHandlers,
    [CATEGORY.VOICE]: voiceHandlers,
  };
  constructor(
    private socket: Socket,
    private rtcManager: RTCManager,
    private rtcVoiceManager: RTCVoiceManager,
    private dispatch: DispatchEvent,
  ) {
    this.subscribeHandlers();
  }

  subscribeHandlers() {
    this.socket.on(EVENT_NAME, (protocol: Protocol) => {
      console.debug('[receive] ', protocol);
      this.handlers[protocol.category][protocol.messageId](protocol, {
        dispatch: this.dispatch,
        rtcManager: this.rtcManager, // default rtc manager
        rtcManagerMap: {
          [RTC_MANAGER_TYPE.RTC_CHAT]: this.rtcManager,
          [RTC_MANAGER_TYPE.RTC_VOICE]: this.rtcVoiceManager,
          [RTC_MANAGER_TYPE.RTC_SCREEN_SHARE]: this.rtcManager,
        },
      });
    });
    this.rtcManager.on(RTCManager.RTC_EVENT.DATA, (protocol: Protocol) => {
      console.debug('[receive] ', protocol);
      this.handlers[protocol.category][protocol.messageId](protocol, {
        dispatch: this.dispatch,
        rtcManager: this.rtcManager,
        rtcManagerMap: {
          [RTC_MANAGER_TYPE.RTC_CHAT]: this.rtcManager,
          [RTC_MANAGER_TYPE.RTC_VOICE]: this.rtcVoiceManager,
          [RTC_MANAGER_TYPE.RTC_SCREEN_SHARE]: this.rtcManager,
        },
      });
    });
  }
}
