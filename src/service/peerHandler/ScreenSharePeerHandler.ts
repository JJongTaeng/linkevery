import type { Protocol } from 'constants/protocol';
import { CATEGORY, SCREEN_SHARE_MESSAGE_ID } from 'constants/protocol';
import { category } from 'decorators/category';
import { messageId } from 'decorators/messageId';
import { store } from 'store/store';
import { storage } from 'service/storage/StorageService';
import { userActions } from 'store/features/userSlice';
import { container, inject, injectable } from 'tsyringe';
import { App } from 'service/app/App';
import { message } from 'antd';
import { roomActions } from 'store/features/roomSlice';
import { VideoManager } from 'service/media/VideoManager';
import { RTCManager } from 'service/rtc/RTCManager';
import { ScreenSharePeerEmitter } from '../peerEmitter/ScreenSharePeerEmitter';

@category(CATEGORY.SCREEN)
@injectable()
export class ScreenSharePeerHandler {
  constructor(
    @inject(VideoManager) private videoManager: VideoManager,
    @inject(ScreenSharePeerEmitter)
    private screenSharePeerEmitter: ScreenSharePeerEmitter,
    @inject(RTCManager) private rtcManager: RTCManager,
  ) {}
  @messageId(SCREEN_SHARE_MESSAGE_ID.READY)
  ready(protocol: Protocol) {
    if (!store.getState().user.voiceStatus) {
      return;
    }

    this.screenSharePeerEmitter.sendScreenReadyOkMessage({ to: protocol.from });
  }

  @messageId(SCREEN_SHARE_MESSAGE_ID.READY_OK)
  async readyOk(protocol: Protocol) {
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
          const peer = this.rtcManager.getPeer(clientId);
          peer.addTrack(track, mediaStream!);
        });
        this.screenSharePeerEmitter.sendScreenConnectedMessage({
          to: clientId,
          userKey,
        });
      }
    } catch (error: any) {
      if (error?.name === 'NotAllowedError') {
        message.info(`화면공유 권한 설정을 확인해주세요.`);
        store.dispatch(userActions.changeScreenShareStatus(false));
      }
    }
  }

  @messageId(SCREEN_SHARE_MESSAGE_ID.CONNECTED)
  connected(protocol: Protocol) {
    store.dispatch(
      roomActions.setMemberScreenShareStatus({
        userKey: protocol.data.userKey,
        screenShareStatus: true,
      }),
    );
  }

  @messageId(SCREEN_SHARE_MESSAGE_ID.DISCONNECT)
  disconnect(protocol: Protocol) {
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
