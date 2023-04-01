import { ERROR_TYPE } from "../error/error";
import {
  PeerConnectionStateHandlers,
  PeerSignalingStateHandlers,
  RTCPeerService,
  SdpType,
} from "../interface/RTCPeerService";

export abstract class RTCPeer extends RTCPeerService {
  private peer?: RTCPeerConnection;
  private dataChannel?: RTCDataChannel;

  constructor() {
    super();
  }

  public createPeerConnection(config: RTCConfiguration) {
    this.peer = new RTCPeerConnection(config);
  }

  public createDataChannel(id: string) {
    if (!this.peer) {
      throw new Error(ERROR_TYPE.INVALID_PEER);
    }
    this.dataChannel = this.peer.createDataChannel(id);
  }

  public async createAnswer(option?: RTCOfferOptions | RTCAnswerOptions) {
    if (!this.peer) {
      throw new Error(ERROR_TYPE.INVALID_PEER);
    }
    return await this.peer.createAnswer(option);
  }

  public async createOffer(option?: RTCOfferOptions | RTCAnswerOptions) {
    if (!this.peer) {
      throw new Error(ERROR_TYPE.INVALID_PEER);
    }
    return await this.peer.createOffer(option);
  }

  public getSdp(type: SdpType) {
    if (!this.peer) {
      throw new Error(ERROR_TYPE.INVALID_PEER);
    }
    return this.isLocalSdp(type)
      ? this.peer.localDescription
      : this.peer.remoteDescription;
  }

  public async setSdp({
    sdp,
    type,
  }: {
    sdp: RTCSessionDescriptionInit;
    type: SdpType;
  }) {
    if (!this.peer) {
      throw new Error(ERROR_TYPE.INVALID_PEER);
    }
    if (this.isLocalSdp(type)) {
      await this.peer.setLocalDescription(sdp);
    } else {
      await this.peer.setRemoteDescription(sdp);
    }
  }

  public getPeer() {
    return this.peer;
  }

  public getDataChannel() {
    return this.dataChannel;
  }

  public closePeer() {
    if (!this.peer) {
      console.error("invalid peer", this.peer);
      return;
    }
    this.peer?.close();
  }

  public onChangeConnectionState({
    connecting,
    disconnected,
    failed,
    connected,
    newState,
  }: PeerConnectionStateHandlers) {
    this.peer?.addEventListener("connectionstatechange", () => {
      switch (this.peer?.connectionState) {
        case "failed":
          failed && failed();
          break;
        case "connecting":
          connecting && connecting();
          break;
        case "disconnected":
          disconnected && disconnected();
          break;
        case "connected":
          connected && connected();
          break;
        case "new":
          newState && newState();
          break;
      }
    });
  }

  public onChangeSignalingState({
    stable,
    closed,
    haveRemotePranswer,
    haveLocalPranswer,
    haveRemoteOffer,
    haveLocalOffer,
  }: PeerSignalingStateHandlers) {
    if (!this.peer) {
      console.error("invalid peer", this.peer);
      return;
    }
    this.peer.addEventListener("signalingstatechange", () => {
      switch (this.peer?.signalingState) {
        case "stable":
          stable && stable();
          break;
        case "closed":
          closed && closed();
          break;
        case "have-local-offer":
          haveLocalOffer && haveLocalOffer();
          break;
        case "have-remote-offer":
          haveRemoteOffer && haveRemoteOffer();
          break;
        case "have-local-pranswer":
          haveLocalPranswer && haveLocalPranswer();
          break;
        case "have-remote-pranswer":
          haveRemotePranswer && haveRemotePranswer();
          break;
      }
    });
  }

  private isLocalSdp(type: SdpType) {
    return type === SdpType.local;
  }
}
