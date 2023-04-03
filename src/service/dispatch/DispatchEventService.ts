import { Protocol } from "../../constants/protocol";

export abstract class DispatchEventService {
  constructor() {}

  public abstract send(protocol: Protocol): void;
}
