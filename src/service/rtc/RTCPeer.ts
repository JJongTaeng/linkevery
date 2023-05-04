import { Protocol } from '../../constants/protocol';
import { ERROR_TYPE } from '../../error/error';
import { audioManager } from '../audio/AudioManager';
import {
  PeerConnectionStateHandlers,
  PeerSignalingStateHandlers,
  RTCPeerService,
  SdpType,
} from './RTCPeerService';

export class RTCPeer extends RTCPeerService {
  private peer?: RTCPeerConnection;
  private dataChannel?: RTCDataChannel;
  private peerStream?: MediaStream;
  private videoSender?: RTCRtpSender;
  private audioSender?: RTCRtpSender;

  constructor() {
    super();
  }

  public createPeerConnection(config: RTCConfiguration) {
    this.peer = new RTCPeerConnection(config);
  }

  public createDataChannel(
    id: string,
    fn: (datachannel: RTCDataChannel) => void,
  ) {
    if (!this.peer) {
      throw new Error(ERROR_TYPE.INVALID_PEER);
    }
    this.dataChannel = this.peer.createDataChannel(id);
    this.dataChannel.onopen = () => {
      fn(this.dataChannel!);
    };
    this.dataChannel.onclose = () => {};
  }

  public connectDataChannel(fn: (datachannel: RTCDataChannel) => void) {
    if (!this.peer) {
      throw new Error(ERROR_TYPE.INVALID_PEER);
    }
    this.peer.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      event.channel.onopen = () => {
        fn(event.channel);
      };
      event.channel.onclose = () => {
        // this.dataChannel = undefined;
      };
    };
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

  public getPeerStream() {
    return this.peerStream;
  }

  public closePeer() {
    if (!this.peer) {
      console.error('invalid peer', this.peer);
      return;
    }
    this.dataChannel?.close();
    this.peer?.close();
  }

  public onChangeConnectionState({
    connecting,
    disconnected,
    failed,
    connected,
    newState,
  }: PeerConnectionStateHandlers) {
    this.peer?.addEventListener('connectionstatechange', () => {
      switch (this.peer?.connectionState) {
        case 'failed':
          failed && failed();
          break;
        case 'connecting':
          connecting && connecting();
          break;
        case 'disconnected':
          disconnected && disconnected();
          break;
        case 'connected':
          connected && connected();
          break;
        case 'new':
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
      console.error('invalid peer', this.peer);
      return;
    }
    this.peer.addEventListener('signalingstatechange', () => {
      switch (this.peer?.signalingState) {
        case 'stable':
          stable && stable();
          break;
        case 'closed':
          closed && closed();
          break;
        case 'have-local-offer':
          haveLocalOffer && haveLocalOffer();
          break;
        case 'have-remote-offer':
          haveRemoteOffer && haveRemoteOffer();
          break;
        case 'have-local-pranswer':
          haveLocalPranswer && haveLocalPranswer();
          break;
        case 'have-remote-pranswer':
          haveRemotePranswer && haveRemotePranswer();
          break;
      }
    });
  }

  public onIceCandidate(fn: (ice: RTCIceCandidate) => void) {
    this.peer?.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        fn(event.candidate);
      }
    });
  }

  public onTrack(id: string) {
    this.peer?.addEventListener('track', (e) => {
      console.log('e', e);
      this.peerStream = e.streams[0];
      const videoTrack = this.peerStream.getVideoTracks()[0];
      if (videoTrack) {
        // const video = document.createElement('video');
        // video.srcObject = this.peerStream;
        // video.play();
        // video.autoplay = true;
        // document.body.appendChild(video);
      } else {
        audioManager.addAudio(id, this.peerStream);
      }
    });
  }

  public addTrack(track: MediaStreamTrack, stream: MediaStream) {
    if (stream.getVideoTracks()[0]) {
      this.videoSender = this.peer?.addTrack(track, stream);
    } else {
      this.audioSender = this.peer?.addTrack(track, stream);
    }
  }

  public removeAudioTrack() {
    if (!this.audioSender) return;
    this.peer?.removeTrack(this.audioSender);
  }

  public removeVideoTrack() {
    if (!this.videoSender) return;
    this.peer?.removeTrack(this.videoSender);
  }

  public sendMessage(protocol: Protocol) {
    if (!this.dataChannel) throw new Error(ERROR_TYPE.INVALID_DATACHANNEL);
    const stringify = JSON.stringify(protocol);
    this.dataChannel.send(stringify);
  }

  private isLocalSdp(type: SdpType) {
    return type === SdpType.local;
  }
}
