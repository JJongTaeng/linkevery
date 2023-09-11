import { MessageAssembleInterface } from './MessageAssembleInterface';

export class MessageAssemble implements MessageAssembleInterface {
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
}
