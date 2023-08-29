export interface MessageAssembleService {
  stack: any[];
  push(data: any): void;
  pop(data: any): any;
  clear(): void;

  getStack(): any[];
}
