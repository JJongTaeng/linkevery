import { category } from '../../decorators/category';
import type { Protocol } from '../../constants/protocol';
import {
  CATEGORY,
  HandlerFunction,
  SIGNALING_MESSAGE_ID,
} from '../../constants/protocol';
import { DispatchEvent } from '../dispatch/DispatchEvent';
import { RTCManagerService } from '../rtc/RTCManagerService';
import { messageId } from '../../decorators/messageId';
import { store } from '../../store/store';
import { roomActions } from '../../store/features/roomSlice';
import { SdpType } from '../rtc/RTCPeerService';
import { protocol } from 'socket.io-client';
import { RTCManager, rtcManager } from '../rtc/RTCManager';
import { storage } from '../storage/StorageService';

interface SignalingHandlerInterface {
  start: HandlerFunction;
  offer: HandlerFunction;
  answer: HandlerFunction;
  ice: HandlerFunction;
  createDataChannel: HandlerFunction;
  connectDataChannel: HandlerFunction;
  end: HandlerFunction;
  endOk: HandlerFunction;
}

@category(CATEGORY.SIGNALING)
export class SignalingHandler implements SignalingHandlerInterface {
  @messageId(SIGNALING_MESSAGE_ID.START)
  async start(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: {
      dispatch: DispatchEvent;
      rtcManager: RTCManagerService;
    },
  ) {
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
  }

  @messageId(SIGNALING_MESSAGE_ID.OFFER)
  async offer(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: {
      dispatch: DispatchEvent;
      rtcManager: RTCManagerService;
    },
  ) {
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
  }

  @messageId(SIGNALING_MESSAGE_ID.ANSWER)
  answer(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: {
      dispatch: DispatchEvent;
      rtcManager: RTCManagerService;
    },
  ) {
    const { answer } = protocol.data;
    const { from } = protocol;
    const rtcPeer = rtcManager.getPeer(from);
    rtcPeer.setSdp({ sdp: answer, type: SdpType.remote });
    dispatch.sendSignalingCreateDataChannelMessage({ to: from });
  }

  @messageId(SIGNALING_MESSAGE_ID.ICE)
  ice(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: {
      dispatch: DispatchEvent;
      rtcManager: RTCManagerService;
    },
  ) {
    const { ice } = protocol.data;
    const rtcPeer = rtcManager.getPeer(protocol.from);
    rtcPeer.setIcecandidate(ice);
  }

  @messageId(SIGNALING_MESSAGE_ID.CREATE_DATA_CHANNEL)
  createDataChannel(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: {
      dispatch: DispatchEvent;
      rtcManager: RTCManagerService;
    },
  ) {
    const { from } = protocol;
    const rtcPeer = rtcManager.getPeer(from);
    rtcPeer.onDataChannel((e) => {
      console.debug('[open datachannel]', from);
      dispatch.sendSignalingEndMessage({});

      rtcPeer.dataChannel = e.channel;
      rtcPeer.onDataChannelMessage((e) => {
        const parsedMessage = {
          ...JSON.parse(e.data),
        };
        rtcManager.emit(RTCManager.RTC_EVENT.DATA, parsedMessage);
      });
    });
    dispatch.sendSignalingConnectDataChannelMessage({ to: from });
  }

  @messageId(SIGNALING_MESSAGE_ID.CONNECT_DATA_CHANNEL)
  connectDataChannel(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: {
      dispatch: DispatchEvent;
      rtcManager: RTCManagerService;
    },
  ): void {
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
        };
        rtcManager.emit(RTCManager.RTC_EVENT.DATA, parsedMessage);
      });
  }

  @messageId(SIGNALING_MESSAGE_ID.END)
  end(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: { dispatch: DispatchEvent; rtcManager: RTCManagerService },
  ) {
    const { from } = protocol;

    if (store.getState().user.voiceStatus) {
      dispatch.sendVoiceReadyMessage({});
    }

    dispatch.sendRoomMemberNamePreMessage({ to: from });
    dispatch.sendSignalingEndOkMessage({});
  }

  @messageId(SIGNALING_MESSAGE_ID.END_OK)
  endOk(
    protocol: Protocol,
    {
      dispatch,
      rtcManager,
    }: { dispatch: DispatchEvent; rtcManager: RTCManagerService },
  ): any {
    const { from } = protocol;
  }
}
