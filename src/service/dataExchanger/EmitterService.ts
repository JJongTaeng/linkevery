import { PeerEvent } from 'constants/peerEvent';

export interface EmitterService {
  send(protocol: PeerEvent): void;
}
