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
    const { roomName } = protocol.data;
    const { from } = protocol;
    console.log(from);
    if (!from) throw new Error(ERROR_TYPE.INVALID_PEER_ID);

    rtcManager.createPeer(from);
    const rtcPeer = rtcManager.getPeer(from);
    rtcPeer.createPeerConnection(config);
    rtcPeer.createDataChannel(roomName, (datachannel) => {
      if (!datachannel) throw new Error(ERROR_TYPE.INVALID_DATACHANNEL);
      datachannel.addEventListener('message', (message) => {
        rtcManager.emit(RTCManager.RTC_EVENT.DATA, JSON.parse(message.data));
      });
      dispatch.sendCreateDataChannelMessage({ to: from });
    });

    rtcPeer.onIceCandidate((ice) => {
      dispatch.sendIceMessage({
        to: from,
        ice,
      });
    });

    const offer = await rtcPeer.createOffer();
    rtcPeer.setSdp({ sdp: offer, type: SdpType.local });
    dispatch.sendOfferMessage({ offer, to: from });
  },
  [CONNECTION_MESSAGE_ID.DISCONNECT]: (protocol, { rtcManager }) => {
    const { from } = protocol;
    rtcManager.removePeer(from);
  },
};
