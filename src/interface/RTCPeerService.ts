import { Protocol } from "../test/protocol";

export enum SdpType {
  "local" = "local",
  "remote" = "remote",
}

export enum PeerConnectionState {
  failed = "failed",
  connecting = "connecting",
  disconnected = "disconnected",
  connected = "connected",
  newState = "newState",
}

export enum PeerSignalingState {
  stable = "stable",
  closed = "closed",
  haveLocalOffer = "haveLocalOffer",
  haveRemoteOffer = "haveRemoteOffer",
  haveLocalPranswer = "haveLocalPranswer",
  haveRemotePranswer = "haveRemotePranswer",
}

export type PeerConnectionStateHandlers = {
  [key in PeerConnectionState]?: () => void;
};

export type PeerSignalingStateHandlers = {
  [key in PeerSignalingState]?: () => void;
};

export abstract class RTCPeerService {
  public abstract createPeerConnection(config: RTCConfiguration): void;

  public abstract createDataChannel(
    id: string,
    fn: (datachannel: RTCDataChannel) => void
  ): void;
  public abstract connectDataChannel(
    fn: (datachannel: RTCDataChannel) => void
  ): void;

  public abstract createAnswer(
    option: RTCAnswerOptions
  ): Promise<RTCSessionDescriptionInit>;

  public abstract createOffer(
    option: RTCOfferOptions
  ): Promise<RTCSessionDescriptionInit>;

  public abstract getSdp(type: SdpType): RTCSessionDescription | null;

  public abstract setSdp({
    sdp,
    type,
  }: {
    sdp: RTCSessionDescriptionInit;
    type: SdpType;
  }): Promise<void>;

  public abstract getPeer(): RTCPeerConnection | undefined;

  public abstract getDataChannel(): RTCDataChannel | undefined;

  public abstract closePeer(): void;

  public abstract onChangeConnectionState(
    handlerMap: PeerConnectionStateHandlers
  ): void;

  public abstract onChangeSignalingState(
    handlerMap: PeerSignalingStateHandlers
  ): void;

  public abstract sendMessage(protocol: Protocol): void;
}
