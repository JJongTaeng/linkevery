import { EventType } from '../../constants/eventType';
import { ERROR_TYPE } from 'error/error';
import { config } from './RTCManager';
import { RTCPeerService, SdpType } from './RTCPeerService';

export class RTCPeer extends RTCPeerService {
  private peer: RTCPeerConnection = new RTCPeerConnection(config);
  dataChannel?: RTCDataChannel;
  private videoStream?: MediaStream;
  private audioStream?: MediaStream;
  private videoSender?: RTCRtpSender;
  private audioSender?: RTCRtpSender;

  constructor() {
    super();
  }

  createDataChannel(label: string) {
    this.dataChannel = this.peer.createDataChannel(label);
  }

  closeDataChannel() {
    this.dataChannel?.close();
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

  public setIcecandidate(ice: RTCIceCandidate) {
    if (!this.peer) {
      throw new Error(ERROR_TYPE.INVALID_PEER);
    }
    this.peer.addIceCandidate(ice);
  }

  public getSdp(type: SdpType) {
    if (!this.peer) {
      throw new Error(ERROR_TYPE.INVALID_PEER);
    }
    return this.isLocalSdp(type)
      ? this.peer.localDescription
      : this.peer.remoteDescription;
  }

  public getPeer() {
    return this.peer;
  }

  public getDataChannel() {
    return this.dataChannel;
  }

  public getAudioStream() {
    return this.audioStream;
  }

  public getVideoStream() {
    return this.videoStream;
  }

  public closePeer() {
    if (!this.peer) {
      console.error('invalid peer', this.peer);
      return;
    }
    this.dataChannel?.close();
    this.peer?.close();
  }

  public onTrack(fn: (e: RTCTrackEvent) => void) {
    this.peer?.addEventListener('track', fn);

    return this;
  }

  public addTrack(track: MediaStreamTrack, stream: MediaStream) {
    if (stream.getVideoTracks()[0]) {
      this.videoStream = stream;
      try {
        if (this.videoSender) {
          this.peer?.removeTrack(this.videoSender);
        }
        this.videoSender = this.peer?.addTrack(track, stream);
      } catch (e) {
        console.log(e);
      }
    } else {
      this.audioStream = stream;
      this.audioSender = this.peer?.addTrack(track, stream);
    }
  }

  onSignalingStateChange(fn: (e: Event) => void) {
    this.peer.addEventListener('signalingstatechange', fn);
    return this;
  }

  onNegotiationNeeded(fn: (e: Event) => void) {
    this.peer.addEventListener('negotiationneeded', fn);
    return this;
  }

  public onIceCandidate(fn: (ice: RTCIceCandidate) => void) {
    this.peer?.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        fn(event.candidate);
      }
    });
    return this;
  }

  onIceConnectionStateChange(fn: (e: Event) => void) {
    this.peer.addEventListener('iceconnectionstatechange', fn);
    return this;
  }

  onConnectionStateChange(fn: (e: Event) => void) {
    this.peer.addEventListener('connectionstatechange', fn);
    return this;
  }

  onIceCandidateError(fn: (e: Event) => void) {
    this.peer.addEventListener('icecandidateerror', fn);
    return this;
  }

  onDataChannel(fn: (e: RTCDataChannelEvent) => void) {
    this.peer.addEventListener('datachannel', fn);
    return this;
  }

  onDataChannelOpen(fn: (e: Event) => void) {
    this.dataChannel?.addEventListener('open', fn);
    return this;
  }

  onDataChannelMessage(fn: (e: MessageEvent) => void) {
    this.dataChannel?.addEventListener('message', fn);
    return this;
  }

  public removeAudioTrack() {
    if (!this.audioSender) return;
    this.audioStream?.getTracks().forEach((track) => track.stop());
    this.audioStream = undefined;
    this.peer?.removeTrack(this.audioSender);
    this.audioSender = undefined;
  }

  public removeVideoTrack() {
    if (!this.videoSender) return;
    this.videoStream?.getTracks().forEach((track) => track.stop());
    this.videoStream = undefined;
    this.peer?.removeTrack(this.videoSender);
    this.videoSender = undefined;
  }

  public sendMessage(protocol: EventType) {
    if (!this.dataChannel) throw new Error(ERROR_TYPE.INVALID_DATACHANNEL);
    const stringify = JSON.stringify(protocol);
    this.dataChannel.send(stringify);
  }

  public restartIce() {
    this.peer.restartIce();
  }

  private isLocalSdp(type: SdpType) {
    return type === SdpType.local;
  }
}
