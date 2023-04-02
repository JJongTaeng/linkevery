import EventEmitter from "events";
import { RTCPeer } from "../service/RTCPeer";
import { Protocol } from "../test/protocol";

export abstract class RTCManagerService extends EventEmitter {
  constructor() {
    super();
  }

  public abstract createPeer(id: string): void;

  public abstract getPeer(id: string): RTCPeer;

  public abstract sendAll(protocol: Protocol): void;

  public abstract removePeer(id: string): void;

  public abstract clearPeerMap(): void;
}
