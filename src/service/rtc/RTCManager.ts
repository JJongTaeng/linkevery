import { RTCManagerService } from "./RTCManagerService";
import { RTCPeer } from "./RTCPeer";
import { ERROR_TYPE } from "../../error/error";
import { Protocol } from "../../constants/protocol";

export const config = {
  iceServers: [
    {
      urls: ["stun:ntk-turn-1.xirsys.com"],
    },
    {
      username: process.env.REACT_APP_RTC_CONFIG_USERNAME,
      credential: process.env.REACT_APP_RTC_CONFIG_CREDENTIAL,
      urls: [
        "turn:ntk-turn-1.xirsys.com:80?transport=udp",
        "turn:ntk-turn-1.xirsys.com:3478?transport=udp",
        "turn:ntk-turn-1.xirsys.com:80?transport=tcp",
        "turn:ntk-turn-1.xirsys.com:3478?transport=tcp",
        "turns:ntk-turn-1.xirsys.com:443?transport=tcp",
        "turns:ntk-turn-1.xirsys.com:5349?transport=tcp",
      ],
    },
  ],
};

export class RTCManager extends RTCManagerService {
  private peerMap = new Map<string, RTCPeer>();
  private static instance: RTCManager;
  public static RTC_EVENT = {
    DATA: "RTC_DATA",
  };

  constructor() {
    super();
  }

  createPeer(id: string): void {
    if (this.peerMap.has(id)) return;
    const peer = new RTCPeer();
    this.peerMap.set(id, peer);
  }

  getPeer(id: string): RTCPeer {
    const peer = this.peerMap.get(id);
    if (!peer) throw new Error(ERROR_TYPE.INVALID_PEER);
    return peer;
  }

  sendAll(protocol: Protocol) {
    this.peerMap.forEach((peer, key) => {
      const datachannel = peer.getDataChannel();
      if (!datachannel) throw new Error(ERROR_TYPE.INVALID_DATACHANNEL);
      const stringify = JSON.stringify(protocol);
      if (datachannel.readyState === "open") datachannel.send(stringify);
    });
  }

  removePeer(id: string): void {
    const peer = this.getPeer(id);
    peer.closePeer();
    this.peerMap.delete(id);
  }

  clearPeerMap(): void {
    this.peerMap.forEach((peer, key) => {
      peer.closePeer();
      this.peerMap.delete(key);
    });
  }
}
