import { HandlerMap, SIGNALING_MESSAGE_ID } from '../../constants/protocol';
import { ERROR_TYPE } from '../../error/error';
import { roomActions } from '../../store/features/roomSlice';
import { store } from '../../store/store';
import { RTCManager, config } from '../rtc/RTCManager';
import { SdpType } from '../rtc/RTCPeerService';
import { StorageService } from '../storage/StorageService';

const storage = StorageService.getInstance();

export const signalingHandlers: HandlerMap<SIGNALING_MESSAGE_ID> = {
  [SIGNALING_MESSAGE_ID.START]: async (protocol, { dispatch, rtcManager }) => {
    const { roomName, size } = protocol.data;
    const { from } = protocol;
    store.dispatch(roomActions.setMemberSize(size));
    rtcManager.createPeer(from);
    const rtcPeer = rtcManager.getPeer(from);
    rtcPeer.createPeerConnection(config);
    rtcPeer.onIceCandidate((ice) => {
      dispatch.sendIceMessage({
        to: from,
        ice,
      });
    });
    rtcPeer.onTrack(from);
    rtcPeer.getPeer()!.onnegotiationneeded = async (e: any) => {
      const offer = await rtcPeer.createOffer();
      rtcPeer.setSdp({ sdp: offer, type: SdpType.local });
      console.debug('[connection state] ', e.currentTarget?.connectionState);
      if (e.currentTarget?.connectionState === 'new') {
        dispatch.sendOfferMessage({ offer, to: from, roomName });
      } else if (e.currentTarget?.connectionState === 'connected') {
        dispatch.sendNegotiationOfferMessage({ offer, to: from });
      }
    };
    rtcPeer.getPeer()?.addEventListener('connectionstatechange', (e: any) => {
      console.log(e.currentTarget.connectionState);
    });
    rtcPeer.createDataChannel(roomName, (datachannel) => {
      if (!datachannel) throw new Error(ERROR_TYPE.INVALID_DATACHANNEL);
      datachannel.addEventListener('message', (message) => {
        rtcManager.emit(RTCManager.RTC_EVENT.DATA, JSON.parse(message.data));
      });
      dispatch.sendCreateDataChannelMessage({ to: from });
    });
  },
  [SIGNALING_MESSAGE_ID.OFFER]: async (protocol, { dispatch, rtcManager }) => {
    const { offer, size } = protocol.data;
    const { from } = protocol;
    store.dispatch(roomActions.setMemberSize(size));
    rtcManager.createPeer(from);
    const rtcPeer = rtcManager.getPeer(from);
    rtcPeer.createPeerConnection(config);
    rtcPeer.onIceCandidate((ice) => {
      dispatch.sendIceMessage({
        to: from,
        ice,
      });
    });
    rtcPeer.onTrack(from);
    rtcPeer.getPeer()!.onnegotiationneeded = async (e: any) => {
      const offer = await rtcPeer.createOffer();
      rtcPeer.setSdp({ sdp: offer, type: SdpType.local });
      console.debug('[connection state] ', e.currentTarget?.connectionState);
      if (e.currentTarget?.connectionState === 'new') {
        dispatch.sendOfferMessage({ offer, to: from });
      } else if (e.currentTarget?.connectionState === 'connected') {
        dispatch.sendNegotiationOfferMessage({ offer, to: from });
      }
    };
    rtcPeer.getPeer()?.addEventListener('connectionstatechange', (e: any) => {
      console.log(e.currentTarget.connectionState);
    });
    rtcPeer.connectDataChannel((datachannel: RTCDataChannel) => {
      if (!datachannel) throw new Error(ERROR_TYPE.INVALID_DATACHANNEL);
      datachannel.addEventListener('message', (message) => {
        rtcManager.emit(RTCManager.RTC_EVENT.DATA, JSON.parse(message.data));
      });
      dispatch.sendCreateDataChannelMessage({ to: from });
    });

    await rtcPeer.setSdp({ sdp: offer, type: SdpType.remote });
    const answer = await rtcPeer.createAnswer();
    await rtcPeer.setSdp({ sdp: answer, type: SdpType.local });
    dispatch.sendAnswerMessage({
      answer,
      to: from,
    });
  },
  [SIGNALING_MESSAGE_ID.ANSWER]: (protocol, { dispatch, rtcManager }) => {
    const { answer } = protocol.data;
    const rtcPeer = rtcManager.getPeer(protocol.from);
    rtcPeer.setSdp({ sdp: answer, type: SdpType.remote });
  },
  [SIGNALING_MESSAGE_ID.ICE]: (protocol, { dispatch, rtcManager }) => {
    const { ice } = protocol.data;
    const rtcPeer = rtcManager.getPeer(protocol.from);
    rtcPeer.setIcecandidate(ice);
  },
  [SIGNALING_MESSAGE_ID.CREATE_DATA_CHANNEL]: (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const username = storage.getItem('username');
    const userKey = storage.getItem('userKey');
    dispatch.sendRequestMemberMessage({ username, to: protocol.from, userKey });
  },
};
