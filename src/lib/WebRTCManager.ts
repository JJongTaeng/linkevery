import EventEmitter from "events";
import { ERROR_TYPE } from "../error/error";

enum RTC_EVENT_TYPE {
  INIT = "INIT",
  OFFER = "OFFER",
  ANSWER = "ANSWER",
  CONNECTION = "CONNECTION",
  CONNECTED = "CONNECTED",
  MESSAGE = "MESSAGE",
  CONNECTING = "CONNECTING",
  NEW = "NEW",
  DISCONNECTED = "DISCONNECTED",
  FAILED = "FAILED",
  CLOSED = "CLOSED",
  STABLE = "STABLE",
  "HAVE_LOCAL_OFFER" = "HAVE_LOCAL_OFFER",
  "HAVE_REMOTE_OFFER" = "HAVE_REMOTE_OFFER",
  "HAVE_LOCAL_PRANSWER" = "HAVE_LOCAL_PRANSWER",
  "HAVE_REMOTE_PRANSWER" = "HAVE_REMOTE_PRANSWER",
}

type SdpType = "local" | "remote";

export class WebRTCManager extends EventEmitter {
  private static instance: WebRTCManager;
  public static RTC_EVENT = RTC_EVENT_TYPE;
  private peerMap = new Map<string, RTCPeerConnection>();
  private datachannelMap = new Map<string, RTCDataChannel>();

  constructor(private config: RTCConfiguration) {
    super();
    console.log("rtc manager created");
  }

  public static getInstance(config: RTCConfiguration) {
    if (!WebRTCManager.instance) {
      WebRTCManager.instance = new WebRTCManager(config);
    }
    return WebRTCManager.instance;
  }

  public createRTCPeer(id: string) {
    let peer = this.peerMap.get(id);
    if (peer) return peer;

    peer = new RTCPeerConnection(this.config);
    peer.onconnectionstatechange = (event) => {
      console.log(id, peer?.connectionState);
      switch (peer?.connectionState) {
        case "failed":
          this.emit(WebRTCManager.RTC_EVENT.FAILED);
          break;
        case "connecting":
          this.emit(WebRTCManager.RTC_EVENT.CONNECTING);
          break;
        case "disconnected":
          this.emit(WebRTCManager.RTC_EVENT.DISCONNECTED);
          // this.peerMap.delete(id);
          break;
        case "connected":
          this.emit(WebRTCManager.RTC_EVENT.CONNECTED);
          break;
        case "new":
          this.emit(WebRTCManager.RTC_EVENT.NEW);
          break;
      }
    };

    peer.onsignalingstatechange = (event) => {
      console.log(id, peer?.signalingState);
      switch (peer?.signalingState) {
        case "stable":
          this.emit(WebRTCManager.RTC_EVENT.STABLE);
          break;
        case "closed":
          this.emit(WebRTCManager.RTC_EVENT.CLOSED);
          break;
        case "have-local-offer":
          this.emit(WebRTCManager.RTC_EVENT.HAVE_LOCAL_OFFER);
          break;
        case "have-remote-offer":
          this.emit(WebRTCManager.RTC_EVENT.HAVE_REMOTE_OFFER);
          break;
        case "have-local-pranswer":
          this.emit(WebRTCManager.RTC_EVENT.HAVE_LOCAL_PRANSWER);
          break;
        case "have-remote-pranswer":
          this.emit(WebRTCManager.RTC_EVENT.HAVE_REMOTE_PRANSWER);
          break;
      }
    };
    this.peerMap.set(id, peer);
  }

  public setEventIcecandidate(
    id: string,
    handler: (ice: RTCIceCandidate) => void
  ) {
    const peer = this.getRTCPeer(id);
    if (!peer) throw new Error(ERROR_TYPE.INVALID_PEER);
    peer.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        console.log(4, "send ice", event.candidate);
        handler(event.candidate);
      }
    });
  }

  public setIcecandidate({ id, ice }: { id: string; ice: any }) {
    const peer = this.getRTCPeer(id);
    peer.addIceCandidate(ice);
  }

  public getRTCPeer(id: string): RTCPeerConnection {
    const peer = this.peerMap.get(id);
    if (!peer) throw new Error(ERROR_TYPE.INVALID_PEER);
    return peer!;
  }

  public getRTCDataChannel(id: string): RTCDataChannel {
    const datachannel = this.datachannelMap.get(id);
    if (!datachannel) throw new Error(ERROR_TYPE.INVALID_DATACHANNEL);
    return datachannel;
  }

  public getSdp({ id, type }: { id: string; type: SdpType }) {
    const peer = this.getRTCPeer(id);
    return WebRTCManager.isLocalSdp(type)
      ? peer.localDescription
      : peer.remoteDescription;
  }

  public async setSdp({
    id,
    sdp,
    type,
  }: {
    id: string;
    sdp: RTCSessionDescriptionInit;
    type: SdpType;
  }) {
    const peer = this.getRTCPeer(id);
    if (!peer) {
      throw new Error(ERROR_TYPE.INVALID_PEER);
    }
    if (WebRTCManager.isLocalSdp(type)) {
      console.log("setLocalSdp");
      await peer.setLocalDescription(sdp);
    } else {
      console.log("setRemoteSdp");
      await peer.setRemoteDescription(sdp);
    }
  }

  public async createAnswer({
    id,
    option,
  }: {
    id: string;
    option?: RTCOfferOptions | RTCAnswerOptions;
  }) {
    const peer = this.getRTCPeer(id);
    return await peer.createAnswer(option);
  }

  public async createOffer({
    id,
    option,
  }: {
    id: string;
    option?: RTCOfferOptions | RTCAnswerOptions;
  }) {
    const peer = this.getRTCPeer(id);
    return await peer.createOffer(option);
  }

  public createDataChannel(id: string) {
    const peer = this.getRTCPeer(id);
    const dataChannel = peer.createDataChannel(id);
    this.datachannelMap.set(id, dataChannel);
    dataChannel.onopen = () => {
      console.log("datachannel opened");
    };
    dataChannel.onmessage = (message) => {
      try {
        const parsed = JSON.parse(message.data);
        this.emit(WebRTCManager.RTC_EVENT.MESSAGE, parsed);
      } catch (e) {
        console.log("invalid message");
      }
    };
    dataChannel.onclose = () => {
      console.log("datachannel closed");
      this.datachannelMap.delete(id);
    };
  }

  public linkDataChannel(id: string) {
    const peer = this.getRTCPeer(id);
    peer.ondatachannel = (event) => {
      this.datachannelMap.set(id, event.channel);
      event.channel.onopen = () => {
        console.log("datachannel opened");
      };
      event.channel.onmessage = (message) => {
        try {
          const parsed = JSON.parse(message.data);
          this.emit(WebRTCManager.RTC_EVENT.MESSAGE, parsed);
        } catch (e) {
          console.log("invalid message");
        }
      };
      event.channel.onclose = () => {
        console.log("datachannel closed");
        this.datachannelMap.delete(id);
      };
    };
  }

  public sendDatachannelMessage(id: string) {}

  public sendAllDatachannelMessage(data: { name: string; message: string }) {
    const stringify = JSON.stringify(data);
    this.datachannelMap.forEach((dataChannel, key) => {
      if (dataChannel.readyState === "open") dataChannel.send(stringify);
    });
  }

  public log() {
    console.log(
      "peerMap = ",
      this.peerMap,
      "dataChannelMap = ",
      this.datachannelMap
    );
  }

  public clear() {
    this.datachannelMap.forEach((value) => {
      value.close();
    });
    this.peerMap.forEach((value) => {
      value.close();
    });
    this.datachannelMap.clear();
    this.peerMap.clear();
  }

  public removePeer(id: string) {
    const peer = this.getRTCPeer(id);
    peer.close();
    this.peerMap.delete(id);
  }

  public removeDataChannel(id: string) {
    const datachannel = this.getRTCDataChannel(id);
    datachannel.close();
    this.datachannelMap.delete(id);
  }

  private static isLocalSdp(type: SdpType) {
    return type === "local";
  }

  private static isOffer(type: "offer" | "answer") {
    return type === "offer";
  }
}
