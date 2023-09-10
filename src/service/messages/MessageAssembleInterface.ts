export interface MessageAssembleInterface {
  stack: any[];
  push(data: any): void;
  pop(data: any): any;
  clear(): void;
}
