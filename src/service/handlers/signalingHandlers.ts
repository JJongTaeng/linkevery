import { HandlerMap, SIGNALING_MESSAGE_ID } from '../../constants/protocol';
import { ERROR_TYPE } from '../../error/error';
import { RTCManager, config } from '../rtc/RTCManager';
import { SdpType } from '../rtc/RTCPeerService';
import { StorageService } from '../storage/StorageService';

const storage = StorageService.getInstance();

export const signalingHandlers: HandlerMap<SIGNALING_MESSAGE_ID> = {
  [SIGNALING_MESSAGE_ID.OFFER]: async (protocol, { dispatch, rtcManager }) => {
    const clientId = storage.getItem('clientId');
    const { peerId, offer } = protocol.data;
    rtcManager.createPeer(peerId);
    const rtcPeer = rtcManager.getPeer(peerId);
    rtcPeer.createPeerConnection(config);
    rtcPeer.connectDataChannel((datachannel: RTCDataChannel) => {
      if (!datachannel) throw new Error(ERROR_TYPE.INVALID_DATACHANNEL);

      datachannel.addEventListener('message', (message) => {
        rtcManager.emit(RTCManager.RTC_EVENT.DATA, JSON.parse(message.data));
      });
      console.debug('open datachannel peerId = ', peerId);
      // const stringify = JSON.stringify(createDataChannelMessage({}));
      // datachannel.send(stringify);
      dispatch.sendCreateDataChannelMessage({});
    });

    rtcPeer.onIceCandidate((ice) => {
      dispatch.sendIceMessage({
        peerId,
        clientId,
        ice,
      });
    });

    await rtcPeer.setSdp({ sdp: offer, type: SdpType.remote });
    const answer = await rtcPeer.createAnswer();
    await rtcPeer.setSdp({ sdp: answer, type: SdpType.local });
    dispatch.snedAnswerMessage({
      answer,
      clientId,
      peerId,
    });
  },
  [SIGNALING_MESSAGE_ID.ANSWER]: (protocol, { dispatch, rtcManager }) => {
    const { peerId, answer } = protocol.data;
    const rtcPeer = rtcManager.getPeer(peerId);
    rtcPeer.setSdp({ sdp: answer, type: SdpType.remote });
  },
  [SIGNALING_MESSAGE_ID.ICE]: (protocol, { dispatch, rtcManager }) => {
    const { peerId, ice } = protocol.data;
    const rtcPeer = rtcManager.getPeer(peerId);
    rtcPeer.setIcecandidate(ice);
  },
  [SIGNALING_MESSAGE_ID.CREATE_DATA_CHANNEL]: (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const username = storage.getItem('username');
    const clientId = storage.getItem('clientId');
    dispatch.sendRequestMemberMessage({ username, clientId });
  },
};
