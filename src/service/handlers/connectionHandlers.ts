import { CONNECTION_MESSAGE_ID, HandlerMap } from '../../constants/protocol';
import { ERROR_TYPE } from '../../error/error';
import { RTCManager, config } from '../rtc/RTCManager';
import { SdpType } from '../rtc/RTCPeerService';
import { StorageService } from '../storage/StorageService';

const storage = StorageService.getInstance();

export const connectionHandlers: HandlerMap<CONNECTION_MESSAGE_ID> = {
  [CONNECTION_MESSAGE_ID.CONNECT]: (protocol, { dispatch }) => {
    const { clientId } = protocol.data;
    storage.setItem('clientId', clientId);
  },
  [CONNECTION_MESSAGE_ID.JOIN_ROOM]: async (
    protocol,
    { dispatch, rtcManager },
  ) => {
    const { peerId, roomName } = protocol.data;

    const clientId = storage.getItem('clientId');
    if (!peerId || !clientId) throw new Error(ERROR_TYPE.INVALID_PEER_ID);

    rtcManager.createPeer(peerId);
    const rtcPeer = rtcManager.getPeer(peerId);
    rtcPeer.createPeerConnection(config);
    rtcPeer.createDataChannel(roomName, (datachannel) => {
      if (!datachannel) throw new Error(ERROR_TYPE.INVALID_DATACHANNEL);
      datachannel.addEventListener('message', (message) => {
        rtcManager.emit(RTCManager.RTC_EVENT.DATA, JSON.parse(message.data));
      });
    });

    rtcPeer.onIceCandidate((ice) => {
      dispatch.sendIceMessage({
        peerId,
        clientId,
        ice,
      });
    });

    const offer = await rtcPeer.createOffer();
    rtcPeer.setSdp({ sdp: offer, type: SdpType.local });
    dispatch.sendOfferMessage({ offer, peerId, clientId });
  },
  [CONNECTION_MESSAGE_ID.DISCONNECT]: (protocol, { rtcManager }) => {
    const { peerId } = protocol.data;
    rtcManager.removePeer(peerId);
  },
};
