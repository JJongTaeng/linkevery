import { Protocol } from "./protocol";

export abstract class DispatchEventService {
  constructor() {}

  public abstract send(protocol: Protocol): void;
}
