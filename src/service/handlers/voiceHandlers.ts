import { HandlerMap, VOICE_MESSAGE_ID } from '../../constants/protocol';
import { UserStatus } from '../../store/features/userInfoSlice';
import { store } from '../../store/store';
import { config } from '../rtc/RTCManager';
import { SdpType } from '../rtc/RTCPeerService';

export const voiceHandlers: HandlerMap<VOICE_MESSAGE_ID> = {
  [VOICE_MESSAGE_ID.JOIN]: async (protocol, { dispatch, rtcVoiceManager }) => {
    // voice 상태 확인 후 connection 시작
    const { from } = protocol;
    if (store.getState().userInfo.status !== UserStatus.VOICE) {
      return;
    }

    rtcVoiceManager.createPeer(from);
    const rtcVoicePeer = rtcVoiceManager.getPeer(from);
    rtcVoicePeer.createPeerConnection(config);

    rtcVoicePeer.onTrack();

    rtcVoicePeer.onIceCandidate((ice) => {
      dispatch.sendIceMessage({
        to: from,
        ice,
      });
    });

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    mediaStream?.getTracks().forEach((track) => {
      const peer = rtcVoiceManager.getPeer(from);
      console.log(track, mediaStream);
      peer.addTrack(track, mediaStream);
    });

    const offer = await rtcVoicePeer.createOffer();
    rtcVoicePeer.setSdp({ sdp: offer, type: SdpType.local });
    // dispatch.sendOfferMessage({ offer, to: from }); voice offer로변경

    // dispatch.sendVoiceConnectionStartMessage({ to: from });
  },
  [VOICE_MESSAGE_ID.OFFER]: async (protocol, { dispatch, rtcVoiceManager }) => {
    const { offer } = protocol.data;
    const { from } = protocol;
    rtcVoiceManager.createPeer(from);
    const rtcVoicePeer = rtcVoiceManager.getPeer(from);
    rtcVoicePeer.createPeerConnection(config);
    rtcVoicePeer.onTrack();
    rtcVoicePeer.onIceCandidate((ice) => {
      dispatch.sendIceMessage({
        to: from,
        ice,
      });
    });

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    mediaStream?.getTracks().forEach((track) => {
      const peer = rtcVoiceManager.getPeer(from);
      console.log(track, mediaStream);
      peer.addTrack(track, mediaStream);
    });

    await rtcVoicePeer.setSdp({ sdp: offer, type: SdpType.remote });
    const answer = await rtcVoicePeer.createAnswer();
    await rtcVoicePeer.setSdp({ sdp: answer, type: SdpType.local });
    // dispatch.snedAnswerMessage({ voice answer dispatch로 변경
    //   answer,
    //   to: from,
    // });
  },
  [VOICE_MESSAGE_ID.ANSWER]: (protocol, { dispatch, rtcVoiceManager }) => {
    const { answer } = protocol.data;
    const rtcVoicePeer = rtcVoiceManager.getPeer(protocol.from);
    rtcVoicePeer.setSdp({ sdp: answer, type: SdpType.remote });
  },
  [VOICE_MESSAGE_ID.ICE]: (protocol, { dispatch, rtcVoiceManager }) => {
    const { ice } = protocol.data;
    const rtcVoicePeer = rtcVoiceManager.getPeer(protocol.from);
    rtcVoicePeer.setIcecandidate(ice);
  },
};
