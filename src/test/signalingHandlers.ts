import { HandlerMap, Protocol, SIGNALING_MESSAGE_ID } from "./protocol";
import { DispatchEvent } from "./DispatchEvent";
import { config, RTCManager } from "../lib/RTCManager";
import { SdpType } from "../interface/RTCPeerService";
import { StorageService } from "../lib/StorageService";
import { ERROR_TYPE } from "../error/error";

const storage = StorageService.getInstance();
const rtcManager = RTCManager.getInstance();

export const signalingHandlers: HandlerMap<SIGNALING_MESSAGE_ID> = {
  [SIGNALING_MESSAGE_ID.OFFER]: async (protocol, dispatch) => {
    const clientId = storage.getItem("clientId");
    const { peerId, offer } = protocol.data;
    rtcManager.createPeer(peerId);
    const rtcPeer = rtcManager.getPeer(peerId);
    rtcPeer.createPeerConnection(config);
    rtcPeer.connectDataChannel((datachannel: RTCDataChannel) => {
      if (!datachannel) throw new Error(ERROR_TYPE.INVALID_DATACHANNEL);
      datachannel.addEventListener("message", (message) => {
        rtcManager.emit(RTCManager.RTC_EVENT.DATA, JSON.parse(message.data));
      });
    });

    rtcPeer.onIceCandidate((ice) => {
      console.log("offer ice");
      dispatch.iceMessage({
        peerId,
        clientId,
        ice,
      });
    });

    await rtcPeer.setSdp({ sdp: offer, type: SdpType.remote });
    const answer = await rtcPeer.createAnswer();
    await rtcPeer.setSdp({ sdp: answer, type: SdpType.local });
    dispatch.answerMessage({
      answer,
      clientId,
      peerId,
    });
  },
  [SIGNALING_MESSAGE_ID.ANSWER]: (protocol, dispatch) => {
    const { peerId, answer } = protocol.data;
    const rtcPeer = rtcManager.getPeer(peerId);
    rtcPeer.setSdp({ sdp: answer, type: SdpType.remote });
  },
  [SIGNALING_MESSAGE_ID.ICE]: (protocol, dispatch) => {
    const { peerId, ice } = protocol.data;
    const rtcPeer = rtcManager.getPeer(peerId);
    rtcPeer.setIcecandidate(ice);
  },
};
