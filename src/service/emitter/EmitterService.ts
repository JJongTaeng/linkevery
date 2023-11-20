import { EventType } from '../../constants/eventType';

export interface EmitterService {
  send(protocol: EventType): void;
}
