import { CONNECTION_MESSAGE_ID, HandlerMap } from '../../constants/protocol';
import { ERROR_TYPE } from '../../error/error';
import { roomActions } from '../../store/features/room/roomSlice';
import { store } from '../../store/store';
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
    const { roomName, size } = protocol.data;
    const { from } = protocol;
    if (!from) throw new Error(ERROR_TYPE.INVALID_PEER_ID);
    store.dispatch(roomActions.setMemberSize(size));

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
    store.dispatch(roomActions.deleteMember({ clientId: from }));
    rtcManager.removePeer(from);
  },
};
