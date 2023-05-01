import {
  HandlerMap,
  RTC_MANAGER_TYPE,
  SIGNALING_MESSAGE_ID,
} from '../../constants/protocol';
import { ERROR_TYPE } from '../../error/error';
import { roomActions } from '../../store/features/roomSlice';
import { store } from '../../store/store';
import { RTCManager, config } from '../rtc/RTCManager';
import { SdpType } from '../rtc/RTCPeerService';
import { StorageService } from '../storage/StorageService';

const storage = StorageService.getInstance();

export const signalingHandlers: HandlerMap<SIGNALING_MESSAGE_ID> = {
  [SIGNALING_MESSAGE_ID.JOIN_ROOM]: async (
    protocol,
    { dispatch, rtcManager, rtcManagerMap },
  ) => {
    const { roomName, size, rtcType }: any = protocol.data;
    const { from } = protocol;
    if (!from) throw new Error(ERROR_TYPE.INVALID_PEER_ID);
    if (
      (rtcType === RTC_MANAGER_TYPE.RTC_VOICE ||
        rtcType === RTC_MANAGER_TYPE.RTC_SCREEN_SHARE) &&
      !store.getState().voice.status
    ) {
      return;
    }
    const rtc = rtcManagerMap[rtcType as RTC_MANAGER_TYPE];
    rtc.createPeer(from);
    const rtcPeer = rtc.getPeer(from);
    rtcPeer.createPeerConnection(config);
    rtcPeer.onIceCandidate((ice) => {
      dispatch.sendIceMessage({
        to: from,
        ice,
        rtcType,
      });
    });
    switch (rtcType) {
      case RTC_MANAGER_TYPE.RTC_CHAT:
        store.dispatch(roomActions.setMemberSize(size));

        rtcPeer.createDataChannel(roomName, (datachannel) => {
          if (!datachannel) throw new Error(ERROR_TYPE.INVALID_DATACHANNEL);
          datachannel.addEventListener('message', (message: any) => {
            rtcManager.emit(
              RTCManager.RTC_EVENT.DATA,
              JSON.parse(message.data),
            );
          });
          console.debug('open datachannel = ', from);
          dispatch.sendCreateDataChannelMessage({ to: from });
        });
        break;
      case RTC_MANAGER_TYPE.RTC_VOICE:
        if (!store.getState().voice.status) {
          return;
        }
        rtcPeer.onTrack(from);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        mediaStream?.getTracks().forEach((track) => {
          rtcPeer.addTrack(track, mediaStream);
        });
        break;
      case RTC_MANAGER_TYPE.RTC_SCREEN_SHARE:
        break;
    }
    const offer = await rtcPeer.createOffer();
    rtcPeer.setSdp({ sdp: offer, type: SdpType.local });
    dispatch.sendOfferMessage({ offer, to: from, rtcType });
  },

  [SIGNALING_MESSAGE_ID.OFFER]: async (
    protocol,
    { dispatch, rtcManager, rtcManagerMap },
  ) => {
    const { offer, rtcType } = protocol.data;
    const { from } = protocol;
    const rtc = rtcManagerMap[rtcType as RTC_MANAGER_TYPE];
    rtc.createPeer(from);
    const rtcPeer = rtc.getPeer(from);
    rtcPeer.createPeerConnection(config);
    rtcPeer.onIceCandidate((ice) => {
      dispatch.sendIceMessage({
        to: from,
        ice,
        rtcType,
      });
    });
    await rtcPeer.setSdp({ sdp: offer, type: SdpType.remote });
    switch (rtcType) {
      case RTC_MANAGER_TYPE.RTC_CHAT:
        rtcPeer.connectDataChannel((datachannel: RTCDataChannel) => {
          if (!datachannel) throw new Error(ERROR_TYPE.INVALID_DATACHANNEL);

          datachannel.addEventListener('message', (message) => {
            rtcManager.emit(
              RTCManager.RTC_EVENT.DATA,
              JSON.parse(message.data),
            );
          });
          console.debug('open datachannel = ', from);
          dispatch.sendCreateDataChannelMessage({ to: from });
        });

        break;
      case RTC_MANAGER_TYPE.RTC_VOICE:
        rtcPeer.onTrack(from);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        mediaStream?.getTracks().forEach((track) => {
          rtcPeer.addTrack(track, mediaStream);
        });
        break;
      case RTC_MANAGER_TYPE.RTC_SCREEN_SHARE:
        break;
    }
    const answer = await rtcPeer.createAnswer();
    await rtcPeer.setSdp({ sdp: answer, type: SdpType.local });
    dispatch.sendAnswerMessage({
      answer,
      to: from,
      rtcType,
    });
  },
  [SIGNALING_MESSAGE_ID.ANSWER]: (protocol, { rtcManagerMap }) => {
    const { answer, rtcType } = protocol.data;
    const rtc = rtcManagerMap[rtcType as RTC_MANAGER_TYPE];
    const rtcPeer = rtc.getPeer(protocol.from);
    rtcPeer.setSdp({ sdp: answer, type: SdpType.remote });
  },
  [SIGNALING_MESSAGE_ID.ICE]: (protocol, { rtcManagerMap }) => {
    const { ice, rtcType } = protocol.data;
    const rtc = rtcManagerMap[rtcType as RTC_MANAGER_TYPE];
    const rtcPeer = rtc.getPeer(protocol.from);
    rtcPeer.setIcecandidate(ice);
  },
  [SIGNALING_MESSAGE_ID.CREATE_DATA_CHANNEL]: (protocol, { dispatch }) => {
    const username = storage.getItem('username');
    dispatch.sendRequestMemberMessage({ username, to: protocol.from });
  },
};
