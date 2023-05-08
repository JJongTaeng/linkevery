import EventEmitter from 'events';
import { ERROR_TYPE } from '../../error/error';
import { RTCPeer } from './RTCPeer';

export abstract class RTCManagerService extends EventEmitter {
  constructor() {
    super();
  }
  readonly peerMap = new Map<string, RTCPeer>();

  createPeer(id: string): void {
    if (this.peerMap.has(id)) return;
    const peer = new RTCPeer();
    this.peerMap.set(id, peer);
  }
  getPeer(id: string): RTCPeer {
    const peer = this.peerMap.get(id);
    if (!peer) throw new Error(ERROR_TYPE.INVALID_PEER + `id = ${id}`);
    return peer;
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

  clearTrack(): void {
    this.peerMap.forEach((peer, key) => {
      peer.removeAudioTrack();
      peer.removeVideoTrack();
    });
  }

  clearVideoTrack(): void {
    this.peerMap.forEach((peer, key) => {
      peer.removeVideoTrack();
    });
  }

  isAllConnectedPeer(roomMemberSize: number): boolean {
    const peerSize = this.peerMap.size;

    return roomMemberSize - 1 === peerSize;
  }
}
