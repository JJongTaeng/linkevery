export interface StackService {
  stack: any[];
  push(data: any): void;
  pop(data: any): any;
  clear(): void;

  getStack(): any[];
}
