import { StackService } from './StackService';

export class Stack implements StackService {
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
  getStack(): any[] {
    return this.stack;
  }
}
