import {
  CONNECTION_MESSAGE_ID,
  HandlerMap,
  Protocol,
} from "../../constants/protocol";
import { DispatchEvent } from "../dispatch/DispatchEvent";
import { ERROR_TYPE } from "../../error/error";
import { config, RTCManager } from "../rtc/RTCManager";
import { StorageService } from "../storage/StorageService";
import { SdpType } from "../rtc/RTCPeerService";

const storage = StorageService.getInstance();
const rtcManager = RTCManager.getInstance();

// @ts-ignore
window.rtcManager = rtcManager;

export const connectionHandlers: HandlerMap<CONNECTION_MESSAGE_ID> = {
  [CONNECTION_MESSAGE_ID.JOIN]: (protocol, dispatch) => {
    const clientId = protocol.data.clientId;
    const roomName = "room";
    storage.setItem("clientId", clientId);
    dispatch.connectMessage({
      clientId,
      roomName,
    });
  },
  [CONNECTION_MESSAGE_ID.CONNECT]: async (
    protocol: Protocol,
    dispatch: DispatchEvent
  ) => {
    const peerId = protocol.data.peerId;
    const clientId = storage.getItem("clientId");
    if (!peerId || !clientId) throw new Error(ERROR_TYPE.INVALID_PEER_ID);

    rtcManager.createPeer(peerId);
    const rtcPeer = rtcManager.getPeer(peerId);
    rtcPeer.createPeerConnection(config);
    rtcPeer.createDataChannel(peerId, (datachannel) => {
      if (!datachannel) throw new Error(ERROR_TYPE.INVALID_DATACHANNEL);
      datachannel.addEventListener("message", (message) => {
        rtcManager.emit(RTCManager.RTC_EVENT.DATA, JSON.parse(message.data));
      });
    });

    rtcPeer.onIceCandidate((ice) => {
      dispatch.iceMessage({
        peerId,
        clientId,
        ice,
      });
    });

    const offer = await rtcPeer.createOffer();
    rtcPeer.setSdp({ sdp: offer, type: SdpType.local });
    dispatch.offerMessage({ offer, peerId, clientId });
  },
  [CONNECTION_MESSAGE_ID.DISCONNECT]: (protocol, dispatch) => {
    const { peerId } = protocol.data;
    rtcManager.removePeer(peerId);
  },
};
