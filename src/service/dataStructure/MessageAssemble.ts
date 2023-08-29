import { MessageAssembleService } from './MessageAssembleService';

export class MessageAssemble implements MessageAssembleService {
  stack: any[] = [];
  push(data: any): void {
    this.stack.push(data);
  }
  pop(data: any) {
    return this.stack.pop();
  }
  clear(): void {
    this.stack = [];
  }
  getJoinedMessage() {
    return this.stack.join('');
  }
  getStack(): any[] {
    return this.stack;
  }
}
