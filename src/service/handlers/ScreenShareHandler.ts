import type { HandlerParameter, Protocol } from '../../constants/protocol';
import {
  CATEGORY,
  HandlerFunction,
  SCREEN_SHARE_MESSAGE_ID,
} from '../../constants/protocol';
import { DispatchEvent } from '../dispatch/DispatchEvent';
import { RTCManagerService } from '../rtc/RTCManagerService';
import { category } from '../../decorators/category';
import { messageId } from '../../decorators/messageId';
import { store } from '../../store/store';
import { storage } from '../storage/StorageService';
import { userActions } from '../../store/features/userSlice';
import { container, inject, injectable } from 'tsyringe';
import { App } from '../app/App';
import { message } from 'antd';
import { roomActions } from '../../store/features/roomSlice';
import { VideoManager } from '../media/VideoManager';

interface ScreenShareHandlerInterface {
  ready: HandlerFunction;
  readyOk: HandlerFunction;
  connected: HandlerFunction;
  disconnect: HandlerFunction;
}

@category(CATEGORY.SCREEN)
@injectable()
export class ScreenShareHandler implements ScreenShareHandlerInterface {
  constructor(@inject(VideoManager) private videoManager: VideoManager) {}
  @messageId(SCREEN_SHARE_MESSAGE_ID.READY)
  ready(protocol: Protocol, { dispatch, rtcManager }: HandlerParameter) {
    if (!store.getState().user.voiceStatus) {
      return;
    }

    dispatch.sendScreenReadyOkMessage({ to: protocol.from });
  }

  @messageId(SCREEN_SHARE_MESSAGE_ID.READY_OK)
  async readyOk(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: {
      dispatch: DispatchEvent;
      rtcManager: RTCManagerService;
    },
  ) {
    const { userKey } = storage.getAll();
    store.dispatch(userActions.changeScreenShareStatus(true));

    const voiceMember = [];
    const member = store.getState().room.current.member;
    for (const key in member) {
      if (member[key].voiceStatus) voiceMember.push(member[key].clientId);
    }
    try {
      const app = container.resolve(App);

      let mediaStream = app.screenMediaStream;
      if (!mediaStream) {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        app.screenMediaStream = mediaStream;
      }

      for (const clientId of voiceMember) {
        mediaStream?.getTracks().forEach((track: any) => {
          const peer = rtcManager.getPeer(clientId);
          peer.addTrack(track, mediaStream!);
        });
        dispatch.sendScreenConnectedMessage({ to: clientId, userKey });
      }
    } catch (error: any) {
      if (error?.name === 'NotAllowedError') {
        message.info(`화면공유 권한 설정을 확인해주세요.`);
        store.dispatch(userActions.changeScreenShareStatus(false));
      }
    }
  }

  @messageId(SCREEN_SHARE_MESSAGE_ID.CONNECTED)
  connected(protocol: Protocol, { dispatch, rtcManager }: HandlerParameter) {
    store.dispatch(
      roomActions.setMemberScreenShareStatus({
        userKey: protocol.data.userKey,
        screenShareStatus: true,
      }),
    );
  }

  @messageId(SCREEN_SHARE_MESSAGE_ID.DISCONNECT)
  disconnect(protocol: Protocol, { dispatch, rtcManager }: HandlerParameter) {
    const { from } = protocol;

    store.dispatch(
      roomActions.setMemberScreenShareStatus({
        userKey: protocol.data.userKey,
        screenShareStatus: false,
      }),
    );
    this.videoManager.clearVideo(from);
  }
}
