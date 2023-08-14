import { HandlerMap, SIGNALING_MESSAGE_ID } from '../../constants/protocol';
import { roomActions } from '../../store/features/roomSlice';
import { store } from '../../store/store';
import { RTCManager } from '../rtc/RTCManager';
import { SdpType } from '../rtc/RTCPeerService';
import { storage } from '../storage/StorageService';

export const signalingHandlers: HandlerMap<SIGNALING_MESSAGE_ID> = {
  [SIGNALING_MESSAGE_ID.START]: async (protocol, { dispatch, rtcManager }) => {
    const { roomName, size } = protocol.data;
    const { from } = protocol;
    store.dispatch(roomActions.setMemberSize(size));
    rtcManager.createPeer(from);
    const rtcPeer = rtcManager.getPeer(from);
    rtcPeer
      .onIceCandidate((ice) => {
        dispatch.sendSignalingIceMessage({
          to: from,
          ice,
        });
      })
      .onTrack(from)
      .onNegotiationNeeded(async (e: any) => {
        if (e.currentTarget.signalingState === 'stable') {
          const offer = await rtcPeer.createOffer();
          rtcPeer.setSdp({ sdp: offer, type: SdpType.local });
          console.debug(
            '[negotiationneeded connection state] ',
            e.currentTarget?.connectionState,
          );
          dispatch.sendNegotiationOfferMessage({ offer, to: from });
        }
      })
      .onSignalingStateChange((e: any) => {
        console.debug('[signalingstate]', e.currentTarget.signalingState);
      })
      .onConnectionStateChange((e: any) => {
        console.debug(
          '[connection state change]',
          e.currentTarget.connectionState,
        );
      })
      .onIceConnectionStateChange((e: any) => {
        console.debug(
          '[ice connection state]',
          e.currentTarget.iceConnectionState,
        );
        if (e.currentTarget.iceConnectionState === 'failed') {
          rtcPeer.restartIce();
        }
      })
      .onIceCandidateError((e: any) => {
        console.debug('[ice candidate error]', e);
      });
    const offer = await rtcPeer.createOffer();
    rtcPeer.setSdp({ sdp: offer, type: SdpType.local });
    dispatch.sendSignalingOfferMessage({ offer, to: from, roomName });
  },
  [SIGNALING_MESSAGE_ID.OFFER]: async (protocol, { dispatch, rtcManager }) => {
    const { offer } = protocol.data;
    const { from } = protocol;
    // store.dispatch(roomActions.setMemberSize(size));
    rtcManager.createPeer(from);
    const rtcPeer = rtcManager.getPeer(from);
    rtcPeer
      .onIceCandidate((ice) => {
        dispatch.sendSignalingIceMessage({
          to: from,
          ice,
        });
      })
      .onTrack(from)
      .onNegotiationNeeded(async (e: any) => {
        if (e.currentTarget.signalingState === 'stable') {
          const offer = await rtcPeer.createOffer();
          rtcPeer.setSdp({ sdp: offer, type: SdpType.local });
          console.debug(
            '[negotiationneeded connection state] ',
            e.currentTarget?.connectionState,
          );
          dispatch.sendNegotiationOfferMessage({ offer, to: from });
        }
      })
      .onSignalingStateChange((e: any) => {
        console.debug('[signaling state]', e.currentTarget.signalingState);
      })
      .onConnectionStateChange((e: any) => {
        console.debug(
          '[connection state change]',
          e.currentTarget.connectionState,
        );
      })
      .onIceConnectionStateChange((e: any) => {
        console.debug(
          '[ice connection state]',
          e.currentTarget.iceConnectionState,
        );
        if (e.currentTarget.iceConnectionState === 'failed') {
          rtcPeer.restartIce();
        }
      })
      .onIceCandidateError((e: any) => {
        console.debug('[ice candidate error]', e);
      });

    await rtcPeer.setSdp({ sdp: offer, type: SdpType.remote });
    const answer = await rtcPeer.createAnswer();
    await rtcPeer.setSdp({ sdp: answer, type: SdpType.local });
    dispatch.sendSignalingAnswerMessage({
      answer,
      to: from,
    });
  },
  [SIGNALING_MESSAGE_ID.ANSWER]: (protocol, { dispatch, rtcManager }) => {
    const { answer } = protocol.data;
    const { from } = protocol;
    const rtcPeer = rtcManager.getPeer(from);
    rtcPeer.setSdp({ sdp: answer, type: SdpType.remote });
    dispatch.sendSignalingCreateDataChannelMessage({ to: from });
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
    const { from } = protocol;
    const rtcPeer = rtcManager.getPeer(from);
    rtcPeer.onDataChannel((e) => {
      console.debug('[open datachannel]', from);
      dispatch.sendSignalingEndMessage({});

      rtcPeer.dataChannel = e.channel;
      rtcPeer.onDataChannelMessage((e) => {
        const parsedMessage = {
          ...JSON.parse(e.data),
          data: JSON.parse(JSON.parse(e.data).data),
        };
        rtcManager.emit(RTCManager.RTC_EVENT.DATA, parsedMessage);
      });
    });
    dispatch.sendSignalingConnectDataChannelMessage({ to: from });
  },
  [SIGNALING_MESSAGE_ID.CONNECT_DATA_CHANNEL]: (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const roomName = storage.getItem('roomName');
    const { from } = protocol;
    const rtcPeer = rtcManager.getPeer(from);
    rtcPeer.createDataChannel(roomName);
    rtcPeer
      .onDataChannelOpen((e) => {
        console.debug('[open datachannel]', from);
      })
      .onDataChannelMessage((e) => {
        const parsedMessage = {
          ...JSON.parse(e.data),
          data: JSON.parse(JSON.parse(e.data).data),
        };
        rtcManager.emit(RTCManager.RTC_EVENT.DATA, parsedMessage);
      });
  },
  [SIGNALING_MESSAGE_ID.END]: (protocol, { dispatch, rtcManager }) => {
    const { from } = protocol;

    if (store.getState().user.voiceStatus) {
      dispatch.sendVoiceReadyMessage({});
    }

    dispatch.sendRoomMemberNamePreMessage({ to: from });
    dispatch.sendSignalingEndOkMessage({});

    console.log('end signaling !!');
  },
  [SIGNALING_MESSAGE_ID.END_OK]: (protocol, { dispatch, rtcManager }) => {
    const { from } = protocol;

    console.log('end signaling !!');
  },
};
