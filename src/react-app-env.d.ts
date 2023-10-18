/// <reference types="react-scripts" />
export {};

declare global {
  interface Window {
    debug: any;
    dataLayer: any[];
  }
}
